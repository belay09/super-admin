<script setup>
import { useFullscreen } from "@vueuse/core";
import getOneBillingQuery from "@/graphql/query/billing/item.gql";
import updateBillingMutation from "@/graphql/mutations/billing/edit.gql";
import priceCalculatorQuery from "@/graphql/query/billing/price-calculator.gql";
import useNotify from "@/use/notify";
import { get } from "@vueuse/core";

const { notify } = useNotify();
const emits = defineEmits(["update:modelValue", "refetch"]);

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	id: {
		type: Number,
		required: true,
	},
	currentStatus: {
		type: Object,
		required: true,
	},
});
const isVerified = ref(false);
const isDeclined = ref(false);
/*------------------------------------Fetch Billing Data------------------------*/

const billing = ref(null);

const {
	onResult: billingOnResult,
	onError: billingOnError,
	loading: billingLoading,
	refetch: refetchBilling,
} = authFetch(getOneBillingQuery, {
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
	filter: toRef(props.id),
});

billingOnResult((result) => {
	if (result.data?.billingsPaymentsByPk) {
		console.log(result.data.billingsPaymentsByPk);
		billing.value = result.data.billingsPaymentsByPk;
		priceFetchEnabled.value = true;
	}
});

billingOnError((err) => {
	console.log("dbvb", err);
});

/*------------------------------------Price Calculator------------------------*/

const priceFetchEnabled = ref(false);
const billingPrice = ref();

const pricingCalculatorFilter = computed(() => {
	return {
		place_billing_id: billing.value.billingId,
		pricing_plan_frequency_price_id: billing.value?.pricing_plan_frequency?.id,
	};
});

const {
	onResult: priceOnResult,
	onError: priceOnError,
	loading: priceLoading,
	refetch: refetchPrice,
} = authFetch(priceCalculatorQuery, {
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
	filter: pricingCalculatorFilter,
	enabled: priceFetchEnabled,
});

priceOnResult((result) => {
	if (result.data?.price) {
		billingPrice.value = result.data.price;
	}
});

/*------------------------------------Update Billing Data------------------------*/

const {
	mutate: updatePayment,
	onDone: updatePaymentDone,
	loading: updatePaymentLoading,
	onError: updatePaymentError,
} = authMutation(updateBillingMutation);

const verifyPayment = () => {
	updatePayment({
		id: props.id,
		input: {
			isVerified: true,
			isDeclined: false,
		},
	});
};

const declinePayment = () => {
	updatePayment({
		id: props.id,
		input: {
			isVerified: false,
			isDeclined: true,
		},
	});
};

updatePaymentDone(() => {
	if (isVerified.value) {
		notify({
			title: "Payment Approved",
			message: "Payment has been approved successfully",
			type: "success",
			borderClass: "border-l-8 border-green-300",
		});
	} else {
		notify({
			title: "Payment Declined",
			message: "Payment has been declined successfully",
			type: "success",
			borderClass: "border-l-8 border-green-300",
		});
	}

	emits("refetch");
	isVerified.value = false;
	isDeclined.value = false;
	openApproveConfirmationModal.value = false;
	open.value = false;
});

updatePaymentError((error) => {
	notify({
		title: "Some thing went wrong",
		message: error.message,
		type: "error",
		borderClass: "border-l-8 border-primary-300",
	});
});

/*----------------------------Toggle Full Screen ----------------------------------*/
const modal = ref(null);
const { isFullscreen, enter, exit, toggle } = useFullscreen(modal);

const open = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		if (!newVal) {
			isVerified.value = false;
			isDeclined.value = false;
		}
		emits("update:modelValue", newVal);
	},
});

const openApproveConfirmationModal = ref(false);
const openDeclineConfirmationModal = ref(false);
</script>

<template>
	<Modals-Confirmation
		:auto-close="false"
		v-model="openApproveConfirmationModal"
		title="Approve Payment"
		icon="lucide:file-check-2"
		icon-class="self-center text-primary-600"
		sureQuestion="Are you sure you want to approve this payment?"
		confirm-button="Approve"
		description="After approving  the payment will be marked as paid and the invoice will be generated."
		@confirm="[(isVerified = true), verifyPayment()]"
	/>
	<Modals-Confirmation
		:auto-close="false"
		v-model="openDeclineConfirmationModal"
		title="Decline Payment"
		icon="fluent-mdl2:entry-decline"
		icon-class="self-center text-primary-600"
		sureQuestion="Are you sure you want to decline this payment?"
		confirm-button="Decline"
		description="After this action  the payment will be marked as declined and the invoice will not be generated."
		@confirm="[(isDeclined = true), declinePayment()]"
	/>
	<ModalsModal
		v-if="!billingLoading"
		body-class="max-w-[1500px] !p-2 "
		v-model="open"
		:auto-close="false"
	>
		<template #content>
			<div ref="modal" class="w-full p-4 bg-white">
				<div class="flex justify-between">
					<p
						class="flex items-center text-2xl font-medium text-primary-600 gap-x-2"
					>
						<Icon :name="currentStatus.icon" /> {{ currentStatus.name }}
					</p>
					<button @click="open = false">
						<Icon name="ic:round-close" class="text-2xl" />
					</button>
				</div>
				<div class="grid grid-cols-5 mt-4 gap-x-4">
					<!--  -----------------------Left side---------------- -->
					<div
						class="col-span-3 pb-2 space-y-3 overflow-hidden border rounded-md"
					>
						<div class="grid items-center grid-cols-4 p-10 bg-primary-50">
							<!-- ---------------------Sponsors--------------------- -->
							<div class="flex flex-col col-span-3 space-y-2">
								<div class="items-center secondary-flex-row">
									<button class="w-10 h-10 rounded-full bg-primary-600">
										<Icon name="uil:phone" class="text-white"></Icon>
									</button>

									<div>
										<p class="secondary-text">+251 123 456 8677</p>
										<p class="secondary-text">+251 123 456 8677</p>
									</div>
								</div>
								<div class="items-center secondary-flex-row">
									<button class="w-10 h-10 rounded-full bg-primary-600">
										<Icon name="uil:phone" class="text-white"></Icon>
									</button>

									<p class="secondary-text">info@shegergebeta.com</p>
								</div>
								<div class="items-center secondary-flex-row">
									<button class="w-10 h-10 rounded-full bg-primary-600">
										<Icon name="uil:phone" class="text-white"></Icon>
									</button>

									<p class="secondary-text w-[70%]">
										Afomi Building 3rd floor, Bole road, Behind Friendship Mall
										Addis Ababa, Ethiopia
									</p>
								</div>
							</div>

							<!-- --------------Logo---------------- -->
							<div class="flex justify-end secondary-flex-row">
								<div>
									<img
										src="/images/static/large-size-logo.png"
										alt=" logo"
										class="object-cover w-24 h-24"
									/>
								</div>
								<div
									class="pl-3 text-2xl font-semibold border-l-2 border-white text-primary-600"
								>
									<p>Sheger</p>
									<p>Gebeta</p>
								</div>
							</div>
						</div>
						<!-- ------------------Bill data--------------------- -->
						<div class="relative h-full px-4">
							<!-- -----------------Section 1----------- -->

							<div class="flex">
								<div class="flex flex-col space-y-3 w-[60%]">
									<p class="secondary-text">
										Bill To :
										<span class="font-medium">{{
											billing?.billing_address?.place?.name
										}}</span>
									</p>
									<p class="secondary-text">
										Address :
										<span class="font-medium">Kirikos Addis Ababa</span>
									</p>
									<p class="secondary-text">
										Contact : <span class="font-medium">Selamu Dawit</span>
									</p>
									<p class="secondary-text">
										Phone :
										<span class="font-medium">{{
											billing?.billing_address?.place?.contactPhoneNumber
										}}</span>
									</p>
									<p class="secondary-text">
										Email :
										<span class="font-medium">{{
											billing?.billing_address?.place?.contactEmail
										}}</span>
									</p>
								</div>

								<!-- ----- -->

								<div class="flex flex-col space-y-5">
									<p class="secondary-text">
										<span class="font-light underline"> Date </span>:

										<span class="font-medium">{{ billing?.paymentDate }}</span>
									</p>

									<p class="secondary-text">
										<span class="font-light underline"> Tin Number </span>:

										<span class="font-medium">{{
											billing?.billing_address?.place?.tinNumber
										}}</span>
									</p>
								</div>
							</div>

							<div class="w-full my-2 h-[4px] bg-primary-600"></div>

							<div class="border-b">
								<table class="w-full">
									<tr class="text-left text-primary-600">
										<th class="py-4">Description</th>
										<th class="py-4">Price</th>
										<th class="py-4">Qty</th>
										<th class="py-4">Amount</th>
									</tr>
									<tr class="text-lg font-medium">
										<td>
											{{ billing?.pricing_plan_frequency?.pricingPlan?.title }}

											<span class="text-sm font-light"
												>/{{ billing?.pricing_plan_frequency?.frequency }}</span
											>
										</td>
										<td>
											{{ billingPrice[0].subtotal }}
										</td>
										<td>1</td>
										<td>{{ billingPrice[0].total }}</td>
									</tr>
								</table>
							</div>

							<!-- ---------------footer---------------- -->

							<div class="flex justify-end py-4">
								<div class="grid grid-cols-2 gap-y-2">
									<p class="text-xl font-medium text-right text-primary-600">
										Subtotal
									</p>
									<p
										class="max-w-[8rem] mx-auto flex items-center gap-x-2 secondary-text lg:text-lg text-right"
									>
										{{ billingPrice[0].subtotal }}
										<span class="text-sm">Br.</span>
									</p>

									<p class="text-xl font-medium text-right text-primary-600">
										Vat(15%)
									</p>
									<p
										class="max-w-[8rem] mx-auto flex items-center gap-x-2 secondary-text lg:text-lg text-right"
									>
										{{ billingPrice[0].vat }} <span class="text-sm">Br.</span>
									</p>

									<p class="text-xl font-medium text-right text-primary-600">
										Total Amount Due
									</p>
									<p
										class="text-primary-600 font-medium flex items-center gap-x-2 max-w-[8rem] mx-auto lg:text-lg text-right"
									>
										{{ billingPrice[0].total }} <span class="text-sm">Br.</span>
									</p>
								</div>
							</div>

							<div class="mt-6">
								<p class="secondary-text">Invoice Terms</p>
								<div class="flex justify-between mt-2">
									<p class="max-w-sm secondary-text">
										Please pay your invoice in person at the head office of
										Sheger Gebeta before the due date.
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- ----------------------right side---------------------- -->
					<div class="flex flex-col col-span-2 p-6 space-y-4 border rounded-md">
						<p class="text-2xl font-medium uppercase text-sheger-gray-100">
							Payment Information
						</p>

						<div class="flex flex-col space-y-5">
							<p class="secondary-text">
								Bill To :
								<span class="font-medium">{{
									billing?.billing_address?.place?.name
								}}</span>
							</p>

							<p class="secondary-text">
								Transaction Id :
								<span class="font-medium">{{ billing?.transactionId }}</span>
							</p>
						</div>

						<div class="flex-grow space-y-4 overflow-clip">
							<div class="flex justify-between">
								<p class="text-lg text-black underline">Reference File</p>
								<button @click="toggle" class="p-1 rounded-md bg-primary-50">
									<Icon
										:name="
											isFullscreen
												? 'ic:baseline-fullscreen-exit'
												: 'material-symbols:fullscreen'
										"
										class="text-2xl"
									/>
								</button>
							</div>
							<div class="flex items-center justify-center h-full">
								<img
									v-if="billing.recieptUrl"
									:src="billing?.recieptUrl"
									alt=" payment file"
									class="object-cover h-full rounded-md"
								/>
								<div v-else class="space-y-6 text-center text-gray-500">
									<Icon
										name="material-symbols:unknown-document-outline"
										class="text-9xl"
									/>
									<P class="text-3xl">No file attached</P>
								</div>
							</div>
						</div>
						<div
							v-if="!billing.isVerified && !billing.isDeclined"
							class="justify-between w-full h-fit secondary-flex-row"
						>
							<button
								@click="open = false"
								class="block w-full border border-primary-300 text-primary-600 primary-button"
							>
								<Icon
									name="heroicons:arrow-left-20-solid"
									class="text-2xl"
								></Icon>

								<span class="">Cancel</span>
							</button>

							<button
								@click="openDeclineConfirmationModal = true"
								class="block w-full text-white bg-primary-600 primary-button secondary-border"
							>
								<Icon name="fluent-mdl2:entry-decline" class="text-2xl"></Icon>

								<span class="">Decline</span>
							</button>
							<button
								@click="openApproveConfirmationModal = true"
								class="block w-full border primary-button"
							>
								<Icon name="heroicons:credit-card" class="text-2xl"></Icon>

								<span class="">Approve</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>
	</ModalsModal>
</template>
