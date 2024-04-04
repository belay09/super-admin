<script setup>
const router = useRouter();

/**----------------Billing status--------------------------- */
const currentStatus = ref("Payments");
const status = ref([
	{ name: "Payments", icon: "solar:dollar-linear" },
	{ name: "Verified Payments", icon: "lets-icons:money" },
	{ name: "Declined Payments", icon: "uil:money-bill-slash" },
	{ name: "Invoice", icon: "iconamoon:invoice" },
]);
</script>

<template>
	<div class="flex flex-col py-6 space-y-8">
		<Billings-Filter v-model:model-value="currentStatus" :status="status" />

		<div class="grid grid-cols-3 gap-6">
			<div
				class="flex flex-col px-5 py-6 space-y-5 border rounded-lg"
				v-for="(index, value) in 3"
				:key="index"
			>
				<!-- -------------------Pricing header--------------------- -->
				<div class="flex justify-between">
					<p class="text-2xl font-semibold text-sheger-gray-100">Sheger Pro</p>
					<div class="flex items-center space-x-4">
						<Icon name="uil:trash-alt" class="text-2xl" />
						<Icon name="uil:edit-alt" class="text-2xl" />
					</div>
				</div>

				<p class="text-sheger-gray-100">For Small Business</p>
				<p class="text-xl font-medium text-sheger-gray-100">
					ETB 500 / Monthly
				</p>

				<!-- ------------------Plan futures------------- -->

				<div class="flex flex-col space-y-4 secondary-text">
					<div
						v-for="(item, index) in 6"
						:key="index"
						class="secondary-flex-row"
					>
						<Icon name="uil:check" class="text-2xl" />
						<p>Urna augue sit tortor iaculis nulla dui id venenatis nunc.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
