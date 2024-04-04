<script setup>
import getSupportQuery from "@/graphql/query/supports/list.gql";
import editSupportMutation from "@/graphql/mutations/supports/edit.gql";
import { format, parseISO } from "date-fns";
import useNotify from "@/use/notify";

const router = useRouter();
const { notify } = useNotify();

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

const messageLabel = ref("");

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

	if (messageLabel.value) {
		query._and.push({
			messageLabel: {
				_eq: messageLabel.value,
			},
		});
	}
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

/*--------------------------------- mark as addressed------------------------- */
const selectedMarkAsAddressed = ref(null);
const selectedSupportId = ref();

const {
	mutate: markAsAddressed,
	onError: markAsAddressedError,
	onDone: markAsAddressedDone,
	loading: markAsAddressedLoading,
} = authMutation(editSupportMutation);

const onSubmit = () => {
	markAsAddressed({
		id: selectedSupportId.value,
		input: {
			messageLabel: selectedMarkAsAddressed.value,
			isAddressed: true,
		},
	});
};

markAsAddressedDone(() => {
	openMarkAsAddressedModal.value = false;
	notify({
		title: "updated successfully",
		description: "Support has been updated successfully.",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});
	refetch();
});

markAsAddressedError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

const clickRow = (item) => {
	router.push(`/app/supports/${item.id}`);
};

const openMarkAsAddressedModal = ref(false);

definePageMeta({
	layout: "message",
});
</script>
<template>
	<ModalsModal
		body-class="!w-[600px]"
		hasCloseIcon
		v-model="openMarkAsAddressedModal"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<div class="flex gap-x-4">
					<Icon name="lucide:check-circle" class="text-2xl cursor-pointer" />
					<span> Mark as Addressed </span>
				</div>
				<Icon
					@click="openMarkAsAddressedModal = false"
					name="gravity-ui:xmark"
					class="text-2xl cursor-pointer"
				/>
			</div>
		</template>
		<template #content>
			<div class="mt-6 space-y-6">
				<div class="flex flex-wrap gap-4">
					<span
						class="px-5 py-2 leading-5 text-center uppercase bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
						:class="selectedMarkAsAddressed === 'spam' ? '!bg-primary-100' : ''"
						@click="selectedMarkAsAddressed = 'spam'"
					>
						Spam
					</span>
					<span
						:class="
							selectedMarkAsAddressed === 'business' ? '!bg-primary-100' : ''
						"
						class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
						@click="selectedMarkAsAddressed = 'business'"
					>
						Business
					</span>
					<span
						:class="selectedMarkAsAddressed === 'scam' ? '!bg-primary-100' : ''"
						class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
						@click="selectedMarkAsAddressed = 'scam'"
					>
						Scam
					</span>
					<span
						:class="
							selectedMarkAsAddressed === 'irrelevant' ? '!bg-primary-100' : ''
						"
						class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
						@click="selectedMarkAsAddressed = 'irrelevant'"
					>
						Irrelevant
					</span>
					<span
						:class="
							selectedMarkAsAddressed === 'wrong_subject'
								? '!bg-primary-100'
								: ''
						"
						@click="selectedMarkAsAddressed = 'wrong_subject'"
						class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
					>
						Wrong Subject
					</span>
					<span
						:class="
							selectedMarkAsAddressed === 'wrong_message'
								? '!bg-primary-100'
								: ''
						"
						@click="selectedMarkAsAddressed = 'wrong_message'"
						class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
					>
						Wrong Message
					</span>
				</div>
				<button
					@click="onSubmit"
					type="button"
					class="w-full text-white primary-button bg-primary-600"
				>
					<span v-if="!markAsAddressedLoading"> Submit </span>
					<Icon v-else name="eos-icons:bubble-loading" />
				</button>
			</div>
		</template>
	</ModalsModal>

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
					:class="messageLabel === '' ? '!bg-primary-100' : ''"
					@click="messageLabel = ''"
					class="px-5 py-2 leading-5 text-center uppercase bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					All
				</span>
				<span
					:class="messageLabel === 'spam' ? '!bg-primary-100' : ''"
					@click="messageLabel = 'spam'"
					class="px-5 py-2 leading-5 text-center uppercase bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					Spam
				</span>
				<span
					:class="messageLabel === 'business' ? '!bg-primary-100' : ''"
					@click="messageLabel = 'business'"
					class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					Business
				</span>
				<span
					:class="messageLabel === 'scam' ? '!bg-primary-100' : ''"
					@click="messageLabel = 'scam'"
					class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					Scam
				</span>
				<span
					:class="messageLabel === 'irrelevant' ? '!bg-primary-100' : ''"
					@click="messageLabel = 'irrelevant'"
					class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					Irrelevant
				</span>
				<span
					:class="messageLabel === 'wrong_subject' ? '!bg-primary-100' : ''"
					@click="messageLabel = 'wrong_subject'"
					class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					Wrong Subject
				</span>
				<span
					:class="messageLabel === 'wrong_message' ? '!bg-primary-100' : ''"
					@click="messageLabel = 'wrong_message'"
					class="px-5 py-2 leading-5 text-center capitalize bg-gray-100 rounded-md shadow-sm cursor-pointer text-sheger-gray-900"
				>
					Wrong Message
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
						<div class="flex items-center gap-x-4">
							<p class="font-bold">
								{{ item.message.substring(0, 60) + "..." }}
							</p>
							<span
								class="px-1 py-1 font-medium text-blue-600 lowercase bg-blue-100 rounded-lg"
							>
								{{ item.supportType.replace(/_/g, " ") }}</span
							>
						</div>
					</template>

					<template v-slot:createdAt="{ item }">
						<div class="secondary-flex-row">
							<p class="block tertiary-text group-hover:hidden">
								{{ format(parseISO(item.createdAt), "dd MMM yyyy") }}
							</p>
							<div class="items-center hidden space-x-6 group-hover:flex">
								<NuxtLink @click.stop :to="`mailto:${item.user.email}`">
									<Icon
										class="text-2xl cursor-pointer"
										name="material-symbols:reply"
									/>
								</NuxtLink>
								<div class="w-[1px] h-[20px] border"></div>
								<Icon
									@click.stop="
										[
											(openMarkAsAddressedModal = true),
											(selectedSupportId = item.id),
										]
									"
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
