<script setup>
const props = defineProps({
	pricing: {},
	currentStatus: {
		type: String,
	},
});

/**----------------Billing status--------------------------- */
const currentStatus = computed(() => props.currentStatus);
const currentStatusId = computed(() => {
	return status.value.find((item) => item.name === currentStatus.value).id;
});
const status = ref([
	{ name: "Monthly", icon: "solar:dollar-linear", id: "MONTHLY" },
	{ name: "Annually", icon: "lets-icons:money", id: "ANNUALLY" },
	{ name: "Quarterly", icon: "uil:money-bill-slash", id: "QUARTERLY" },
]);
</script>

<template>
	<div class="flex flex-col px-5 py-6 space-y-5 border rounded-lg">
		<!-- -------------------Pricing header--------------------- -->
		<div class="flex justify-between">
			<p class="text-2xl font-semibold text-sheger-gray-100">
				{{ pricing.title }}
			</p>
			<div class="flex items-center space-x-4">
				<Icon
					@click="$emit('deletePricing')"
					name="uil:trash-alt"
					class="text-2xl cursor-pointer"
				/>
				<Icon
					name="uil:edit-alt"
					class="text-2xl cursor-pointer"
					@click="$router.push(`/app/billings/pricing/edit/${pricing.id}`)"
				/>
			</div>
		</div>

		<p class="text-sheger-gray-100">{{ pricing.title }}</p>
		<p class="text-xl font-medium text-sheger-gray-100">
			ETB
			{{
				pricing.pricing_plan_frequencies.find(
					(item) => item.frequency === currentStatusId
				)?.price
			}}
			/ {{ currentStatus }}
		</p>

		<!-- ------------------Plan futures------------- -->

		<div class="flex flex-col space-y-4 secondary-text">
			<div
				v-for="(feature, index) in pricing.pricing_plan_features"
				:key="index"
				class="flex gap-x-2"
			>
				<div><Icon name="uil:check" class="!text-2xl" /></div>
				<p class="line-clamp-3">{{ feature.feature.title }}</p>
			</div>
		</div>
	</div>
</template>
