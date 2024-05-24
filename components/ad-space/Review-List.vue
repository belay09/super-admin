<script setup>
import reviewAdListsQuery from "@/graphql/query/review-ads/list.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["edit"]);

/***---------------------Place ads data fetch--------------------- */

const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const reviewAds = ref([]);
const limit = ref(100);
const search = ref("");
const offset = ref(0);

/***-------------------------Compute offset------------------------- */
/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
	let query = {};
	query._and = [
		{
			_or: [
				{
					review: {
						title: {
							_ilike: `%${search.value}%`,
						},
					},
				},
			],
		},
	];

	return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
	reviewAdListsQuery,
	filter,
	sort,
	offset,
	limit
);
onResult((result) => {
	if (result.data?.reviewAds) {
		reviewAds.value = result.data.reviewAds;
	}
});

onError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});
provide("refetchAds", refetch);
const openAddAdSpace = ref(false);
</script>

<template>
	<!-- -----------------------Add ad space modal----------------------- -->
	<AdSpace-ReviewAdAdd v-if="openAddAdSpace" v-model="openAddAdSpace" />

	<div class="space-y-6">
		<div class="flex justify-between items-center">
			<div class="flex items-center gap-x-8">
				<H-Textfield
					name="search"
					type="text"
					placeholder="Search here"
					trailing-icon="uil:search"
					v-model="search"
				></H-Textfield>
				<div v-if="loading" class="skeleton w-36 h-6 rounded-t-lg"></div>
				<h3 v-else class="text-2xl font-medium">
					{{ reviewAds.length }} Ads Running
				</h3>
			</div>

			<button
				@click="openAddAdSpace = true"
				class="block primary-button bg-primary-600 hover:bg-pir"
			>
				<Icon name="icons8:advertising" class="text-xl text-white" color="" />
				<span class="text-white">Add New Ad Space</span>
			</button>
		</div>

		<!-- -------------------Ad space place type total places ------------- -->
		<div v-if="aggregateLoading" class="flex items-center space-x-6 py-5">
			<!-- Skeleton loader for place type items -->
			<div
				v-for="index in 4"
				:key="index"
				class="skeleton-container flex items-center space-x-2 border rounded-md px-6 py-3"
			>
				<!-- Place type skeleton -->
				<div class="skeleton w-8 h-8 rounded-full"></div>
				<!-- Place type name skeleton -->
				<div class="skeleton w-20 h-12"></div>
			</div>
		</div>

		<!-- -------------------Add ad space list-------------------- -->
		<!-- ad-space-default -->
		<div class="">
			<div v-if="loading" class="grid grid-cols-2 gap-6">
				<div v-for="i in 4" class="rounded-lg border skeleton-container">
					<!-- Skeleton loader for the card body -->
					<div class="skeleton w-full h-32 rounded-t-lg"></div>

					<!-- Skeleton loader for the card body -->
					<div class="flex flex-col space-y-4 py-4 px-5">
						<!-- Place name and logo skeleton -->
						<div class="secondary-flex-row items-center space-x-4">
							<!-- Place logo skeleton -->
							<div class="skeleton w-8 h-8 rounded-full"></div>
							<!-- Place name skeleton -->
							<div class="skeleton w-1/2 h-6"></div>
						</div>
						<!-- Place type skeleton -->
						<div class="skeleton w-1/4 h-6"></div>
						<!-- Slogan title skeleton -->
						<div class="skeleton w-3/4 h-8"></div>
						<!-- Description skeleton -->
						<div class="skeleton w-full h-20"></div>
						<!-- Date skeleton -->
						<div class="primary-flex-row items-center space-x-2">
							<div class="skeleton w-6 h-6 rounded-full"></div>
							<div class="skeleton w-1/4 h-6"></div>
						</div>
					</div>

					<!-- Skeleton loader for the card footer -->
					<div class="grid grid-cols-2 px-10 py-4 gap-x-4 border-t">
						<!-- Edit button skeleton -->
						<div class="skeleton w-2/3 h-10"></div>
						<!-- Delete button skeleton -->
						<div class="skeleton w-2/3 h-10"></div>
					</div>
				</div>
			</div>

			<div v-else class="grid grid-cols-2 gap-6">
				<UiCardsReviewAdItem
					v-for="reviewAd in reviewAds"
					:key="reviewAd.id"
					:reviewAd="reviewAd"
				>
				</UiCardsReviewAdItem>
			</div>
			<p
				class="py-4 text-2xl font-medium"
				v-if="!loading && reviewAds.length == 0"
			>
				Zero Result
			</p>
		</div>
	</div>
</template>
