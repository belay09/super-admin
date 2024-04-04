<script setup>
import getPricingData from "@/graphql/query/pricing/item.gql";
import updatePricingQuery from "@/graphql/mutations/pricing/edit.gql";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();
/***---------------------Tab--------------------- */
const router = useRouter();
const route = useRoute();

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

/**----------------Fetch Pricing plan data--------------------------- */

const {
	onResult: pricingOnResult,
	onError: pricingOnError,
	loading: pricingLoading,
	refetch: pricingRefetch,
} = authItemQuery(getPricingData, route.params.id);

pricingOnResult((result) => {
	formInput.value = { ...result.data?.billingsPricingPlansByPk };
	lampPrices.value = formInput.value.pricing_plan_frequencies.map((item) => {
		return {
			price: item.price,
			frequency: item.frequency,
		};
	});
	features.value = formInput.value.pricing_plan_features.map(({ feature }) => {
		return {
			title: feature.title,
			description: feature.description,
		};
	});
	// pricingItems.value = formInput.value.pricing_plan_items.map(({ item }) => {
	// 	return {
	// 		title: item.title,
	// 		description: item.description,
	// 		itemType: item.itemType,
	// 		limit: item.rules.limit,
	// 	};
	// });
});

/*---------------------Edit Pricing Plan--------------------- */

const {
	mutate: editMutation,
	loading: editLoading,
	onError: onEditError,
	onDone: onEditDone,
} = authMutation(updatePricingQuery);

definePageMeta({
	layout: "home",
});

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

	const input = ref({
		title: formInput.value.title,
		description: formInput.value.description,
		isVisible: formInput.value.isVisible,
		rank: formInput.value.rank,
	});

	editMutation({
		pricing_plan_id: route.params.id,
		// pricing_plan_items: pricingItems.value.map((item) => {
		// 	return {
		// 		pricingPlanId: route.params.id,
		// 		item: {
		// 			data: {
		// 				name: item.title,
		// 				description: item.description,
		// 				itemType: item.itemType,
		// 				title: item.title,
		// 				rules: {
		// 					limit: parseInt(item.limit),
		// 				},
		// 			},
		// 		},
		// 	};
		// }),

		pricing_plan_feature: features.value.map((item) => {
			return {
				pricingPlanId: route.params.id,
				feature: {
					data: item,
				},
			};
		}),

		frequency_price: lampPrices.value.map((item) => {
			return {
				pricingPlanId: route.params.id,
				price: item.price,
				frequency: item.frequency,
			};
		}),

		pricing_plan: input.value,
	});
});

onEditDone(() => {
	notify({
		title: "Pricing Plan",
		description: "Pricing plan updated successfully",
		type: "success",
		borderClass: "border-l-8 border-green-300 bg-primary-200",
	});
	router.push("/app/billings/pricing");
});

onEditError(() => {
	notify({
		title: "Pricing Plan",
		description: "Pricing plan updated failed",
		type: "error",
		borderClass: "border-l-8 border-red-300 bg-primary-200",
	});
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
					<Icon name="eos-icons:loading" v-if="editLoading" />
					<Icon name="carbon:edit" v-else />
					<span>Edit</span>
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

		<div class="grid grid-cols-2 !h-[750px] overflow-hidden gap-8">
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
