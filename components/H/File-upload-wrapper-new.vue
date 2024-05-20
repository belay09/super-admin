<script setup>
import { useField } from "vee-validate";
import Loading from "./Loading.vue";
// import { getVideoThumbnail } from "video-thumbnails";

const props = defineProps({
	modelValue: {
		type: [Array, String, Object],
	},
	init: {
		type: [Array, String, Object],
	},
	name: {
		type: String,
	},
	rules: {
		type: [String, Object],
		default: "",
		required: false,
	},
	maxFileSize: {
		type: Number,
	},
	fileLimit: {
		type: Number,
	},
	folder: {
		type: String,
	},
	accept: {
		type: String,
	},
	description: {
		type: String,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
	showStar: {
		type: Boolean,
		default: false,
	},
	placeholder: {
		type: String,
		default: "Choose file",
	},
	thumbnails: {
		type: String,
	},
	emitSubmit: {
		type: Boolean,
		default: false,
	},
	loading: {
		type: Boolean,
		default: false,
	},
	selectedMediaType: {
		type: String,
		default: "",
	},
});

const emit = defineEmits([
	"update:modelValue",
	"update:thumbnails",
	"submitToDatabase",
	"update:selectedMediaType",
]);

const {
	errorMessage,
	value: inputValue,
	meta,
} = useField(props.name, props.rules, {
	initialValue: props.modelValue,
});
const uploadedFiles = ref([]);
const openModal = ref(false);

watchEffect(() => {
	if (props.init) {
		uploadedFiles.value = props.init;
	}
});

watch(
	() => uploadedFiles.value,
	(newVal) => {
		inputValue.value = newVal;
		emit("update:modelValue", newVal);
	}
);

const removeFile = (index) => {
	uploadedFiles.value.splice(index, 1);

	if (uploadedFiles.value?.length > 0) {
		thumbnail.value = uploadedFiles.value[0];
	}
};

function uploadDone() {}

const thumbnail = computed({
	get() {
		if (props.thumbnails && props.thumbnails != "") {
			emit("update:thumbnails", props.thumbnails);
			return props.thumbnails;
		} else if (props.modelValue.length > 0) {
			emit("update:thumbnails", props.modelValue[0]);
			return props.modelValue[0];
		} else {
			emit("update:thumbnails", "");
			return "";
		}
	},
	set(value) {
		emit("update:thumbnails", value);
	},
});

function makeThumbnail(image) {
	if (image.includes("mp4")) {
		return;
	}
	thumbnail.value = image;
}

function submitToDatabase() {
	emit("submitToDatabase");
}

function getFileType(file) {
	if (file.includes("mp4")) {
		return "video";
	} else if (file.includes("pdf")) {
		return "pdf";
	} else {
		return "Image";
	}
}

const mediaType = computed({
	get() {
		return props.selectedMediaType;
	},
	set(val) {
		emit("update:selectedMediaType", val);
	},
});
const openUploadFilesModal = ref(false);
const showSelectPortraitOrLandscape = ref(false);

const selectPortraitOrLandscape = (type) => {
	showSelectPortraitOrLandscape.value = false;
	mediaType.value = type;
	openUploadFilesModal.value = true;
};
</script>
<template>
	<div>
		<ClientOnly>
			<!-- <HFileUploadModal
        :name="name"
        :rules="rules"
        :maxFileSize="maxFileSize"
        :fileLimit="fileLimit"
        :folder="folder"
        :accept="accept"
        :init="init"
        v-model="uploadedFiles"
        v-model:openModal="openModal"
        @uploadDone="uploadDone"
        :description="description"
      /> -->

			<!-- ----------------File Upload Modal---------------- -->
			<HFileUploadModalNew
				@uploadDone="uploadDone"
				v-model:openModal="openUploadFilesModal"
				v-model="uploadedFiles"
				:fileLimit="10"
				:max-file-size="10485760"
				:media-type="mediaType"
				:name="name"
				:folder="folder"
				:init="init"
				:description="description"
			/>
		</ClientOnly>

		<div class="flex flex-col items-center justify-center">
			<div
				v-if="!uploadedFiles.length"
				class="p-8 w-full border-2 border-gray-300 border-dashed rounded-lg"
			>
				<!-- ----------------Select from landscape and portrait---- -->
				<div
					v-if="showSelectPortraitOrLandscape"
					class="flex flex-col items-center justify-center w-full gap-4 cursor-pointer"
				>
					<!-- ------------------Landscape---------------- -->

					<button
						@click="selectPortraitOrLandscape('landscape')"
						class="primary-button w-52 !px-8 border flex items-center gap-4 hover:bg-primary-600 hover:text-white"
					>
						<Icon name="ri:landscape-line" class="text-xl" />
						Landscape
					</button>

					<!-- -----------------Portrait---------------- -->
					<button
						@click="selectPortraitOrLandscape('portrait')"
						class="primary-button w-52 !px-8 border flex items-center gap-4 hover:bg-primary-600 hover:text-white"
					>
						<Icon name="ion:phone-portrait-outline" class="text-xl" />
						Portrait
					</button>
				</div>

				<!-- ------------------Browse medias------------ -->
				<div
					v-else
					@click="showSelectPortraitOrLandscape = true"
					class="flex flex-col items-center justify-center w-full gap-4 cursor-pointer"
				>
					<Icon name="uil:cloud-upload" class="w-20 h-20" />
					<div class="flex flex-col mx-auto text-center input_field w-max">
						<div>
							{{ placeholder }} <span class="text-primary-600">Browse</span>
						</div>

						<div class="">Select images and videos that are under 10MB</div>
					</div>
				</div>
			</div>
			<!-- <div
        class="w-full cursor-pointer"
        v-if="!uploadedFiles.length"
        @click="openModal = true"
      >
        <slot name="wrapper">
          <div
            class="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
          >
            <Icon name="uil:cloud-upload" class="w-20 h-20" />
            <div class="flex flex-col mx-auto text-center input_field w-max">
              <div>
                {{ placeholder }} <span class="text-primary-600">Browse</span>
              </div>
            </div>
          </div>
        </slot>
      </div> -->

			<div
				v-else
				class="flex flex-col items-center justify-center w-full py-2 border-2 border-dashed rounded-md cursor-pointer h-fit"
			>
				<Suspense>
					<template #default>
						<div
							class="flex flex-col items-center justify-center w-full px-4 gap-y-4 h-fit"
						>
							<div
								v-for="(i, index) in uploadedFiles"
								:key="index"
								class="flex items-center justify-between w-full p-2"
								@click="makeThumbnail(i)"
							>
								<div class="flex items-center gap-3">
									<video
										v-if="getFileType(i) == 'video'"
										class="w-[100px] h-[100px] rounded-sm object-cover"
										:src="i"
										autoplay
										controls
									></video>
									<object
										:data="i"
										class="object-cover w-[600px]"
										type="application/pdf"
										v-else-if="getFileType(i) == 'pdf'"
									/>
									<img
										v-else
										:src="i"
										class="w-[100px] h-[100px] rounded-sm object-cover"
										alt="file"
									/>

									<div class="flex items-center gap-x-2">
										<span
											v-if="thumbnail === i"
											class="text-sm font-light text-primary-600"
										>
											<Icon class="text-2xl" name="icons8:checked" />
										</span>
									</div>
								</div>
								<!--progress -->

								<button type="button" @click.stop="removeFile(index)">
									<Icon name="uil:trash-alt" class="w-6 h-6" />
								</button>
							</div>

							<div class="flex items-center gap-x-6">
								<button
									type="button"
									@click="showSelectPortraitOrLandscape = true"
									v-if="
										!disabled &&
										uploadedFiles.length < fileLimit &&
										!showSelectPortraitOrLandscape
									"
									class="flex items-center px-3 py-1 transition-all duration-200 ease-in border rounded-md hover:bg-primary gap-x-2 group"
								>
									<Icon
										name="subway:round-arrow-1"
										class="text-lg transition-all duration-200 ease-in group-hover:rotate-45"
									/>
									Add
								</button>

								<!-- ----------------Select from landscape and portrait---- -->
								<div
									v-if="showSelectPortraitOrLandscape"
									class="flex flex-col items-center justify-center w-full gap-4 cursor-pointer"
								>
									<!-- ------------------Landscape---------------- -->

									<button
										@click="selectPortraitOrLandscape('landscape')"
										class="primary-button w-52 !px-8 border flex items-center gap-4 hover:bg-primary-600 hover:text-white"
									>
										<Icon name="ri:landscape-line" class="text-xl" />
										Landscape
									</button>

									<!-- -----------------Portrait---------------- -->
									<button
										@click="selectPortraitOrLandscape('portrait')"
										class="primary-button w-52 !px-8 border flex items-center gap-4 hover:bg-primary-600 hover:text-white"
									>
										<Icon name="ion:phone-portrait-outline" class="text-xl" />
										Portrait
									</button>
								</div>

								<button
									type="button"
									@click="submitToDatabase"
									v-if="emitSubmit"
									class="flex items-center px-3 py-1 text-green-600 transition-all duration-200 ease-in border rounded-md hover:bg-primary gap-x-2 group"
								>
									<Icon v-if="loading" name="eos-icons:bubble-loading" />
									<Icon
										v-else
										name="bx:upload"
										class="text-lg text-green-600"
									/>
									Submit
								</button>
							</div>
						</div>
					</template>
					<template #fallback>Loading . . . </template>
				</Suspense>
			</div>
			<small class="mt-2 text-red-600">{{ errorMessage }}</small>
		</div>
	</div>
</template>
