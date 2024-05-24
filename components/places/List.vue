<script setup>
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Number,
		default: () => 1,
	},
	places: {
		type: Array,
		required: true,
		default: () => [],
	},
	totalPage: {
		type: Number,
		required: true,
		default: () => 1,
	},
	loading: {
		type: Boolean,
		default: true,
	},
});

const pageTracker = ref(props.modelValue);
watch(
	() => props.modelValue,
	(newVal) => {
		pageTracker.value = newVal;
	}
);
watch(pageTracker, (newVal) => {
	emit("update:modelValue", newVal);
});
</script>
<template>
	<div class="flex flex-col py-6 space-y-8">
		<div class="flex items-center justify-between">
			<p class="text-xl font-medium">
				Showing {{ totalPage > 0 ? pageTracker : 0 }} /{{ totalPage }}
			</p>

			<div class="flex items-center gap-8">
				<H-Page
					v-model:model-value="pageTracker"
					:total-page="totalPage"
				></H-Page>
			</div>
		</div>
		<div class="grid grid-cols-3 gap-8" v-if="!loading">
			<Ui-Cards-Place v-for="place in places" :place="place" :key="place.id" />
		</div>
		<div class="grid grid-cols-3 gap-8" v-else>
			<SkeletonLoaderCard v-for="i in 6" :key="i" />
		</div>
	</div>
</template>
