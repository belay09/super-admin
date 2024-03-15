<script setup>
import getOneBillingQuery from "@/graphql/query/billing/item.gql";
const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	id: {
		type: Number,
		required: true,
	},
});

const billing = ref(null);
const {
	onResult: billingOnResult,
	onError: billingOnError,
	loading: billingLoading,
} = authItemQuery(getOneBillingQuery, props.id);

billingOnResult((result) => {
	if (result.data?.billingsPaymentsByPk) {
		billing.value = result.data.billingsPaymentsByPk;
	}
});

const open = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emits("update:modelValue", newVal);
	},
});
</script>

<template>
	<ModalsModal body-class="max-w-[1500px] !p-2 " v-model="open">
		<template #content>
			<div class="w-full p-4">
				<div class="grid grid-cols-5 gap-x-4">
					<!--  -----------------------Left side---------------- -->
					<div class="col-span-3 space-y-3 overflow-hidden border rounded-md">
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

							<div class="flex items-center">
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

								<div class="flex flex-col space-y-3">
									<p
										class="text-3xl font-medium uppercase text-sheger-gray-100"
									>
										Invoice
									</p>
									<div class="flex flex-col space-y-5">
										<p class="secondary-text">
											Date : <span class="font-medium">Feb 22, 2023</span>
										</p>
										<p class="secondary-text">
											Invoice Number : <span class="font-medium">0001</span>
										</p>
										<p class="secondary-text">
											Contact Number : <span class="font-medium">PXMghjw</span>
										</p>
									</div>
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
										</td>
										<td>
											{{ billing?.pricing_plan_frequency?.price }}
										</td>
										<td>1</td>
										<td>{{ billing?.total }}</td>
									</tr>
									<tr class="text-sm">
										<td class="w-72 line-clamp-2">
											{{
												billing?.pricing_plan_frequency?.pricingPlan
													?.description
											}}
										</td>
										<td></td>
										<td></td>
										<td></td>
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
										class="max-w-[8rem] mx-auto secondary-text lg:text-lg text-right"
									>
										{{ billing?.subtotal }}
									</p>

									<p class="text-xl font-medium text-right text-primary-600">
										Vat
									</p>
									<p
										class="max-w-[8rem] mx-auto secondary-text lg:text-lg text-right"
									>
										{{ billing?.vat }}
									</p>
									<p class="text-xl font-medium text-right text-primary-600">
										Total Amount Due
									</p>
									<p
										class="max-w-[8rem] mx-auto secondary-text lg:text-lg text-right"
									>
										{{ billing?.total }}
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

									<button class="block primary-button secondary-border">
										<Icon
											name="heroicons:arrow-down-tray-16-solid"
											class="text-2xl text-sheger-gray-100"
										></Icon>

										<span class="text-sheger-gray-100">Download</span>
									</button>
								</div>
							</div>
						</div>
					</div>

					<!-- ----------------------Left side---------------------- -->
					<div
						class="flex flex-col col-span-2 p-6 space-y-4 border rounded-md h-fit"
					>
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
								Invoice Number : <span class="font-medium">0001</span>
							</p>
							<p class="secondary-text">
								Transaction Id : <span class="font-medium">0034786598437</span>
							</p>
						</div>

						<div class="flex flex-col items-center justify-center space-y-4">
							<p class="text-lg text-center secondary-text">Attached File</p>
							<img
								src="/images/temporary/payment-detail.png"
								alt=" payment file"
								class="object-cover h-[540px] rounded-md"
							/>
						</div>
						<div class="justify-between w-full secondary-flex-row">
							<button
								@click="open = false"
								class="block w-full primary-button secondary-border"
							>
								<Icon
									name="heroicons:arrow-left-20-solid"
									class="text-2xl"
								></Icon>

								<span class="">Cancel</span>
							</button>
							<button
								@click="open = false"
								class="block w-full text-white bg-primary-600 primary-button secondary-border"
							>
								<Icon name="fluent-mdl2:entry-decline" class="text-2xl"></Icon>

								<span class="">Decline</span>
							</button>
							<button
								class="block w-full text-white bg-green-700 primary-button"
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
