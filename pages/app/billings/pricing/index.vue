<script setup>
import getPricingPlanQuery from "@/graphql/query/pricing/list.gql";
/***---------------------Tab--------------------- */
const router = useRouter();

const pricingPlans = ref([]);

const orderBy = ref([{}]);
const {
	onResult: pricingOnResult,
	onError: pricingOnError,
	loading: pricingLoading,
	refetch: pricingRefetch,
} = authListQuery(getPricingPlanQuery, {}, orderBy, 0, 7);

pricingOnResult((result) => {
	pricingPlans.value = result.data?.billingsPricingPlans;
});

/**----------------Billing status--------------------------- */
const currentStatus = ref("Monthly");
const status = ref([
	{ name: "Monthly", icon: "solar:dollar-linear" },
	{ name: "Yearly", icon: "lets-icons:money" },
	{ name: "Quarterly", icon: "uil:money-bill-slash" },
	{ name: "Bi-Annually", icon: "iconamoon:invoice" },
]);

definePageMeta({
	layout: "home",
});
</script>

<template>
	<div class="w-full py-6 pl-10 pr-16">
		<div class="flex items-center justify-between">
			<div
				@click="router.back()"
				class="primary-flex-row text-sheger-gray-100 hover:cursor-pointer"
			>
				<Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
				<p class="text-4xl font-semibold">Pricing Plans</p>
			</div>
			<button
				@click="router.push('/app/billings/pricing/add')"
				class="block primary-button bg-primary-600"
			>
				<Icon name="uil:plus" class="text-xl text-white" color="" />
				<span class="text-white">New Plan</span>
			</button>
		</div>

		<div class="flex flex-col py-6 space-y-8">
			<Billings-Filter
				:has-icon="false"
				v-model:model-value="currentStatus"
				:status="status"
			/>

			<div class="grid grid-cols-3 gap-6">
				<div
					class="flex flex-col px-5 py-6 space-y-5 border rounded-lg"
					v-for="(pricing, index) in pricingPlans"
					:key="index"
				>
					<!-- -------------------Pricing header--------------------- -->
					<div class="flex justify-between">
						<p class="text-2xl font-semibold text-sheger-gray-100">
							{{ pricing.title }}
						</p>
						<div class="flex items-center space-x-4">
							<Icon name="uil:trash-alt" class="text-2xl cursor-pointer" />
							<Icon
								name="uil:edit-alt"
								class="text-2xl cursor-pointer"
								@click="
									$router.push(`/app/billings/pricing/edit/${pricing.id}`)
								"
							/>
						</div>
					</div>

					<p class="text-sheger-gray-100">{{ pricing.title }}</p>
					<p class="text-xl font-medium text-sheger-gray-100">
						ETB 500 / Monthly
					</p>

					<!-- ------------------Plan futures------------- -->

					<div class="flex flex-col space-y-4 secondary-text">
						<div
							v-for="(feature, index) in pricing.pricing_plan_features"
							:key="index"
							class="secondary-flex-row"
						>
							<Icon name="uil:check" class="text-2xl" />
							<p>{{ feature.feature.title }}</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- -------------------------Pricing lists-------------- -->
	</div>
</template>
