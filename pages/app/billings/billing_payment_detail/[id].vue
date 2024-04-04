<script setup>
/***---------------------Tab--------------------- */
const router = useRouter();

definePageMeta({
	layout: "billing",
});
</script>

<template>
	<div class="w-full py-6 pl-10 pr-16">
		<div class="grid grid-cols-5 gap-10">
			<!--  -----------------------Left side---------------- -->
			<div class="col-span-3 border">
				<div class="grid items-center grid-cols-2 p-10 bg-primary-50">
					<!-- ---------------------Sponsors--------------------- -->
					<div class="flex flex-col space-y-6">
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

							<p class="secondary-text">
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
								class="w-24 h-24"
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
				<div class="p-10">
					<!-- -----------------Section 1----------- -->

					<div class="flex items-center">
						<div class="flex flex-col space-y-5 w-[60%]">
							<p class="secondary-text">
								Bill To : <span class="font-medium">Addis Coffee House</span>
							</p>
							<p class="secondary-text">
								Address : <span class="font-medium">Kirikos Addis Ababa</span>
							</p>
							<p class="secondary-text">
								Contact : <span class="font-medium">Selamu Dawit</span>
							</p>
							<p class="secondary-text">
								Phone : <span class="font-medium">+25198765456</span>
							</p>
							<p class="secondary-text">
								Email : <span class="font-medium">selamudev@gmail.com</span>
							</p>
						</div>

						<!-- ----- -->

						<div class="flex flex-col space-y-6">
							<p class="text-4xl font-medium uppercase text-sheger-gray-100">
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

					<div class="w-full my-6 h-[4px] bg-primary-600"></div>

					<div class="border-b">
						<table class="w-full">
							<tr class="text-left text-primary-600">
								<th class="py-6">Description</th>
								<th class="py-6">Price</th>
								<th class="py-6">Qty</th>
								<th class="py-6">Amount</th>
							</tr>
							<tr class="text-xl font-medium">
								<td>Shager Plus (Monthly)</td>
								<td>4,500</td>
								<td>Monthly</td>
								<td>4,500</td>
							</tr>
						</table>

						<p class="py-6 secondary-text w-72">
							Suscription fee for Shager Plus plan service of Shager Gebeta
						</p>
					</div>

					<!-- ---------------footer---------------- -->

					<div class="flex justify-end py-6">
						<div class="grid grid-cols-2 gap-y-8">
							<p class="text-xl font-medium text-right">Subtotal</p>
							<p
								class="max-w-[8rem] mx-auto secondary-text lg:text-lg text-right"
							>
								4,500
							</p>

							<p class="text-xl font-medium text-right">Vat</p>
							<p
								class="max-w-[8rem] mx-auto secondary-text lg:text-lg text-right"
							>
								4,500
							</p>
							<p class="text-xl font-medium text-right">Total Amount Due</p>
							<p
								class="max-w-[8rem] mx-auto secondary-text lg:text-lg text-right"
							>
								4,500
							</p>
						</div>
					</div>

					<p class="secondary-text">Invoice Terms</p>

					<div class="flex justify-between">
						<p class="max-w-sm secondary-text">
							Please pay your invoice in person at the head office of Sheger
							Gebeta before the due date.
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

			<!-- ----------------------Left side---------------------- -->
			<div class="flex flex-col col-span-2 pl-6 pr-20 space-y-4 border">
				<p class="text-2xl font-medium uppercase text-sheger-gray-100">
					Payment Information
				</p>

				<div class="flex flex-col space-y-5">
					<p class="secondary-text">
						Bill To : <span class="font-medium">Addis Coffee House</span>
					</p>
					<p class="secondary-text">
						Invoice Number : <span class="font-medium">0001</span>
					</p>
					<p class="secondary-text">
						Transaction Id : <span class="font-medium">0034786598437</span>
					</p>
				</div>

				<div class="flex flex-col space-y-8">
					<p class="secondary-text">Attached File :</p>
					<div class="w-full">
						<img
							src="/images/temporary/payment-detail.png"
							alt=" payment file"
						/>
					</div>
				</div>
				<div class="justify-between w-full secondary-flex-row">
					<button class="block w-full primary-button secondary-border">
						<Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>

						<span class="">Back</span>
					</button>
					<button class="block w-full text-white primary-button bg-primary-600">
						<Icon name="heroicons:credit-card" class="text-2xl"></Icon>

						<span class="">Approve</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
