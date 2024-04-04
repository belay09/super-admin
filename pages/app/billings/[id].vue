<script setup>
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
		text: "Invoice Number",
		value: "invoice_number",
	},
	{
		text: "Reason",
		value: "reason",
	},

	{
		text: "Payment type",
		value: "payment_type",
	},
	{
		text: "Invoice created at",
		value: "invoice_created_at",
	},

	{
		text: "Amount",
		value: "amount",
	},
	{
		text: "Payment status",
		value: "payment_status",
	},
	{
		text: "verification status",
		value: "verification_status",
	},

	{
		text: "Action",
		value: "action",
	},
];

items.value = [
	{
		id: 1,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 2,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 3,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 4,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 5,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 6,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 7,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
	{
		id: 8,
		reason: "Subscription fee for the  Shager Plus of Shager Gebeta",
		invoice_number: "0001",
		payment_type: "Bank transfer",

		amount: 300,
		report_category: "False information",
		reported_by: "Samuel Noah",

		status: "Active",

		invoice_created_at: "2022 Jan 22",
	},
];

const loading = ref(true);
loading.value = false;
const clickRow = (item) => {
	router.push({
		name: "app-users-roles-edit",
		params: { edit: item.id },
	});
};

function gotoBillingDetail(event, item) {
	event.stopPropagation();

	router.push("/app/billings/billing_payment_detail/12");
}

definePageMeta({
	layout: "billing",
});
</script>

<template>
	<div class="w-full py-6 pl-10 pr-16">
		<!-- -----------------------Place name---------------- -->
		<div
			@click="router.back()"
			class="py-4 secondary-flex-row text-sheger-gray-100 hover:cursor-pointer"
		>
			<Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
			<p class="text-4xl font-semibold">Hilton Hotel</p>
		</div>
		<!-- -------------------------Subscription------------------ -->

		<div
			class="grid items-center grid-cols-2 px-12 py-8 mt-3 mb-8 bg-primary-50"
		>
			<div class="flex flex-col space-y-6">
				<p class="secondary-text">Current Plan</p>

				<p class="font-semibold text-sheger-gray-100">
					<span class="text-2xl"> SHEGER PRO</span>
					<span class="px-6 mx-5 text-white rounded-full bg-primary-600"
						>Monthly</span
					>
				</p>
				<p class="secondary-text">
					Nulla ultricies dolor scelerisque quam. Dolor sodales tortor
					pellentesque augue. Eget sem ipsum magna sit enim maecenas. Parturient
					tincidunt sit rhoncus pellentesque pretium mollis.
				</p>

				<p class="text-sheger-gray-100">
					<span class="font-medium">Next Payment</span> : Birr 2,300 |
					<span class="font-medium">Due on</span>:Feb 12,2023
				</p>
			</div>

			<div class="flex flex-col items-end space-y-6">
				<button class="w-56 text-white primary-button bg-primary-600">
					Upgrade Plan
				</button>
				<button class="w-56 bg-white primary-button secondary-border">
					Cancel Subscription
				</button>
			</div>
		</div>
		<div class="">
			<h-table
				:headers="headers"
				:items="items"
				v-model:sort="sort"
				:loading="loading"
				@click:row="clickRow"
				supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
				supportHeaderClass="bg-gray-100 border"
				tableHeaderStyle="secondary-border  bg-gray-50"
				tableBodyRowStyle="border py-6"
				rowHeadStyle="secondary-text"
				row-style="lg:text-sheger-gray-400"
			>
				<template v-slot:name="{ item }">
					<div class="secondary-flex-row">
						<div>
							<img
								src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								alt="user image"
								class="w-10 h-10 rounded-full"
							/>
						</div>
						<div>
							<p>{{ item.name }}</p>
							<p class="secondary-text">selamudev@gmail.com</p>
						</div>
					</div>
				</template>

				<template v-slot:verification_status="{ item }">
					<p class="bg-sheger-green-100 rounded-full py-0.5 text-center w-16">
						Verified
					</p>
				</template>
				<template v-slot:payment_status="{ item }">
					<p class="bg-sheger-green-100 rounded-full py-0.5 text-center w-16">
						Paid
					</p>
				</template>
				<template v-slot:report_description="{ item }">
					<p class="tertiary-text">Lorem ipsum dolor, sit amet</p>
				</template>
				<template v-slot:sign_up_method="{ item }">
					<p class="tertiary-text">
						{{ item.sign_up_method }}
					</p>
					<p>Verified</p>
				</template>

				<template v-slot:action="{ item }">
					<button @click="gotoBillingDetail($event, item)">
						<Icon name="fontisto:more-v" class="text-xl dark:text-white" />
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
