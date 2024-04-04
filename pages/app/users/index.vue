<script setup>
/**-----------------------------------imports----------------------------- */
import userStatusAggregateQuery from "@/graphql/query/aggregate/user-status-aggregate.gql";
import userListQuery from "@/graphql/query/users/list.gql";
import useNotify from "@/use/notify";

/*----------------------------Global Variables---------------------------*/
const { notify } = useNotify();

/***---------------------Tab--------------------- */
const tabs = ref([
	{
		name: "Active",
		value: "ACTIVE",
		length: 0,
	},
	{
		name: "Suspended",
		value: "SUSPENDED",
		length: 0,
	},
	{
		name: "Deleted",
		value: "DELETED",
		length: 0,
	},
]);
const currentTabIndex = ref(0);

/*...................Aggregate data fetch.............*/

const {
	onResult: aggregateOnResult,
	onError: aggregateOnError,
	loading: aggregateLoading,
	refetch: aggregateReFetch,
} = authListQuery(userStatusAggregateQuery, {}, [{}], 0, 0);

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

/***---------------------Users data fetch--------------------- */
const userSortItems = ref([
	{
		name: "Name",
		levels: ["fullName"],
	},

	{
		name: "Email",
		levels: ["email"],
	},
	{
		name: "Phone Number",
		levels: ["phoneNumber"],
	},

	{
		name: "Created At",
		levels: ["createdAt"],
	},
]);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const users = ref([]);
const limit = ref(14);
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

/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
	let query = {};
	query._and = [
		{
			status: {
				_eq: tabs.value[currentTabIndex.value].value,
			},
		},
		{
			_or: [
				{
					fullName: {
						_ilike: `%${search.value}%`,
					},
				},
				{
					email: {
						_ilike: `%${search.value}%`,
					},
				},
				{
					phoneNumber: {
						_ilike: `%${search.value}%`,
					},
				},
			],
		},
	];

	return query;
});

// TODO order by

const {
	onResult: usersResult,
	onError: usersError,
	loading: usersLoading,
	refetch,
} = authListQuery(userListQuery, filter, sort, offset, limit);

usersResult((result) => {
	if (result.data?.usersUsers) {
		users.value = result.data.usersUsers;
		length.value = result.data.usersUsersAggregate?.aggregate?.count;
	}
});
usersError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

function refetchAggregatedAndUsers() {
	aggregateReFetch();
	refetch();
}

definePageMeta({
	layout: "configuration",
});
</script>

<template>
	<div class="w-full py-6 pl-10 pr-16">
		<!-- ---------search and filter--------- -->
		<div class="relative">
			<div class="absolute right-0 flex">
				<div class="secondary-flex-row">
					<H-Textfield
						name="search"
						type="text"
						placeholder="Search here"
						trailing-icon="uil:search"
						v-model="search"
					></H-Textfield>
					<!------------------------- sort -------------------------->
					<H-Sort
						v-model:selected="selectedSort"
						v-model="sort"
						:items="userSortItems"
					></H-Sort>
				</div>
			</div>
		</div>

		<!-- ----------------Tab------------------ -->
		<div class="pt-10"></div>

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

			<template #ACTIVE>
				<div>
					<Users-List
						:loading="usersLoading"
						:users="users"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
						@edit="refetchAggregatedAndUsers"
					></Users-List>
					<div class="mt-5">
						<HPaginate
							v-model:offset="offset"
							:items-per-page="limit"
							:total-data="length"
							v-model="pageTracker"
						/>
					</div>
				</div>
			</template>
			<template #SUSPENDED>
				<div>
					<Users-List
						:loading="usersLoading"
						:users="users"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
						@edit="refetchAggregatedAndUsers"
					></Users-List>
					<div class="mt-5">
						<HPaginate
							v-model:offset="offset"
							:items-per-page="limit"
							:total-data="length"
							v-model="pageTracker"
						/>
					</div>
				</div>
			</template>
			<template #DELETED>
				<div>
					<Users-List
						:loading="usersLoading"
						:users="users"
						:total-page="totalPage"
						v-model:model-value="pageTracker"
						@edit="refetchAggregatedAndUsers"
					></Users-List>
					<div class="mt-5">
						<HPaginate
							v-model:offset="offset"
							:items-per-page="limit"
							:total-data="length"
							v-model="pageTracker"
						/>
					</div>
				</div>
			</template>
		</H-Tab>
	</div>
</template>
