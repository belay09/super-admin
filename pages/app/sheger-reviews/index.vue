<script setup>
/***---------------------Tab--------------------- */

/**-----------------------------------imports----------------------------- */
import reviewStatusAggregateQuery from "@/graphql/query/aggregate/review-status-aggregate.gql";
import reviewsQuery from "@/graphql/query/reviews/list.gql";

import useNotify from "@/use/notify";

/*----------------------------Global Variables---------------------------*/
const { notify } = useNotify();

/**--------------------Tab data-------------------- */
const tabs = ref([
	{
		name: "Published",
		value: "PUBLISHED",
		length: 75,
	},
	{
		name: "Pending",
		value: "PENDING",
		length: 12,
	},
	{
		name: "Draft",
		value: "DRAFT",
		length: 1,
	},
	{
		name: "Removed",
		value: "REMOVED",
		length: 0,
	},
]);
const currentTabIndex = ref(0);

/*...................Aggregate data fetch.............*/

const orderBy = ref([{}]);
const {
	onResult: aggregateOnResult,
	onError: aggregateOnError,
	loading: aggregateLoading,
	refetch: aggregateReFetch,
} = authListQuery(reviewStatusAggregateQuery, {}, orderBy, 0, 7);

aggregateOnResult((result) => {
	if (result.data) {
		tabs.value.forEach((tab) => {
			tab.length = result.data?.[tab.value]?.aggregate?.count;
		});
	}
});
aggregateOnError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

/***---------------------Place data fetch--------------------- */
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const reviews = ref([]);
const limit = ref(6);
const length = ref(0);
const pageTracker = ref(1);
const search = ref("");

/***-------------------------Compute offset------------------------- */

const offset = computed(() => {
	return (pageTracker.value - 1) * limit.value;
});
const totalPage = computed(() => {
	return Math.ceil(length.value / limit.value);
});

watch(currentTabIndex, () => {
	pageTracker.value = 1;
});

/**-------------------Compute filter when tab change---------------- */
const filter = computed(() => {
	let query = {};
	query._and = [
		{
			status: {
				_eq: tabs.value[currentTabIndex.value].value,
			},
		},
		{
			title: {
				_ilike: `%${search.value}%`,
			},
		},
	];
	return query;
});
const { onResult, onError, loading, refetch } = authListQuery(
	reviewsQuery,
	filter,
	sort,
	offset,
	limit
);

provide("refetchReview", refetch);
provide("refetchAggregate", aggregateReFetch);
onResult((result) => {
	if (result.data?.reviews) {
		reviews.value = result.data.reviews;
		length.value = result.data.reviewsAggregate?.aggregate?.count;
	}
});

onError((error) => {
	console.log(error, "reviews error");
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

definePageMeta({
	layout: "home",
});
</script>
<template>
	<div class="w-full">
		<!-- ---------search and filter and btn--------- -->

		<div class="relative">
			<div class="absolute right-0 flex top-2">
				<div class="secondary-flex-row">
					<H-Textfield
						name="search"
						type="text"
						placeholder="Search here"
						trailing-icon="uil:search"
						v-model="search"
					></H-Textfield>
					<div class="px-4 py-3 border rounded-md">
						<Icon
							name="heroicons-outline:adjustments"
							class="z-30 text-2xl cursor-pointer"
						/>
					</div>
					<nuxt-link
						to="/app/sheger-reviews/post-new-review"
						class="block primary-button bg-primary-600"
					>
						<Icon
							name="lucide:building-2"
							class="text-xl text-white"
							color=""
						/>
						<span class="text-white">Post New Review</span>
					</nuxt-link>
				</div>
			</div>
		</div>

		<div class="pt-10"></div>
		<H-Tab v-model:current-tab-index="currentTabIndex" :tabs="tabs">
			<template v-slot:tab="{ tabData }">
				<div class="secondary-flex-row">
					<span class="text-xl">{{ tabData.tab?.name }}</span>
					<span
						:class="{ 'bg-primary-100': tabData.isActive }"
						class="px-1.5 py-0.5 rounded-lg border bg-gray-200"
						>{{ tabData.tab?.length }}</span
					>
				</div>
			</template>
			<template #PUBLISHED>
				<div>
					<Reviews-List
						:reviews="reviews"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
					/>
					<HPaginate
						:items-per-page="limit"
						v-model:offset="offset"
						:total-data="length"
						v-model="pageTracker"
						class="w-full pt-16"
					></HPaginate>
					<HZeroResult
						class="py-8"
						v-if="!loading && length == 0"
					></HZeroResult>
				</div>
			</template>
			<template #PENDING>
				<div>
					<Reviews-List
						:reviews="reviews"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
					/>
					<HPaginate
						:items-per-page="limit"
						v-model:offset="offset"
						:total-data="length"
						v-model="pageTracker"
						class="w-full pt-16"
					></HPaginate>
					<HZeroResult
						class="py-8"
						v-if="!loading && length == 0"
					></HZeroResult>
				</div>
			</template>
			<template #DRAFT>
				<div>
					<Reviews-List
						:reviews="reviews"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
					/>
					<HPaginate
						:items-per-page="limit"
						v-model:offset="offset"
						:total-data="length"
						v-model="pageTracker"
						class="w-full pt-16"
					></HPaginate>
					<HZeroResult
						class="py-8"
						v-if="!loading && length == 0"
					></HZeroResult>
				</div>
			</template>
			<template #REMOVED>
				<div>
					<Reviews-List
						:reviews="reviews"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
					/>
					<HPaginate
						:items-per-page="limit"
						v-model:offset="offset"
						:total-data="length"
						v-model="pageTracker"
						class="w-full pt-16"
					></HPaginate>
					<HZeroResult
						class="py-8"
						v-if="!loading && length == 0"
					></HZeroResult>
				</div>
			</template>
		</H-Tab>
	</div>
</template>
