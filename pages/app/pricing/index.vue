<script setup>
import getPricingPlanQuery from "@/graphql/query/pricing/list.gql";
import deletePricingPlanMutation from "@/graphql/mutations/pricing/delete.gql";
import useNotify from "@/use/notify";
/***---------------------Tab--------------------- */
const router = useRouter();
const { notify } = useNotify();

/**----------------Fetch Pricing plan data--------------------------- */

const pricingPlans = ref([]);
const pricingPlansDisplay = computed(() => {
	return pricingPlans.value.filter((item) => {
		return item.pricing_plan_frequencies.find(
			(item) => item.frequency === currentStatusId.value
		);
	});
});

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

/**----------------Delete Pricing plan data--------------------------- */
const toBeDeletedPlanId = ref(null);
const {
	mutate: deleteMutation,
	loading: deleteLoading,
	onError: deleteError,
	onDone: deleteOnDone,
} = authMutation(deletePricingPlanMutation);

const onDelete = (id) => {
	deleteMutation({ id });
};

deleteOnDone(() => {
	notify({
		title: "Delete Pricing plan",
		description: "Pricing plan deleted successfully",
		type: "success",
		borderClass: "border-l-8 border-green-300 bg-primary-200",
	});
	pricingRefetch();
	openPricingDeleteConfirmModal.value = false;
});

deleteError(() => {
	notify({
		title: "Delete Pricing plan",
		description: "Deleting Pricing Plan failed",
		type: "error",
		borderClass: "border-l-8 border-red-300 bg-primary-200",
	});
});

/**----------------Billing status--------------------------- */
const currentStatus = ref("Monthly");
const currentStatusId = computed(() => {
	return status.value.find((item) => item.name === currentStatus.value).id;
});
const status = ref([
	{ name: "Monthly", icon: "solar:dollar-linear", id: "MONTHLY" },
	{ name: "Annually", icon: "lets-icons:money", id: "ANNUALLY" },
	{ name: "Quarterly", icon: "uil:money-bill-slash", id: "QUARTERLY" },
]);

const openPricingDeleteConfirmModal = ref(false);

definePageMeta({
	layout: "billing",
});
</script>

<template>
	<ModalsConfirmation
		@confirm="onDelete(toBeDeletedPlanId)"
		v-model="openPricingDeleteConfirmModal"
		title="Delete Pricing Plan"
		sure-question="Are you sure you want to delete the Pricing Plan?"
		description="Deleting the plan will permanently remove it from our system, and the plan will be irretrievable. Please confirm your decision, as this action cannot be undone."
	></ModalsConfirmation>
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

			<div class="grid grid-cols-3 gap-6" v-if="!pricingLoading">
				<Ui-Cards-PricingPlan
					@deletePricing="
						[
							(toBeDeletedPlanId = pricing.id),
							(openPricingDeleteConfirmModal = true),
						]
					"
					v-for="(pricing, index) in pricingPlansDisplay"
					:key="index"
					:pricing="pricing"
					:current-status="currentStatus"
				/>
			</div>
			<div class="grid grid-cols-3 gap-6" v-else>
				<SkeletonLoader-PricingPlan v-for="i in 6" :key="i" />
			</div>
		</div>

		<!-- -------------------------Pricing lists-------------- -->
	</div>
</template>
