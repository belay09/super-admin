<script setup>
import { useFullscreen } from "@vueuse/core";
import useNotify from "@/use/notify";
import getOneInvoiceQuery from "@/graphql/query/invoice/item.gql";
import html2pdf from "html2pdf.js";

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
});

const invoice = ref(null);

const {
	onResult: invoiceOnResult,
	onError: invoiceOnError,
	loading: invoiceLoading,
	refetch: refetchInvoice,
} = authFetch(getOneInvoiceQuery, {
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
	filter: toRef(props.id),
});

invoiceOnResult((result) => {
	if (result.data?.billingsInvoicesByPk) {
		invoice.value = result.data.billingsInvoicesByPk;
	}
});

function generatePDF() {
	html2pdf()
		.from(document.getElementById("invoiceDiv"))
		.set({
			margin: 1,
			filename: "Shegergebeta-Invoice.pdf",
			html2canvas: {
				dpi: 300,
				letterRendering: true,
				useCORS: true,
			},
		})
		.save();
}

/*----------------------------Toggle Full Screen ----------------------------------*/
const modal = ref(null);
const { isFullscreen, enter, exit, toggle } = useFullscreen(modal);

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
	<ModalsModal
		v-if="!invoiceLoading"
		body-class="max-w-[1500px] !p-2 "
		v-model="open"
	>
		<template #content>
			<div ref="modal" class="w-full p-4 bg-white">
				<div class="flex justify-between">
					<p
						class="flex items-center text-2xl font-medium text-primary-600 gap-x-2"
					>
						<Icon name="iconamoon:invoice" /> Invoice
					</p>

					<button @click="open = false">
						<Icon name="ic:round-close" class="text-2xl" />
					</button>
				</div>
				<div class="grid grid-cols-5 mt-4 gap-x-4">
					<!--  -----------------------Left side---------------- -->
					<div class="col-span-3 border rounded-md">
						<div id="invoiceDiv" class="pb-2 space-y-3 overflow-hidden">
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
											Afomi Building 3rd floor, Bole road, Behind Friendship
											Mall Addis Ababa, Ethiopia
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
												invoice?.payment?.billing_address?.place?.name
											}}</span>
										</p>
										<p class="secondary-text">
											Address :
											<span class="font-medium"
												>{{ invoice?.payment?.billing_address?.city?.name }}

												{{
													invoice?.payment?.billing_address?.area?.name
												}}</span
											>
										</p>

										<p class="secondary-text">
											Phone :
											<span class="font-medium">{{
												invoice?.payment?.billing_address?.place
													?.contactPhoneNumber
											}}</span>
										</p>
										<p class="secondary-text">
											Email :
											<span class="font-medium">{{
												invoice?.payment?.billing_address?.place?.contactEmail
											}}</span>
										</p>
									</div>

									<!-- ----- -->

									<div class="flex flex-col space-y-5">
										<p class="space-x-2 secondary-text">
											<span class="font-light underline underline-offset-4">
												Date </span
											>:
											<span class="font-medium">{{
												invoice?.payment?.paymentDate
											}}</span>
										</p>
										<p class="flex space-x-2 secondary-text whitespace-nowrap">
											<span class="font-light underline underline-offset-4"
												>Invoice Number
											</span>
											:
											<span class="font-medium">
												{{ invoice?.invoiceNumber }}</span
											>
										</p>

										<p class="space-x-2 secondary-text">
											<span class="font-light underline underline-offset-4">
												Tin Number </span
											>:
											<span class="font-medium">{{
												invoice?.payment?.billing_address?.place?.tinNumber
											}}</span>
										</p>
									</div>
								</div>

								<div class="w-full my-2 h-[4px] bg-primary-600"></div>

								<div class="pb-4 border-b">
									<table class="w-full">
										<tr class="text-left text-primary-600">
											<th class="py-4">Description</th>
											<th class="py-4">Price</th>
											<th class="py-4">Qty</th>
											<th class="py-4">Amount</th>
										</tr>
										<tr class="text-lg font-medium">
											<td>
												{{
													invoice?.payment?.pricing_plan_frequency?.pricingPlan
														?.title
												}}
												<span class="text-sm font-light">
													/{{
														invoice?.payment?.pricing_plan_frequency?.frequency
													}}</span
												>
											</td>
											<td>
												{{ invoice.subTotal }}
											</td>
											<td>1</td>
											<td>{{ invoice.total }}</td>
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
											class="max-w-[8rem] flex items-center gap-x-2 mx-auto secondary-text lg:text-lg text-right"
										>
											{{ invoice.subTotal }}<span class="text-sm">Br.</span>
										</p>

										<p class="text-xl font-medium text-right text-primary-600">
											Vat
										</p>
										<p
											class="max-w-[8rem] flex items-center gap-x-2 mx-auto secondary-text lg:text-lg text-right"
										>
											{{ invoice.vat }}<span class="text-sm">Br.</span>
										</p>

										<p class="text-xl font-medium text-right text-primary-600">
											Total Amount Due
										</p>
										<p
											class="text-primary-600 max-w-[8rem] mx-auto flex items-center gap-x-2 lg:text-lg text-right"
										>
											{{ invoice.total }} <span class="text-sm">Br.</span>
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
									invoice?.payment?.billing_address?.place?.name
								}}</span>
							</p>
							<p class="secondary-text">
								Invoice Number :
								<span class="font-medium">{{ invoice?.invoiceNumber }}</span>
							</p>
							<p class="secondary-text">
								Transaction Id :
								<span class="font-medium">{{ invoice?.transactionId }}</span>
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
							<div class="flex flex-col items-center justify-center h-full">
								<img
									v-if="invoice.payment.recieptUrl"
									:src="invoice?.payment?.recieptUrl"
									alt=" payment file"
									class="object-cover max-h-[500px] h-full rounded-md"
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
						<div class="flex justify-end">
							<button
								@click="generatePDF()"
								class="block hover:bg-primary-200 primary-button secondary-border"
							>
								<Icon
									name="heroicons:arrow-down-tray-16-solid"
									class="text-2xl text-sheger-gray-100"
								></Icon>

								<span class="text-sheger-gray-100">Download Invoice</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</template>
	</ModalsModal>
</template>
