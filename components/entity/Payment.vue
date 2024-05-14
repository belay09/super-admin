<script setup>
import addPayment from "@/graphql/mutations/billing/create-payment.gql";
const emits = defineEmits(["update:modelValue", "refetch", "createDone"]);
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();

const { handleSubmit } = useForm();
const route = useRoute();
const router = useRouter();

const entity = ref({
	id: route.query.id,
	name: route.query.name,
});

const input = ref({});
const image = ref([]);
const paymentMethods = ref([
	{
		name: "bank",
		id: "BANK",
	},
	{
		name: "Cash",
		id: "CASH",
	},
	{
		name: "wallet",
		id: "WALLET",
	},
	{
		name: "Santim Pay",
		id: "SANTIM_PAY",
	},
]);

const {
	mutate: addPaymentMutate,
	onError: addPaymentError,
	onDone: addPaymentDone,
	loading: addPaymentLoading,
} = authMutation(addPayment);

const onSubmit = handleSubmit(() => {
	addPaymentMutate({
		input: {
			...input.value,
			entityId: entity?.value.id,
			recieptUrl: image.value[0],
		},
	});
});

addPaymentDone(() => {
	router.push({
		path: route.path,
		query: {
			step: 2,
			id: route.query.id,
			name: route.query.name,
		},
	});
});

const prev = () => {
	router.push({
		path: route.path,
		query: {
			step: 0,
			id: route.query.id,
			name: route.query.name,
		},
	});
};

addPaymentError((error) => {
	notify({
		type: "error",
		title: "Something went wrong",
		description: error.message,
		borderClass: "border-l-8 border-red-300 ",
	});
});

/*----------------------------Toggle Full Screen ----------------------------------*/
</script>
<template>
	<div class="px-4 py-2 space-y-4">
		<form class="grid grid-cols-2 gap-x-8">
			<div class="space-y-3">
				<BillingsPricingList v-model="input.pricingPlanFrequencyId" />
			</div>
			<div class="space-y-4">
				<HTextfield
					name=" place name"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					v-model="entity.name"
					disabled="true"
					label="Place Name"
					label-class="!text-gray-700"
				>
				</HTextfield>

				<div class="grid w-full grid-cols-2 gap-x-2">
					<HSingleSelect
						name="payment-method"
						v-model="input.paymentMethod"
						label="Payment Method"
						:items="paymentMethods"
					/>
					<HDatePickers
						name="payment-date"
						v-model="input.paymentDate"
						label-class="!text-gray-700"
						label="Payment Date"
					/>
				</div>

				<HTextfield
					name=" transaction-id"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					label="Transaction ID"
					v-model="input.transactionId"
					label-class="!text-gray-700"
				>
				</HTextfield>
				<HTextarea
					name="transaction-note"
					v-model="input.transactionNote"
					rows="3"
					label="Transaction Note"
				></HTextarea>
				<div class="space-y-3">
					<p class="text-gray-700">Receipt File</p>
					<HFileUploadWrapper
						name="file"
						:fileLimit="1"
						folder="applications_form"
						description="upload file"
						placeholder="select  files"
						v-model="image"
						:disabled="false"
					/>
				</div>
			</div>
		</form>
		<div class="flex items-center justify-between my-2">
			<button
				class="primary-button border disabled:opacity-50 disabled:cursor-not-allowed flex items-center !px-12 gap-4 text-white bg-primary-600"
				@click="prev()"
			>
				<Icon name="material-symbols:arrow-back-ios" />
				Previous
			</button>
			<button
				class="primary-button border flex items-center !px-12 gap-4 text-white bg-primary-600"
				@click.prevent="onSubmit()"
			>
				{{ addPaymentLoading ? "Submitting..." : "Next" }}
				<Icon name="material-symbols:arrow-forward-ios" />
			</button>
		</div>
	</div>
</template>
