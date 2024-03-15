<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	status: {
		type: Array,
		required: true,
	},
	modelValue: {
		type: String,
		default: "All",
	},
	hasIcon: {
		type: Boolean,
		default: true,
	},
});

const currentStatus = ref(props.modelValue);
function changeState(state) {
	currentStatus.value = state.name;
	emit("update:modelValue", state.name);
}
</script>

<template>
	<div class="flex items-center self-start border rounded-lg">
		<button
			@click="changeState(state)"
			class="flex items-center px-6 py-2 font-medium transition-all duration-300 ease-in-out gap-x-2 secondary-text"
			:class="[
				currentStatus == state.name ? 'bg-primary-600 lg:text-white' : '',
				index == 0 ? 'rounded-l-lg' : '',
				index == status.length - 1 ? 'rounded-r-lg' : '',
			]"
			v-for="(state, index) in status"
			:key="state"
		>
			<Icon v-if="hasIcon" class="text-2xl" :name="state.icon" />
			<span>{{ state.name }}</span>
		</button>
	</div>
</template>
