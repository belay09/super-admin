<script setup>
const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: "",
	},
	autoClose: {
		type: Boolean,
		default: true,
	},
	overflowVisible: {
		type: Boolean,
		default: true,
	},
	bodyClass: {
		type: String,
		default: "",
	},
});

const open = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emits("update:modelValue", newVal);
	},
});
</script>
<template>
	<ClientOnly>
		<HeadlessTransitionRoot as="template" :show="open">
			<HeadlessDialog
				as="div"
				class="relative z-50"
				@close="autoClose ? (open = false) : ''"
			>
				<HeadlessTransitionChild
					as="template"
					enter="ease-out duration-300"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="ease-in duration-200"
					leave-from="opacity-100"
					leave-to="opacity-0"
				>
					<div
						class="fixed inset-0 z-50 transition-opacity bg-gray-500 bg-opacity-50"
					/>
				</HeadlessTransitionChild>

				<div class="fixed inset-0 z-50 w-full overflow-y-auto">
					<div
						class="flex justify-center pt-4 mt-6 text-center sm:items-center sm:p-0"
					>
						<HeadlessTransitionChild
							as="template"
							enter="ease-out duration-300"
							enter-from="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-95"
							enter-to="opacity-100 translate-y-0 sm:scale-100"
							leave="ease-in duration-200"
							leave-from="opacity-100 translate-y-0 sm:scale-100"
							leave-to="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-95"
						>
							<HeadlessDialogPanel
								class="relative z-50 w-full p-12 text-left transition-all transform bg-white rounded-lg"
								:class="[
									overflowVisible ? 'overflow-visible' : 'overflow-hidden ',
									bodyClass ? bodyClass : ' max-w-lg',
								]"
							>
								<slot name="header" />

								<slot name="content" />
							</HeadlessDialogPanel>
						</HeadlessTransitionChild>
					</div>
				</div>
			</HeadlessDialog>
		</HeadlessTransitionRoot>
	</ClientOnly>
</template>
