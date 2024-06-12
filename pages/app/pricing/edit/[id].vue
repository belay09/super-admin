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

const formInput = ref({});
const pricingItems = ref([]);
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

	features.value = formInput.value.pricing_plan_features.map(({ feature }) => {
		return {
			title: feature.title,
			description: feature.description,
		};
	});
	console.log("hello",formInput.value);
	pricingItems.value = formInput.value.pricing_plan_frequencies.map((item) => {
		return {
			price: item.price,
			frequency: item.frequency,
			item_id: item.items[0].itemId,
			id:item.id,
			pricing_plan_frequency_items: {
				data: {
					item: {
						data: {
							
							title: item.items[0].item.title,
							name: item.items[0].item.name,
							rules: item.items[0].item.rules,
						},
					},
				},
			},
		};
	});
});

/*---------------------Edit Pricing Plan--------------------- */

const {
	mutate: editMutation,
	loading: editLoading,
	onError: onEditError,
	onDone: onEditDone,
} = authMutation(updatePricingQuery);

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

	const input = ref({
		title: formInput.value.title,
		description: formInput.value.description,
		isVisible: formInput.value.isVisible,
		rank: formInput.value.rank,
	});

	editMutation({
		pricing_plan_id: route.params.id,
		// frequency_price: pricingItems.value.map((item) => {
		// 	return {
		// 		pricingPlanId: route.params.id,
		// 		...item,
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
	router.push("/app/pricing");
});

onEditError(() => {
	notify({
		title: "Pricing Plan",
		description: "Pricing plan updated failed",
		type: "error",
		borderClass: "border-l-8 border-red-300 bg-primary-200",
	});
});

definePageMeta({
	layout: "billing",
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

		<div class="grid grid-cols-3 !h-[750px] overflow-hidden gap-8">
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

				<!-- --------------------Plan visibility---------------- -->
			</div>
			<BillingsPricingItemEdit v-model="pricingItems" />
			<!-- -------------------------------Features---------------- -->
			<BillingsPricingFeatures v-model="features" />
		</div>
	</div>
</template>
