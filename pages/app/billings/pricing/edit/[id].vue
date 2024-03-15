<script setup>
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();
/***---------------------Tab--------------------- */
const router = useRouter();
const { handleSubmit } = useForm();
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

const formInput = ref({});
const lampPrices = ref([]);
const pricingItems = ref([]);
const features = ref([]);

definePageMeta({
	layout: "home",
});

const onSubmit = handleSubmit(() => {
	if (!pricingItems.value.length) {
		notify({
			title: "Add pricing items",
			description: "At lease one pricing items is required",
			type: "error",
			borderClass: "border-l-8 border-red-300 bg-primary-200",
		});
		return;
	}
	if (!features.value.length) {
		notify({
			title: "Add features",
			description: "At lease one feature is required",
			type: "error",
			borderClass: "border-l-8  border-red-300 bg-primary-200",
		});
		return;
	}
});
</script>

<template>
	<div class="w-full pl-10 pr-16 space-y-4">
		<div class="flex justify-between text-sheger-gray-100 hover:cursor-pointer">
			<p class="text-3xl font-semibold">Edit Pricing Plan</p>
			<div class="flex gap-x-4">
				<button
					class="text-white !py-2 primary-button bg-primary-600"
					@click="onSubmit"
				>
					Edit
				</button>
				<button
					class="px-4 py-2 border rounded-md text-gray-950 border-primary-600"
					@click="router.back()"
					type="button"
				>
					Cancel
				</button>
			</div>
		</div>

		<!-- -------------------Add pricing plan-------------------- -->

		<div class="grid grid-cols-3 gap-8">
			<!-- -----------------Basic info---------------- -->
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
			<!-- -----------------Pricing Items---------------- -->
			<BillingsPricingItem v-model="pricingItems" />
			<!-- -------------------------------Features---------------- -->
			<BillingsPricingFeatures v-model="features" />
		</div>
	</div>
</template>
