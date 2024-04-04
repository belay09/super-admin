<script setup>
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";
import addPricingQuery from "@/graphql/mutations/pricing/add.gql";

const { notify } = useNotify();
/***---------------------Tab--------------------- */
const router = useRouter();
const { handleSubmit } = useForm();
const frequencies = ref([
	{
		name: "Monthly",
		id: "MONTHLY",
	},
	{
		name: "Annually",
		id: "ANNUALLY",
	},
	{
		name: "Quarterly",
		id: "QUARTERLY",
	},
]);

const formInput = ref({});
const lampPrices = ref([]);
// const pricingItems = ref([]);
const features = ref([]);

definePageMeta({
	layout: "home",
});

const {
	mutate: addPricing,
	onError: addPricingError,
	onDone: addPricingDone,
	loading: addPricingLoading,
} = authMutation(addPricingQuery);

const onSubmit = handleSubmit(() => {
	// if (!pricingItems.value.length) {
	// 	notify({
	// 		title: "Add pricing items",
	// 		description: "At lease one pricing items is required",
	// 		type: "error",
	// 		borderClass: "border-l-8 border-red-300 bg-primary-200",
	// 	});
	// 	return;
	// }
	if (!features.value.length) {
		notify({
			title: "Add features",
			description: "At lease one feature is required",
			type: "error",
			borderClass: "border-l-8  border-red-300 bg-primary-200",
		});
		return;
	}
	formInput.value.rank = 1;
	formInput.value.pricing_plan_frequencies = { data: lampPrices.value };
	formInput.value.pricing_plan_features = {
		data: features.value.map((item) => {
			return {
				feature: {
					data: item,
				},
			};
		}),
	};
	// formInput.value.pricing_plan_items = {
	// 	data: pricingItems.value.map((item) => {
	// 		return {
	// 			item: {
	// 				data: {
	// 					name: item.title,
	// 					description: item.description,
	// 					itemType: item.itemType,
	// 					title: item.title,
	// 					rules: {
	// 						limit: parseInt(item.limit),
	// 					},
	// 				},
	// 			},
	// 		};
	// 	}),
	// };

	addPricing({ object: formInput.value });
});

addPricingDone((result) => {
	notify({
		title: "Pricing created successfully",
		description: "Pricing created successfully",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});
	router.push("/app/billings/pricing");
});

addPricingError((error) => {
	notify({
		title: "Pricing creation failed",
		description: "Pricing creation failed",
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});
</script>

<template>
	<div class="w-full pl-10 pr-16 space-y-4">
		<div class="flex justify-between text-sheger-gray-100 hover:cursor-pointer">
			<p class="text-3xl font-semibold">Add Pricing Plan</p>
			<div class="flex gap-x-4">
				<button
					class="text-white !py-2 primary-button bg-primary-600"
					@click="onSubmit"
				>
					<Icon
						name="eos-icons:bubble-loading"
						class="text-xl text-white"
						v-if="addPricingLoading"
					/>
					<span v-else> Create </span>
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

		<div class="grid grid-cols-2 gap-8">
			<!-- -----------------Basic info---------------- -->
			<div>
				<p class="py-4 text-lg font-medium text-sheger-gray-100">Basic Info</p>
				<!-- -----------------Plan name---------------- -->
				<div class="flex items-center gap-x-6">
					<H-Textfield
						id="plan_name"
						name="plan_name"
						v-model="formInput.title"
						label="Plan Name"
						placeholder="Write here"
						rules="required"
					></H-Textfield>

					<div class="space-y-2 text-sheger-gray-100">
						<span>Visibility</span>
						<HSwitch
							class="relative"
							name="offer_takeout"
							v-model="formInput.isVisible"
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
			<!-- -----------------Pricing Items----------------
			<BillingsPricingItem v-model="pricingItems" /> -->
			<!-- -------------------------------Features---------------- -->
			<BillingsPricingFeatures v-model="features" />
		</div>
	</div>
</template>
