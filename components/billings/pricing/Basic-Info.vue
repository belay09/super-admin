<script setup>
const formInput = ref({});
const lampPrices = ref([]);
const frequencies = ref([
	{
		name: "Monthly",
		id: "Monthly",
	},
	{
		name: "Yearly",
		id: "Yearly",
	},
	{
		name: "Quarterly",
		id: "Quarterly",
	},
	{
		name: "Bi-Annually",
		id: "Bi-Annually",
	},
]);
</script>
<template>
	<div>
		<p class="py-4 text-lg font-medium text-sheger-gray-100">Basic Info</p>
		<!-- -----------------Plan name---------------- -->
		<div class="flex items-center gap-x-6">
			<H-Textfield
				id="plan_name"
				name="plan_name"
				v-model="formInput.plan_name"
				label="Plan Name"
				placeholder="Write here"
				rules="required"
			></H-Textfield>

			<div class="space-y-2 text-sheger-gray-100">
				<span>Visibility</span>
				<HSwitch
					class="relative"
					name="offer_takeout"
					v-model="formInput.offer_takeout"
				></HSwitch>
			</div>
		</div>

		<!-- ---------------------Description---------------- -->

		<H-Textarea
			id="description"
			name="description"
			v-model="formInput.description"
			label="Description"
			class="pt-4"
			rules="required"
		></H-Textarea>

		<!-- -----------------Frequency and Lamp Sum Price---------------- -->
		<BillingsPricingAddPrice
			freq-label-name="Frequency"
			price-label-name="Lump Sum Price"
			:frequencies="frequencies"
			v-model="lampPrices"
		/>
		<!-- --------------------Plan visibility---------------- -->
	</div>
</template>
