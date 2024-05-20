<script setup>
import getEntities from "@/graphql/query/entity/list.gql";

const tabs = ref([
	{
		name: "All",
		value: "ALL",
		length: 0,
	},

	{
		name: "Active",
		value: "ACTIVE",
		length: 0,
	},
	{
		name: "Pending",
		value: "PENDING",
		length: 0,
	},

	{
		name: "Closed",
		value: "CLOSED",
		length: 0,
	},
]);

const currentTabIndex = ref(0);
const entities = ref([]);

const search = ref("");

const filter = computed(() => {
	let query = {};
	query._and = [
		{
			organizationLegalName: {
				_ilike: `%${search.value}%`,
			},
		},
	];

	if (currentTabIndex.value != 0) {
		query._and.push({
			status: {
				_eq: tabs.value[currentTabIndex.value].value,
			},
		});
	}

	return query;
});
const offset = ref(0);
const limit = ref(6);
const totalData = ref(0);

const { loading, onError, onResult, refetch } = authFetch(getEntities, {
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
	filter: filter,
	offset: offset,
	limit: limit,
});

onResult((result) => {
	entities.value = result.data.entity;
	totalData.value = result.data.total.aggregate.count;

	tabs.value[0].length = result.data.all.aggregate.count;
	tabs.value[1].length = result.data.active.aggregate.count;
	tabs.value[2].length = result.data.pending.aggregate.count;
	tabs.value[3].length = result.data.closed.aggregate.count;
});

definePageMeta({
	layout: "engagement",
});
</script>

<template>
	<div class="relative mt-4">
		<H-Tab :tabs="tabs" v-model:current-tab-index="currentTabIndex">
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
		</H-Tab>
		<div class="absolute flex items-center gap-x-6 right-0 -top-6">
			<H-Textfield
				v-model="search"
				name="search"
				type="text"
				placeholder="Search here"
				trailing-icon="uil:search"
			></H-Textfield>
			<button
				class="primary-button bg-primary-600 text-white"
				@click="$router.push('/app/entity/add')"
			>
				Add Entity
			</button>
		</div>
	</div>
	<div v-if="!loading" class="mt-6 grid grid-cols-3 gap-4">
		<UiCardsEntity
			:entity="entity"
			v-for="entity in entities"
			:key="entity.id"
		/>
	</div>
	<div v-else class="mt-6 grid grid-cols-3 gap-4">
		<SkeletonLoaderEntity v-for="i in 6" :key="i" />
	</div>

	<HPaginate
		:items-per-page="limit"
		v-model:offset="offset"
		:total-data="totalData"
		class="w-full pt-16"
	></HPaginate>
</template>
