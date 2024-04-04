<script setup>
import { format, parseISO } from "date-fns";

import {
	Dialog,
	DialogPanel,
	Menu,
	MenuButton,
	MenuItem,
	MenuItems,
	TransitionChild,
	TransitionRoot,
} from "@headlessui/vue";

import getPlacesQuery from "@/graphql/query/places/getPlacesMini.gql";

const router = useRouter();

const headers = [
	{
		text: "Place Name",
		value: "name",
	},

	{
		text: "Email",
		value: "email",
	},
	{
		text: "Phone",
		value: "phone_no",
	},
	{
		text: "tin",
		value: "tinNumber",
	},
	{
		text: "current plan",
		value: "currentPlan",
	},
	{
		text: "created at",
		value: "createdAt",
	},

	{
		text: "Action",
		value: "action",
	},
];

const selectedPlace = ref({});
/***--------------------------Table data------------------- */
const searchTerm = ref("");

const places = ref();

const filter = computed(() => {
	let query = {};
	query._and = [
		{
			name: {
				_ilike: `%${searchTerm.value}%`,
			},
		},
	];
	return query;
});

const sort = ref([]);
const offset = ref(0);
const limit = ref(9);
const totalData = ref(0);

const {
	onResult: placeOnResult,
	onError: placeOnError,
	loading: placeLoading,
	refetch: placeReFetch,
} = authListQuery(getPlacesQuery, filter, [], offset, limit);

placeOnResult((result) => {
	if (result.data?.places) {
		places.value = result.data?.places;
		totalData.value = result.data?.total.aggregate.count;
	}
});

const openCreatePaymentModal = ref(false);

definePageMeta({
	layout: "billing",
});
</script>

<template>
	<ModalsCreatePayment
		:place="selectedPlace"
		v-model="openCreatePaymentModal"
	/>
	<div class="w-full space-y-4">
		<!-- ---------search and filter--------- -->

		<div class="flex items-center gap-x-4">
			<H-Textfield
				name="search"
				type="text"
				placeholder="Search Place"
				leading-icon="uil:search"
				leading-icon-container-class="border-none"
				v-model="searchTerm"
			></H-Textfield>
		</div>

		<!-- ----------------Table------------------ -->

		<div class="relative flex flex-col">
			<h-table
				:headers="headers"
				:items="places"
				v-model:sort="sort"
				:loading="placeLoading"
				supporterClass=" overflow-x-auto overflow-y-hidden pb-12 rounded-md border border-gray-200"
				supportHeaderClass="bg-gray-100 border"
				tableHeaderStyle="secondary-border  bg-gray-50"
				tableBodyRowStyle="border py-6"
				rowHeadStyle="secondary-text"
				row-style="lg:text-sheger-gray-400 hover:bg-primary-50/60"
			>
				<template #action="{ item }">
					<button
						@click="[(selectedPlace = item), (openCreatePaymentModal = true)]"
						type="button"
						class="flex items-center px-2 py-1 text-sm border rounded-md w-fit text-primary-600 bg-primary-50 border-primary-400 group gap-x-2"
					>
						<Icon name="iconamoon:invoice" width="17" height="17" />
						<span class="whitespace-nowrap"> Create</span>
					</button>
				</template>

				<template #currentPlan="{ item }">
					<div>
						<p class="font-medium" v-if="item.plans.length">
							{{ item?.plans[0]?.frequency?.plan?.title }}
						</p>
						<p v-else class="font-medium text-yellow-600">
							No Subscription Yet
						</p>
					</div>
				</template>

				<template #createdAt="{ item }">
					<div>
						{{ format(parseISO(item.createdAt), "MMM dd, yyyy") }}
					</div>
				</template>
			</h-table>

			<div class="mt-5">
				<HPaginate
					v-model:offset="offset"
					:items-per-page="limit"
					:total-data="totalData"
				/>
			</div>
		</div>
	</div>
</template>
