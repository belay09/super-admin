<script setup>
definePageMeta({
	layout: "engagement",
});

const router = useRouter();
const route = useRoute();

onMounted(() => {
	if (route.query?.step) {
		router.replace({
			path: route.path,
			query: route.query,
		});
	} else {
		router.replace({
			path: route.path,
			query: { step: 0 },
		});
	}
});

const currentStep = computed({
	get() {
		return parseInt(route.query?.step);
	},
	set(value) {
		router.push({ query: { step: value } });
	},
});
</script>
<template>
	<div
		class="grid grid-flow-col rounded-t-lg overflow-hidden bg-primary-300 h-20 my-4"
	>
		<div
			class="flex items-center gap-x-2 justify-center text-white"
			:class="
				currentStep == 0
					? 'bg-primary-400'
					: currentStep > 0
					? '!bg-primary-600 text-white'
					: ''
			"
		>
			<Icon class="text-xl" name="mingcute:document-2-line" />
			Basic Info
		</div>
		<div
			class="flex items-center gap-x-2 justify-center text-white"
			:class="
				currentStep == 1
					? 'bg-primary-400'
					: currentStep > 1
					? '!bg-primary-600 text-white'
					: ''
			"
		>
			<Icon class="text-xl" name="basil:invoice-outline" />

			Create Payment
		</div>

		<!-- -------------If place type is HOTELS-------------- -->

		<div
			class="flex items-center gap-x-2 justify-center text-white"
			:class="
				currentStep == 2
					? 'bg-primary-400'
					: currentStep > 2
					? '!bg-primary-600 text-white'
					: ''
			"
		>
			<Icon class="text-xl" name="mdi:invite" />

			Invite Owner
		</div>
		<div
			class="flex items-center gap-x-2 justify-center text-white"
			:class="
				currentStep == 3
					? 'bg-primary-400'
					: currentStep > 3
					? '!bg-primary-600 text-white'
					: ''
			"
		>
			<Icon class="text-xl" name="lets-icons:flag-finish-light" />

			Finish
		</div>
	</div>
	<div>
		<Entity-BasicInfo @prev="currentStep--" v-if="currentStep == 0" />

		<Entity-Payment @prev="currentStep--" v-else-if="currentStep == 1" />
		<Entity-InviteOwner v-else-if="currentStep == 2" />
		<Entity-Finish @prev="currentStep--" v-else-if="currentStep == 3" />
	</div>
</template>
