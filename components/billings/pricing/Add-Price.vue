<script setup>
import { useForm } from "vee-validate";
const { handleSubmit } = useForm();

const props = defineProps({
	frequencies: Array,
	priceLabelName: String,
	freqLabelName: String,
	modelValue: Array,
});

const emit = defineEmits(["update:modelValue"]);

const input = ref({});

const inputs = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emit("update:modelValue", newVal);
	},
});
const isEdit = ref(false);
const editIndex = ref(null);

const addInput = handleSubmit(() => {
	inputs.value.push({ ...input.value });
	input.value = {};
});

const editInput = handleSubmit(() => {
	inputs.value[editIndex.value] = { ...input.value };
	input.value = {};
	isEdit.value = false;
});
</script>

<template>
	<div class="grid w-full grid-cols-9 pt-6 gap-x-2">
		<H-Textfield
			id="price"
			name="price"
			:label="priceLabelName"
			type="number"
			v-model="input.price"
			rules="required"
			class="col-span-4"
		></H-Textfield>
		<div class="col-span-4">
			<H-SingleSelect
				name="frequency"
				id="frequency"
				:label="freqLabelName"
				:items="frequencies"
				v-model="input.frequency"
				rules="required"
			></H-SingleSelect>
		</div>
		<button
			@click.prevent="isEdit ? editInput() : addInput()"
			class="flex items-center"
		>
			<span
				class="flex items-center justify-center w-8 h-8 col-span-1 border rounded-full border-primary-200"
			>
				<Icon v-if="!isEdit" name="cil:plus" />
				<Icon v-else name="tdesign:edit" />
			</span>
		</button>
	</div>
	<div class="flex flex-wrap gap-x-4 gap-y-1">
		<div
			v-for="(item, index) in inputs"
			:key="index"
			class="relative flex items-center p-2 overflow-hidden text-sm border rounded-lg group gap-x-1 w-fit border-primary-300"
		>
			<span class="text-lg font-semibold text-sheger-gray-950">{{
				item.price
			}}</span>
			<span class="whitespace-nowrap">/{{ item.frequency }}</span>

			<div
				class="absolute hidden items-center justify-center gap-x-4 group-hover:flex top-0 left-0 w-full h-full group-hover:bg-slate-100/10 group-hover:backdrop-blur-[2px]"
			>
				<Icon
					@click="[(input = { ...item }), (isEdit = true), (editIndex = index)]"
					class="text-xl cursor-pointer"
					name="tdesign:edit"
				/>
				<Icon
					@click="inputs.splice(index, 1)"
					class="text-xl font-semibold text-red-600 cursor-pointer"
					name="mi:delete"
				/>
			</div>
		</div>
	</div>
</template>
