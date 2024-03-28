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
	{ name: "Yearly", icon: "lets-icons:money", id: "YEARLY" },
	{ name: "Quarterly", icon: "uil:money-bill-slash", id: "QUARTERLY" },
	{ name: "Bi-Annually", icon: "iconamoon:invoice", id: "BIANNUALLY" },
]);

const openPricingDeleteConfirmModal = ref(false);

definePageMeta({
	layout: "home",
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

			<div class="grid grid-cols-3 gap-6">
				<div
					class="flex flex-col px-5 py-6 space-y-5 border rounded-lg"
					v-for="(pricing, index) in pricingPlansDisplay"
					:key="index"
				>
					<!-- -------------------Pricing header--------------------- -->
					<div class="flex justify-between">
						<p class="text-2xl font-semibold text-sheger-gray-100">
							{{ pricing.title }}
						</p>
						<div class="flex items-center space-x-4">
							<Icon
								@click="
									[
										(toBeDeletedPlanId = pricing.id),
										(openPricingDeleteConfirmModal = true),
									]
								"
								name="uil:trash-alt"
								class="text-2xl cursor-pointer"
							/>
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
			</div>
		</div>

		<!-- -------------------------Pricing lists-------------- -->
	</div>
</template>
