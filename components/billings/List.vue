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
const router = useRouter();

/***--------------------------Table data------------------- */
const search = ref("");
const items = ref([]);
const sort = ref([{ name: "desc" }]);
const offset = ref(0);
const limit = ref(20);
const length = ref(100);
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

const currentStatus = ref("Payments");

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
} = authListQuery(getBillingQuery, filter, [], 0, 7);

billingOnResult((result) => {
	if (result.data?.billingsPayments) {
		items.value = result.data.billingsPayments;
	}
});

const loading = ref(true);
loading.value = false;
const clickRow = (item) => {
	router.push("/app/billings/12");
};

const dum = ref(false);
const openBillingModal = ref(false);
/**----------------Billing status--------------------------- */
const status = ref([
	{ name: "Payments", icon: "solar:dollar-linear" },
	{ name: "Verified Payments", icon: "lets-icons:money" },
	{ name: "Declined Payments", icon: "uil:money-bill-slash" },
	{ name: "Invoice", icon: "iconamoon:invoice" },
]);
</script>

<template>
	<ModalsBillingInvoice v-model="openBillingModal" />
	<div class="flex flex-col py-6 space-y-8">
		<Billings-Filter v-model:model-value="currentStatus" :status="status" />

		<div class="">
			<h-table
				:headers="headers"
				:items="items"
				v-model:sort="sort"
				:loading="loading"
				@click:row="clickRow"
				supporterClass="shadow-md  overflow-x-auto overflow-y-hidden pb-12 rounded-md border border-gray-200"
				supportHeaderClass="bg-gray-100 border"
				tableHeaderStyle="secondary-border  bg-gray-50"
				tableBodyRowStyle="border py-6"
				rowHeadStyle="secondary-text"
				row-style="lg:text-sheger-gray-400"
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
								<MenuItem @click="openBillingModal = true" v-slot="{ active }">
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
		<div class="mt-5">
			<HPaginate
				v-model:offset="offset"
				:items-per-page="limit"
				:total-data="length"
			/>
		</div>
	</div>
</template>
