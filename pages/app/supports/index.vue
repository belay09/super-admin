<script setup>
import getSupportQuery from "@/graphql/query/supports/list.gql";
import { format, parseISO } from "date-fns";

const router = useRouter();
/***---------------------Tab--------------------- */

const tabs = ref([
	{
		name: "Pending",
		value: "Pending",
		length: 12,
	},
	{
		name: "Addressed",
		value: "Addressed",
		length: 5,
	},
]);

const filter = computed(() => {
	let query = {};
	query._and = [
		{
			isAddressed: {
				_eq:
					tabs.value[currentTabIndex.value].value == "Pending" ? false : true,
			},
		},
	];
	return query;
});
const currentTabIndex = ref(0);
const sort = ref([]);
const limit = ref(8);
const count = ref(0);
const pageTracker = ref(1);

const offset = computed(() => {
	return (pageTracker.value - 1) * limit.value;
});
const totalPage = computed(() => {
	return Math.ceil(count.value / limit.value);
});
/***-------------------------Compute offset------------------------- */

/*----------------------Fetch Support Data --------------------- */

const supportData = ref([]);

const { onResult, onError, loading, refetch } = authListQuery(
	getSupportQuery,
	filter,
	sort,
	offset,
	limit
);

onResult(({ data }) => {
	supportData.value = data.supports;
	tabs.value[0].length = data.pending?.aggregate?.count;
	tabs.value[1].length = data.addressed?.aggregate?.count;
	count.value = data.total?.aggregate?.count;
});

const headers = [
	{
		text: "Name",
		value: "name",
	},
	{
		text: "Message",
		value: "message",
	},

	{
		text: "Created at",
		value: "createdAt",
	},
];

const clickRow = (item) => {
	router.push("/app/supports/12");
};

definePageMeta({
	layout: "message",
});
</script>
<template>
	<div class="w-full">
		<!-- ----------------Tab------------------ -->
		<H-Tab v-model:currentTabIndex="currentTabIndex" :tabs="tabs">
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
		<div class="flex flex-col py-6 space-y-8">
			<div class="flex items-center justify-between">
				<p class="text-xl font-medium">
					Showing {{ totalPage > 0 ? pageTracker : 0 }} /{{ totalPage }}
				</p>
				<H-Page v-model="pageTracker" :totalPage="totalPage"></H-Page>
			</div>

			<div v-if="currentTabIndex === 1" class="flex gap-x-8">
				<span
					class="px-5 py-2 text-lg leading-5 text-center uppercase bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					spam
				</span>
				<span
					class="px-5 py-2 text-lg leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					BUSINESS
				</span>
				<span
					class="px-5 py-2 text-lg leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					INCORRECT ADDRESS
				</span>
			</div>
			<div class="">
				<h-table
					:headers="headers"
					:items="supportData"
					v-model:sort="sort"
					:loading="loading"
					@click:row="clickRow"
					supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
					supportHeaderClass="bg-gray-100 border"
					tableHeaderStyle="secondary-border  bg-gray-50"
					tableBodyRowStyle="border py-6 group hover:bg-primary-100"
					rowHeadStyle="secondary-text"
				>
					<template v-slot:name="{ item }">
						<div class="secondary-flex-row">
							<div>
								<img
									:src="item.user.photoUrl"
									alt="user image"
									class="w-10 h-10 rounded-full"
								/>
							</div>
							<div>
								<p>{{ item.user.fullName }}</p>
								<p class="secondary-text">selamudev@gmail.com</p>
							</div>
						</div>
					</template>

					<template v-slot:message="{ item }">
						<p class="font-bold">
							{{ item.message.substring(0, 60) + "..." }}
						</p>
					</template>

					<template v-slot:createdAt="{ item }">
						<div class="secondary-flex-row">
							<p class="block tertiary-text group-hover:hidden">
								{{ format(parseISO(item.createdAt), "dd MMM yyyy") }}
							</p>
							<div class="hidden group-hover:block">
								<Icon
									name="lucide:check-circle"
									class="text-2xl cursor-pointer"
								/>
							</div>
						</div>
					</template>
				</h-table>
			</div>

			<div class="mt-5">
				<HPaginate
					v-model:offset="offset"
					v-model="pageTracker"
					:items-per-page="limit"
					:total-data="count"
				/>
			</div>
		</div>
	</div>
</template>
