<script setup>
import getPricingPlanQuery from "@/graphql/query/pricing/list.gql";

/**----------------Fetch Pricing plan data--------------------------- */
const props = defineProps({
	modelValue: {
		type: Number,
	},
});

const emit = defineEmits(["update:modelValue"]);

const pricingPlans = ref([]);
const pricingPlansDisplay = computed(() => {
	let plans = [];

	pricingPlans.value.forEach((item) => {
		item.pricing_plan_frequencies.forEach((value) => {
			plans.push({ frequency: { ...value }, ...item });
		});
	});
	return plans;
});

const orderBy = ref([{}]);
const {
	onResult: pricingOnResult,
	onError: pricingOnError,
	loading: pricingLoading,
	refetch: pricingRefetch,
} = authListQuery(getPricingPlanQuery, {}, orderBy, 0, 7);

pricingOnResult((result) => {
	pricingPlans.value = result.data?.billingsPricingPlans;
});

const selectedPlan = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emit("update:modelValue", newVal);
	},
});
</script>
<template>
	<div>
		<p class="text-gray-700">Pricing Plans</p>
	</div>
	<div class="grid w-full overflow-y-auto pr-2 h-[70vh] grid-cols-2 gap-4 pb-4">
		<div
			@click="selectedPlan = plan.frequency.id"
			v-for="(plan, i) in pricingPlansDisplay"
			:key="i"
			:class="selectedPlan == plan.frequency.id ? 'border-red-600' : ''"
			class="min-h-[200px] h-fit cursor-pointer space-y-4 hover:border-red-600 border rounded-lg p-4"
		>
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<h1 class="text-xl font-semibold">{{ plan.title }}</h1>
					<Icon
						v-if="plan.frequency.id == selectedPlan"
						name="uis:check"
						class="text-2xl text-primary-600"
					/>
				</div>
				<p class="text-sm">
					ETB
					<span class="text-lg font-medium"
						>{{ plan.frequency.price }}/<span class="lowercase">{{
							plan.frequency.frequency
						}}</span></span
					>
				</p>
				<p class="text-sm text-gray-600 line-clamp-3">
					{{ plan.description }}
				</p>
			</div>
		</div>
	</div>
</template>
