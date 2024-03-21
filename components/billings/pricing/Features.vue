<script setup>
import { useForm } from "vee-validate";
const { handleSubmit, resetField } = useForm();

const props = defineProps({
	modelValue: Array,
	singleFeature: Object,
});

const frequencies = ref([
	{
		name: "Monthly",
		id: "Monthly",
	},
	{
		name: "Yearly",
		id: "Yearly",
	},
	{
		name: "Quarterly",
		id: "Quarterly",
	},
	{
		name: "Bi-Annually",
		id: "Bi-Annually",
	},
]);

const emit = defineEmits(["update:modelValue"]);

const features = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit("update:modelValue", value);
	},
});

const singleFeature = ref({});

const isEdit = ref(false);

const addFeature = handleSubmit(() => {
	features.value.push(singleFeature.value);
	singleFeature.value = {};
	isEdit.value = false;
});

const editIndex = ref(0);

const editFeature = handleSubmit(() => {
	features.value[editIndex.value] = singleFeature.value;
	singleFeature.value = {};
	isEdit.value = false;
});
</script>

<template>
	<form id="features" class="px-8 border-x">
		<p class="py-4 text-lg font-medium text-sheger-gray-100">Features</p>
		<!-- -----------------Plan name---------------- -->
		<H-Textfield
			id="title"
			name="title"
			label="Title"
			placeholder="Title"
			v-model="singleFeature.title"
			rules="required"
		></H-Textfield>

		<!-- ---------------------Description---------------- -->

		<H-Textarea
			id="description"
			name="feature description"
			label="Description"
			class="pt-2"
			v-model="singleFeature.description"
			rules="required"
		></H-Textarea>

		<!-- ----------------------Submit------------------- -->
		<button
			form="features"
			type="submit"
			class="block w-full py-3 mt-4 primary-button secondary-border"
			@click.prevent="isEdit ? editFeature() : addFeature()"
		>
			<Icon
				:name="isEdit ? 'tabler:edit' : 'heroicons:plus-small-solid'"
				class="text-2 xl"
			></Icon>

			<span>{{ isEdit ? "Edit" : "Add" }}</span>
		</button>
		<div class="flex flex-wrap mt-2 gap-x-4 gap-y-3">
			<div
				v-for="(item, index) in features"
				:key="index"
				class="relative flex flex-col items-start w-full p-2 overflow-hidden text-sm border border-gray-300 rounded-lg gap-y-1 group"
			>
				<p class="text-lg font-semibold text-sheger-gray-950">
					{{ item.title }}
				</p>

				<p class="line-clamp-2">{{ item.description }}</p>

				<div
					class="absolute hidden items-center justify-center gap-x-4 group-hover:flex top-0 left-0 w-full h-full group-hover:bg-slate-100/10 group-hover:backdrop-blur-[2px]"
				>
					<Icon
						@click="
							[
								(singleFeature = { ...item }),
								(editIndex = index),
								(isEdit = true),
							]
						"
						class="text-3xl cursor-pointer"
						name="tdesign:edit"
					/>
					<Icon
						@click="features.splice(index, 1)"
						class="text-3xl font-semibold text-red-600 cursor-pointer"
						name="mi:delete"
					/>
				</div>
			</div>
		</div>
	</form>
</template>
