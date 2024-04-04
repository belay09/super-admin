<script setup>
import { format, parseISO } from "date-fns";
import getContactUsQuery from "@/graphql/query/contact-us/item.gql";
import editContactUsMutation from "@/graphql/mutations/contact-us/edit.gql";
import deleteContactUsMutation from "@/graphql/mutations/contact-us/delete.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();
const route = useRoute();
const router = useRouter();

/**------------------------Get Support Data----------------------- */
const contactUs = ref();
const {
	onResult: contactUsOnResult,
	onError: contactUsOnError,
	loading: contactUsLoading,
	refetch: contactUsRefetch,
} = authItemQuery(getContactUsQuery, route.params.id);

contactUsOnResult(({ data }) => {
	contactUs.value = data.contactUsByPk;
});

/*--------------------------------- mark as addressed------------------------- */
const selectedMarkAsAddressed = ref(null);

const mark = (selectedMark) => {
	selectedMarkAsAddressed.value = selectedMark;
};

const {
	mutate: markAsAddressed,
	onError: markAsAddressedError,
	onDone: markAsAddressedDone,
	loading: markAsAddressedLoading,
} = authMutation(editContactUsMutation);

const onSubmit = () => {
	markAsAddressed({
		id: route.params.id,
		input: {
			messageLabel: selectedMarkAsAddressed.value,
			isAddressed: true,
		},
	});
};

markAsAddressedDone(() => {
	openMarkAsAddressedModal.value = false;
	notify({
		title: "Marked as Addressed",
		description: "the message has been marked as addressed",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});
});

markAsAddressedError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

/**------------------------Delete Support----------------------- */
const {
	mutate: deletecontactUs,
	onError: deletecontactUsError,
	onDone: deletecontactUsDone,
	loading: deletecontactUsLoading,
} = authMutation(deleteContactUsMutation);

const onDeletecontactUs = () => {
	deletecontactUs({
		id: route.params.id,
	});
};

deletecontactUsDone(() => {
	notify({
		title: "contactUs Deleted",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});
	router.push("/app/contact_us");
});

deletecontactUsError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

const openMarkAsAddressedModal = ref(false);
const openDeleteConfirmModal = ref(false);
definePageMeta({
	layout: "engagement",
});
</script>

<template>
	<ModalsConfirmation
		@confirm="onDeletecontactUs()"
		v-model="openDeleteConfirmModal"
		title="Delete contact us Message"
		sure-question="Are you sure you want to delete this contact us?"
		description="Deleting the message will permanently remove it from our system, and the message will be irretrievable. Please confirm your decision, as this action cannot be undone."
	></ModalsConfirmation>
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
	<div class="px-12 py-6">
		<div
			class="flex items-center justify-between pb-6 border-b-2 border-sheger-gray-300"
		>
			<div
				@click="router.back()"
				class="py-4 secondary-flex-row text-sheger-gray-100 hover:cursor-pointer"
			>
				<Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
				<p class="text-2xl font-semibold capitalize">
					<!-- {{ support.subject.replace(/_/g, " ") }} -->
				</p>
			</div>
			<div class="flex items-center space-x-6">
				<button
					@click="openMarkAsAddressedModal = true"
					class="block primary-button bg-primary-600"
				>
					<Icon
						name="mingcute:user-add-line"
						class="text-xl text-white"
						color=""
					/>
					<span class="text-white">Mark as Addressed</span>
				</button>

				<NuxtLink
					class="block primary-button secondary-border"
					@click.stop
					:to="`mailto:${contactUs.email}`"
				>
					<Icon class="text-2xl cursor-pointer" name="material-symbols:reply" />
					<span class="">Reply</span>
				</NuxtLink>

				<button
					@click="openDeleteConfirmModal = true"
					class="block primary-button secondary-border"
				>
					<Icon name="mingcute:user-add-line" class="text-xl" color="" />
					<span class="">Delete</span>
				</button>
			</div>
		</div>

		<!-- ---------------------------Name-------------------------- -->
		<div class="flex items-center justify-between py-6">
			<!-- -----------------Profile Picture----------------- -->
			<div class="secondary-flex-row">
				<!-- <div>
					<img
						:src="support.user.photoUrl"
						alt="user image"
						class="w-10 h-10 rounded-full"
					/>
				</div> -->
				<div>
					<p>{{ contactUs.fullName }}</p>
					<p class="secondary-text">{{ contactUs.email }}</p>
				</div>
			</div>
			<!-- -------------------Time----------------------- -->
			<p class="secondary-text">
				{{ format(parseISO(contactUs.createdAt), "dd MMM yyyy") }}
			</p>
		</div>

		<!-- -------------------------Body------------------------ -->
		<div
			v-html="contactUs.message"
			class="flex flex-col w-9/12 space-y-6"
		></div>
	</div>
</template>
