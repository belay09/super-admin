<script setup>
import addPayment from "@/graphql/mutations/billing/create-payment.gql";
const emits = defineEmits(["update:modelValue", "refetch"]);
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();

const { handleSubmit } = useForm();

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	place: {
		type: Object,
		required: true,
	},
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
			billingId: props.place?.billing_addresses[0]?.id,
			recieptUrl: image.value[0],
		},
	});
});

addPaymentDone(() => {
	notify({
		type: "success",
		title: "Payment created",
		description: "Payment created successfully",
		borderClass: "border-l-8 border-green-300 ",
	});
	navigateTo("/app/billings");
	emits("update:modelValue", false);
});

addPaymentError((error) => {
	notify({
		type: "error",
		title: "Something went wrong",
		description: error.message,
		borderClass: "border-l-8 border-red-300 ",
	});
});

/*----------------------------Toggle Full Screen ----------------------------------*/
const open = computed({
	get() {
		input.value = {};
		return props.modelValue;
	},
	set(newVal) {
		input.value = {};
		emits("update:modelValue", newVal);
	},
});
</script>

<template>
	<ModalsModal
		body-class="max-w-[1300px]  mt-12 !p-2 "
		v-model="open"
		:auto-close="false"
	>
		<template #content>
			<div class="px-4 py-2 space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center text-gray-600 gap-x-2">
						<Icon name="basil:invoice-outline" class="text-2xl" />
						<p class="text-xl font-medium">Create Payment</p>
					</div>
					<button @click="open = false">
						<Icon name="ic:round-close" class="text-2xl" />
					</button>
				</div>
				<form @submit.prevent="onSubmit" class="grid grid-cols-2 gap-x-8">
					<div class="space-y-4">
						<HTextfield
							name=" place name"
							class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
							rules="required"
							v-model="place.name"
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

					<div class="space-y-3">
						<BillingsPricingList v-model="input.pricingPlanFrequencyId" />
					</div>
					<div class="flex justify-end col-span-2 gap-x-2">
						<Button
							type="button"
							@click="open = false"
							class="border primary-button"
							>Cancel</Button
						>
						<button
							type="submit"
							class="text-white primary-button bg-primary-600"
						>
							{{ addPaymentLoading ? "Creating..." : "Create" }}
						</button>
					</div>
				</form>
			</div>
		</template>
	</ModalsModal>
</template>
