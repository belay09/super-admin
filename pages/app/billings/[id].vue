<script setup>
import getInvoiceQuery from "@/graphql/query/invoice/list.gql";
import getCurrentPlan from "@/graphql/query/billing/current-plan.gql";

const router = useRouter();
const route = useRoute();
const headersInvoice = [
	{
		text: "pricing plan",
		value: "payment.pricing_plan_frequency.pricingPlan.title",
	},
	{
		text: "Payment method",
		value: "payment.paymentMethod",
	},

	{
		text: "price",
		value: "payment.pricing_plan_frequency.price",
	},
	{
		text: "paid amount",
		value: "payment.total",
	},
	{
		text: "payment date",
		value: "payment.paymentDate",
	},

	{
		text: "Action",
		value: "action",
	},
];

/***--------------------------Table data------------------- */
const sort = ref([{ name: "desc" }]);
const offset = ref(0);
const limit = ref(6);
const length = ref(0);

/**------------------Fetch Invoice------------------------- */
const invoiceFilter = computed(() => {
	let query = {
		payment: {
			entityId: {
				_eq: route.params.id,
			},
		},
	};
	return query;
});
const invoices = ref([]);

const {
	onResult: invoiceOnResult,
	onError: invoiceOnError,
	loading: invoiceLoading,
	refetch: invoiceReFetch,
} = authFetch(getInvoiceQuery, {
	filter: invoiceFilter,
	offset,
	limit,
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
});

invoiceOnResult((result) => {
	if (result.data?.invoices) {
		invoices.value = result.data?.invoices;
		length.value = result.data?.length?.aggregate?.count;
	}
});

/**------------------Fetch Current Plan------------------------- */
const selectedPlace = ref({
	id: route.params.id,
	organizationLegalName: route.query.name,
});
const placeCurrentPlan = ref();

const {
	onResult: currentPlanOnResult,
	onError: currentPlanOnError,
	loading: currentPlanLoading,
	refetch: currentPlanReFetch,
} = authFetch(getCurrentPlan, {
	filter: ref(route.params.id),
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
});

currentPlanOnResult((result) => {
	if (result.data?.currentPlan.length > 0) {
		placeCurrentPlan.value = result.data.currentPlan[0];
		// selectedPlace.value = result.data.currentPlan[0].place;
	}
});

const selectedInvoice = ref();

const openSelectInvoice = (id) => {
	selectedInvoice.value = id;
	openInvoiceModal.value = true;
};

const openInvoiceModal = ref(false);
const openCreatePaymentModal = ref(false);

definePageMeta({
	layout: "billing",
});
</script>

<template>
	<ModalsBillingInvoice
		:id="selectedInvoice"
		v-model="openInvoiceModal"
		v-if="openInvoiceModal"
	/>

	<ModalsCreatePayment
		:place="selectedPlace"
		v-model="openCreatePaymentModal"
	/>

	<div class="w-full py-6 pl-10 pr-16">
		<!-- -----------------------Place name---------------- -->
		<div
			@click="router.back()"
			class="py-4 secondary-flex-row text-sheger-gray-100 hover:cursor-pointer"
		>
			<Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
			<p class="text-4xl font-semibold capitalize">
				{{ $route.query.name }}
			</p>
		</div>
		<!-- -------------------------Subscription------------------ -->
		<div
			class="grid items-center grid-cols-2 px-12 py-8 mt-3 mb-8 bg-primary-50"
		>
			<div class="flex flex-col space-y-6" v-if="placeCurrentPlan">
				<p class="secondary-text">Current Plan</p>

				<p class="font-semibold text-sheger-gray-100">
					<span class="text-2xl">
						{{
							placeCurrentPlan?.pricingPlanFrequency?.pricingPlan?.title
						}}</span
					>
					<span class="px-6 mx-5 text-white rounded-full bg-primary-600">{{
						placeCurrentPlan?.pricingPlanFrequency?.frequency
					}}</span>
				</p>
				<p class="secondary-text">
					{{ placeCurrentPlan?.pricingPlanFrequency?.pricingPlan?.description }}
				</p>

				<p class="text-sheger-gray-100">
					<span class="font-medium">Next Payment</span> : Birr
					{{ placeCurrentPlan?.pricingPlanFrequency?.price }} |
					<span class="font-medium">Due on</span>:{{
						placeCurrentPlan?.endDate
					}}
				</p>
			</div>
			<div v-else>
				<p class="text-3xl font-medium text-sheger-gray-600">
					No Subscription Yet
				</p>
			</div>

			<div class="flex flex-col items-end space-y-6">
				<button
					@click="openCreatePaymentModal = true"
					class="w-56 text-white primary-button bg-primary-600"
				>
					Upgrade Plan
				</button>
				<!-- <button class="w-56 bg-white primary-button secondary-border">
					Cancel Subscription
				</button> -->
			</div>
		</div>
		<div class="">
			<h-table
				:headers="headersInvoice"
				:items="invoices"
				v-model:sort="sort"
				:loading="invoiceLoading"
				supporterClass="shadow-md  overflow-x-auto overflow-y-hidden pb-12 rounded-md border border-gray-200"
				supportHeaderClass="bg-gray-100 border"
				tableHeaderStyle="secondary-border  bg-gray-50"
				tableBodyRowStyle="border py-6"
				rowHeadStyle="secondary-text"
				row-style="lg:text-sheger-gray-400 hover:bg-primary-50/60"
			>
				<template v-slot:action="{ item }">
					<button
						@click.stop="openSelectInvoice(item.id)"
						type="button"
						class="flex items-center px-2 py-1 text-sm border rounded-md w-fit text-primary-600 bg-primary-50 border-primary-400 group gap-x-2"
					>
						<Icon name="iconamoon:invoice" width="17" height="17" />
						<span class="whitespace-nowrap"> Invoice</span>
					</button>
				</template>
			</h-table>
		</div>
		<div class="mt-5">
			<HPaginate
				v-model:offset="offset"
				:items-per-page="limit"
				:total-data="length"
			/>
		</div>
	</div>
</template>
