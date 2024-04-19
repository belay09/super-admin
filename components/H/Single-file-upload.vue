<script setup>
import { useField } from "vee-validate";
// import upload_query from "@/queries/file_upload.gql";
// import mutator from "@/composables/mutator";

import upload_query from "@/graphql/mutations/file-upload/uploadMultiple.gql";
import mutator from "@/composables/auth-mutation.js";

import useNotify from "@/use/notify";

const props = defineProps({
	modelValue: {
		type: [String, Array],
	},
	label: String,
	folder: String,
	fileName: String,
	name: String,
	accept: {
		type: String,
	},
	rules: {
		type: [String, Object],
		default: "",
	},
	invalidFileSizeMessage: {
		type: String,
		default: "{0}: Invalid file size, file size should be smaller than {1}.",
	},
	invalidFileTypeMessage: {
		type: String,
		default: "{0}: Invalid file type, allowed file types: {1}.",
	},
	invalidFileLimitMessage: {
		type: String,
		default: "Maximum number of files exceeded, limit is {0} at most.",
	},
	fileLimit: { type: Number, default: 1 },
	maxFileSize: {
		type: Number,
		required: true,
	},
	disabled: Boolean,
});

const { notify } = useNotify();
const emits = defineEmits(["update:modelValue"]);
const fileName = ref("");
const file_Type = ref(null);
const image_file = ref(null);
const isClose = ref(false);
const modelValType = ref("");
const messages = ref([]);

watch(
	() => props.modelValue,
	(newVal) => {
		inputValue.value = newVal;
	}
);

onMounted(async () => {
	if (props.modelValue) {
		const { data } = await useFetch("/api/file_type", {
			method: "post",
			body: { file_url: props.modelValue },
		});
		file_Type.value = data.value;
	}
});
const secureUrl = ref({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emits("update:modelValue", newVal);
	},
});
const {
	errorMessage,
	value: inputValue,
	meta,
} = useField(props.name, props.rules, {
	initialValue: props.modelValue,
});

function validate(file) {
	if (props.accept && !isFileTypeValid(file)) {
		messages.value == null ? (messages.value = []) : messages.value;
		messages.value.push(
			props.invalidFileTypeMessage
				.replace("{0}", file.name)
				.replace("{1}", props.accept)
		);

		return false;
	}

	if (props.maxFileSize && file.size > props.maxFileSize) {
		messages.value == null ? (messages.value = []) : messages.value;
		messages.value.push(
			props.invalidFileSizeMessage
				.replace("{0}", file.name)
				.replace("{1}", formatSize(props.maxFileSize))
		);

		return false;
	}

	return true;
}

function formatSize(bytes) {
	if (bytes === 0) {
		return "0 B";
	}

	let k = 1000,
		dm = 1,
		sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
		i = Math.floor(Math.log(bytes) / Math.log(k));

	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function isFileTypeValid(file) {
	let acceptableTypes = props.accept.split(",").map((type) => type.trim());

	for (let type of acceptableTypes) {
		let acceptable = isWildcard(type)
			? getTypeClass(file.type) === getTypeClass(type)
			: file.type == type ||
			  getFileExtension(file).toLowerCase() === type.toLowerCase();

		if (acceptable) {
			return true;
		}
	}

	return false;
}

function isWildcard(fileType) {
	return fileType.indexOf("*") !== -1;
}

function getTypeClass(fileType) {
	return fileType.substring(0, fileType.indexOf("/"));
}

function getFileExtension(file) {
	return "." + file.name.split(".").pop();
}

const onFileSelect = (e) => {
	let files = e.target.files || e.dataTransfer.files;
	if (!files.length) return;
	isClose.value = true;
	file_Type.value = files[0].type;
	fileName.value = files[0].name;

	for (let file of files) {
		if (validate(file)) {
			createImage(file);
			function createImage(file) {
				var reader = new FileReader();
				reader.onload = (e) => {
					image_file.value = e.target.result;
				};
				reader.readAsDataURL(file);
			}
		} else {
			notify({
				title: "Invalid File!",
				description: messages.value[0].split(",")[1].split("_").join(" "),
				cardClass: "bg-orange-200 mt-14",
				icon: "simple-line-icons:check",
				iconClass: "text-orange-600",
				borderClass: "border-l-8 border-orange-600",
			});
		}
	}
};

const cancel = () => {
	image_file.value = "";
	isClose.value = false;
};

const { mutate, onError, onDone, loading } = mutator(upload_query);

const upload = (a) => {
	mutate({
		args: {
			base64Image: a.split(";base64,")[1],
			folder: props.folder,
		},
	});
};

onDone(({ data }) => {
	if (data) {
		secureUrl.value = data.uploadFiles.fileUrls[0];
		isClose.value = false;
		notify({
			title: "File Uploaded Successfully!",
			description: "File Uploaded Successfully!",
			cardClass: "bg-green-200 mt-14",
			icon: "line-md:confirm-circle",
			iconClass: "text-green-600",
			borderClass: "border-l-8 border-green-600",
		});
		emits("update:modelValue", secureUrl.value);
	}
});

function removeImage(e) {
	image.value = "";
}
</script>
<template>
	<div class="w-full">
		<ModalsModal
			:modelValue="!!image_file && isClose"
			:wrapperClass="
				file_Type?.includes('application/pdf')
					? 'w-1/2 h-full space-y-10 px-2 py-3 bg-white shadow-xl overflow-visible mt-20 relative'
					: 'w-full h-full space-y-10 px-2 py-3 bg-white shadow-xl overflow-visible mt-20 relative'
			"
			class="flex items-center justify-center w-auto h-full bg-black/40"
			:initialFocus="false"
		>
			<template #content>
				<div>
					<div
						class="flex flex-col justify-between items-center gap-y-10"
						:class="
							file_Type?.includes('image') ? 'w-96' : 'w-[500px] h-[500px]'
						"
						v-if="image_file"
					>
						<iframe
							:src="image_file"
							width="500"
							height="500"
							frameborder="0"
							v-if="file_Type == 'application/pdf'"
						/>
						<img
							:src="image_file"
							class="object-contain"
							v-if="file_Type?.includes('image')"
						/>
					</div>
					<div class="flex mx-auto gap-x-5 flex-wrap gap-y-5">
						<button
							:disabled="loading"
							v-if="image_file"
							class="bg-new-tale/20 px-5 py-1 rounded-md shadow-sm self-center flex items-center flex-1 min-w-[60px] justify-center disabled:cursor-wait disabled:bg-gray-400"
							type="button"
							@click="upload(image_file)"
						>
							<Icon
								v-if="loading"
								name="line-md:uploading-loop"
								width="30"
								height="30"
								color="#000"
							/>
							{{ loading ? "Uploading" : "Upload" }}
						</button>
						<button
							v-if="image_file"
							class="bg-new-tale/20 px-5 py-1 rounded-md shadow-sm self-center flex flex-1 min-w-[60px] justify-center"
							type="button"
							@click="cancel"
						>
							Cancel
						</button>
					</div>
				</div>
			</template>
		</ModalsModal>
		<div class="w-full">
			<div
				class="text-sm font-medium leading-6 text-gray-700 mb-1 flex gap-x-2"
			>
				{{ label }}
				<span
					class="text-red-600"
					v-if="rules.includes('required') && !disabled"
					>*</span
				>
			</div>
			<div
				:disabled="disabled"
				class="w-full border h-10 flex rounded-lg justify-between items-center relative z-10"
				:class="[
					errorMessage ? 'border-red-600' : '',
					disabled ? 'bg-gray-100' : '',
				]"
			>
				<div
					class="flex justify-center h-full rounded-l-md overflow-clip items-center w-12"
				>
					<Icon
						name="ion:attach-outline"
						width="30"
						height="30"
						color="gray"
						class="shrink-0"
					/>
				</div>
				<div
					class="h-full flex items-center flex-1 whitespace-nowrap overflow-clip gap-x-2 pl-5 capitalize"
					v-if="file_Type"
				>
					<Icon
						:name="
							file_Type == 'application/pdf'
								? 'vscode-icons:file-type-pdf2'
								: file_Type?.includes('image')
								? 'flat-color-icons:image-file'
								: 'solar:file-corrupted-broken'
						"
						class="text-4xl shrink-0"
					/>
					{{ file_Type ? `${file_Type?.split("/")[1]} File Selected` : "" }}
				</div>
				<input
					type="file"
					:id="name"
					:name="name"
					class="invisible w-0"
					:disabled="disabled"
					:accept="accept"
					@change="onFileSelect($event)"
				/>
				<p
					class="text-xs text-gray-500 mr-20 whitespace-nowrap"
					v-if="Object.keys(secureUrl).length <= 2 && !props.modelValue"
				>
					Upload an image png/jpg or pdf file up to 10mb
				</p>
				<label
					:for="name"
					class="cursor-pointer rounded-r-lg items-center flex relative h-full"
				>
					<div
						class="bg-gray-300 absolute right-0 flex gap-x-2 justify-center h-full rounded-r-md overflow-clip items-center right-left w-24 md:w-28 border focus:border-new-tale group-hover:border-new-tale"
					>
						<Icon
							name="lucide:upload"
							width="20"
							height="20"
							color="gray"
							class="shrink-0"
						/>
						Upload
					</div>
					Upload</label
				>
			</div>
			<!-- <p class="text-sm text-gray-500 my-2">
        Upload an image png/jpg or pdf file up to 10mb
      </p> -->
		</div>
		<p
			class="col-span-5 mt-1 font-body text-sm text-red-600 duration-300 transition-all"
			:class="errorMessage ? 'h-5' : 'h-0'"
			id="email-error"
		>
			{{ errorMessage }} &nbsp;
		</p>
	</div>
</template>
