<script setup>
import {
	Dialog,
	DialogPanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";
import getBillingQuery from "@/graphql/query/billing/list.gql";
import getInvoiceQuery from "@/graphql/query/invoice/list.gql";
const router = useRouter();

/***--------------------------Table data------------------- */
const searchTerm = ref("");
const items = ref([]);
const sort = ref([{ createdAt: "DESC" }]);
const offset = ref(0);
const limit = ref(7);
const length = ref(100);
const selectedBill = ref();

const headers = [
	{
		text: "Company Name",
		value: "billing_address.place.name",
	},

	{
		text: "Payment method",
		value: "paymentMethod",
	},
	{
		text: "pricing plan",
		value: "pricing_plan_frequency.pricingPlan.title",
	},

	{
		text: "price",
		value: "pricing_plan_frequency.price",
	},
	{
		text: "paid amount",
		value: "total",
	},
	{
		text: "payment date",
		value: "paymentDate",
	},

	{
		text: "Action",
		value: "action",
	},
];

const headersInvoice = [
	{
		text: "Company Name",
		value: "payment.billing_address.place.name",
	},

	{
		text: "Payment method",
		value: "payment.paymentMethod",
	},
	{
		text: "pricing plan",
		value: "payment.pricing_plan_frequency.pricingPlan.title",
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

const status = ref([
	{ name: "Payments", icon: "solar:dollar-linear" },
	{ name: "Verified Payments", icon: "lets-icons:money" },
	{ name: "Declined Payments", icon: "uil:money-bill-slash" },
	{ name: "Invoice", icon: "iconamoon:invoice" },
]);

const currentStatus = ref("Payments");
const totalData = ref(0);
/**----------------Fetch Payments--------------------------- */
const filter = computed(() => {
	let query = {};
	query._and = [
		{
			isVerified: {
				_eq: false,
			},
			isDeclined: {
				_eq: false,
			},
		},
		{
			_or: [
				{
					billing_address: {
						place: {
							name: {
								_ilike: `%${searchTerm.value}%`,
							},
						},
					},
				},
			],
		},
	];

	if (currentStatus.value === "Payments") {
		query._and[0] = {
			isVerified: {
				_eq: false,
			},
			isDeclined: {
				_eq: false,
			},
		};
	} else if (currentStatus.value === "Verified Payments") {
		query._and[0] = {
			isVerified: {
				_eq: true,
			},
			isDeclined: {
				_eq: false,
			},
		};
	} else if (currentStatus.value === "Declined Payments") {
		query._and[0] = {
			isVerified: {
				_eq: false,
			},
			isDeclined: {
				_eq: true,
			},
		};
	}

	return query;
});

const {
	onResult: billingOnResult,
	onError: billingOnError,
	loading: billingLoading,
	refetch: billingReFetch,
} = authListQuery(getBillingQuery, filter, sort, offset, limit);

billingOnResult((result) => {
	if (result.data?.billingsPayments) {
		items.value = result.data.billingsPayments;
		totalData.value = result.data.billingsPaymentsAggregate.aggregate.count;
	}
});

/**------------------Fetch Invoice------------------------- */
const invoiceFilter = computed(() => {
	return {
		payment: {
			billing_address: {
				place: {
					name: {
						_ilike: `%${searchTerm.value}%`,
					},
				},
			},
		},
	};
});
const invoices = ref([]);

const {
	onResult: invoiceOnResult,
	onError: invoiceOnError,
	loading: invoiceLoading,
	refetch: invoiceReFetch,
} = authListQuery(
	getInvoiceQuery,
	invoiceFilter,
	ref([{ createdAt: "DESC" }]),
	offset,
	limit
);

invoiceOnResult((result) => {
	if (result.data?.invoices) {
		invoices.value = result.data?.invoices;
	}
});
const clickRow = (item) => {
	router.push({
		path: `/app/billings/${item.billing_address.place.id}`,
		query: {
			name: item.billing_address.place.name,
		},
	});
};

const clickRowInvoice = (item) => {
	router.push({
		path: `/app/billings/${item.payment.billing_address.place.id}`,
		query: {
			name: item.payment.billing_address.place.name,
		},
	});
};

const openSelectBill = (id) => {
	selectedBill.value = id;
	openBillingModal.value = true;
};

const openSelectInvoice = (id) => {
	selectedInvoice.value = id;
	openInvoiceModal.value = true;
};

const selectedInvoice = ref();

const dum = ref(false);
const openBillingModal = ref(false);
const openInvoiceModal = ref(false);

definePageMeta({
	layout: "billing",
});
</script>

<template>
	<ModalsBillingPayment
		@refetch="billingReFetch"
		:id="selectedBill"
		:current-status="status.find((item) => item.name === currentStatus)"
		v-model="openBillingModal"
		v-if="openBillingModal"
	/>

	<ModalsBillingInvoice
		:id="selectedInvoice"
		v-model="openInvoiceModal"
		v-if="openInvoiceModal"
	/>

	<div class="w-full py-6">
		<!-- ---------search and filter--------- -->

		<div class="flex items-center justify-between">
			<div class="flex items-center gap-x-4">
				<H-Textfield
					name="search"
					type="text"
					placeholder="Search here"
					leading-icon="uil:search"
					leading-icon-container-class="border-none"
					v-model="searchTerm"
				></H-Textfield>
				<!-- <div class="px-4 py-3 border rounded-md">
					<Icon
						name="heroicons-outline:adjustments"
						class="z-30 text-2xl cursor-pointer"
					/>
				</div> -->
			</div>

			<div class="flex items-center gap-x-4">
				<NuxtLink
					to="/app/billings/create-payment"
					class="text-white primary-button bg-primary-600"
				>
					Create new
				</NuxtLink>
			</div>
		</div>

		<!-- ----------------Table------------------ -->

		<div class="flex flex-col py-6 space-y-8">
			<Billings-Filter v-model:model-value="currentStatus" :status="status" />
			<div v-if="currentStatus !== 'Invoice'">
				<h-table
					:headers="headers"
					:items="items"
					v-model:sort="sort"
					:loading="billingLoading"
					@click:row="clickRow"
					supporterClass=" overflow-x-auto overflow-y-hidden pb-12 rounded-md border border-gray-200"
					supportHeaderClass="bg-gray-100 border"
					tableHeaderStyle="secondary-border  bg-gray-50"
					tableBodyRowStyle="border py-6"
					rowHeadStyle="secondary-text"
					row-style="lg:text-sheger-gray-400 hover:bg-primary-50/60"
				>
					<template v-slot:action="{ item }">
						<Menu @click.stop="dum = !dum" as="div" class="relative">
							<MenuButton
								class="-m-4 flex justify-center w-12 h-12 group-hover hover:bg-gray-100 rounded-full items-center p-1.5"
							>
								<Icon name="fontisto:more-v" class="text-xl text-gray-950" />
							</MenuButton>
							<transition
								enter-active-class="transition duration-100 ease-out"
								enter-from-class="transform scale-95 opacity-0"
								enter-to-class="transform scale-100 opacity-100"
								leave-active-class="transition duration-75 ease-in"
								leave-from-class="transform scale-100 opacity-100"
								leave-to-class="transform scale-95 opacity-0"
							>
								<MenuItems
									class="bg-white hover:bg-primary-600 hover:text-white absolute right-32 z-50 mt-2.5 w-fit origin-top-right rounded-md py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
								>
									<MenuItem @click="openSelectBill(item.id)">
										<button
											type="button"
											class="flex items-center w-full px-4 py-2 text-sm rounded-md group gap-x-4"
										>
											<Icon name="mdi:eye" width="17" height="17" />
											<span class="whitespace-nowrap">Review Payment</span>
										</button>
									</MenuItem>
								</MenuItems>
							</transition>
						</Menu>
					</template>
				</h-table>
			</div>
			<div v-else>
				<h-table
					:headers="headersInvoice"
					:items="invoices"
					v-model:sort="sort"
					:loading="invoiceLoading"
					@click:row="clickRowInvoice"
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
					:total-data="totalData"
				/>
			</div>
		</div>
	</div>
</template>
