<script setup>
import inviteOwner from "@/graphql/mutations/invite-owner.gql";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { handleSubmit } = useForm();

const { notify } = useNotify();

const route = useRoute();
const router = useRouter();

const profilePic = ref("");
const input = ref({
	entity_id: parseInt(route.query.id),
});

const {
	mutate: addInviteMutate,
	onError: addInviteError,
	onDone: addInviteDone,
	loading: addInviteLoading,
} = authMutation(inviteOwner);

const onSubmit = handleSubmit(() => {
	addInviteMutate({
		...input.value,
		profile_picture: profilePic.value[0],
		redirect_uri: "example.com",
		invitation_uri: "example.com",
		role: "PLACE_ADMIN",
	});
});

const goToPlaceCreation = () => {
	router.push({
		path: "/app/places/register-new-place",
		query: {
			id: route.query.id,
		},
	});
};

addInviteDone(() => {
	openSuccess.value = true;
});
addInviteError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
	});
});

const prev = () => {
	router.push({
		path: route.path,
		query: {
			step: 1,
			id: route.query.id,
			name: route.query.name,
		},
	});
};

const openSuccess = ref(false);
</script>
<template>
	<Modals-Confirmation
		v-model="openSuccess"
		title="Entity Creation Successful"
		icon-class="self-center text-primary-600"
		sureQuestion="Do you want to continue to Place Creation?"
		confirm-button="Continue"
		@confirm="goToPlaceCreation"
	/>
	<div class="grid grid-cols-2 mt-12 gap-6">
		<HTextfield
			name="First Name"
			class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
			rules="required"
			placeholder="First Name"
			v-model="input.GivenName"
		>
			<template #label>
				<p class="mb-2 text-sheger-gray-100">First Name</p>
			</template>
		</HTextfield>
		<HTextfield
			name="Email"
			class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
			rules="required|email"
			placeholder="smbdy@example.com"
			v-model="input.email"
		>
			<template #label>
				<p class="mb-2 text-sheger-gray-100">Email</p>
			</template>
		</HTextfield>
		<HTextfield
			name="Middle Name"
			class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
			rules="required"
			placeholder="Middle Name"
			v-model="input.MiddleName"
		>
			<template #label>
				<p class="mb-2 text-sheger-gray-100">Middle Name</p>
			</template>
		</HTextfield>

		<HTextfield
			name="Phone Number"
			class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
			rules="required|phoneNumber"
			placeholder="Phone Number"
			v-model="input.phone_number"
		>
			<template #label>
				<p class="mb-2 text-sheger-gray-100">Phone Number</p>
			</template>
		</HTextfield>
		<HTextfield
			name="Last Name"
			class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
			rules="required"
			placeholder="Last Name"
			v-model="input.FamilyName"
		>
			<template #label>
				<p class="mb-2 text-sheger-gray-100">Last Name</p>
			</template>
		</HTextfield>
		<div>
			<p class="mb-2 text-sheger-gray-100">Profile Picture</p>
			<HFileUploadWrapper
				name="Profile Picture"
				:maxFileSize="1024 * 1024 * 10"
				:fileLimit="1"
				folder="applications_form"
				description="Profile Picture"
				placeholder="select Profile Picture"
				:disabled="false"
				:showStar="false"
				v-model="profilePic"
				:init="profilePic"
			/>
		</div>
	</div>
	<div class="flex items-center justify-between my-2">
		<button
			class="primary-button border disabled:opacity-50 disabled:cursor-not-allowed flex items-center !px-12 gap-4 text-white bg-primary-600"
			@click="prev"
		>
			<Icon name="material-symbols:arrow-back-ios" />
			Previous
		</button>
		<button
			type="button"
			class="primary-button border flex items-center !px-12 gap-4 text-white bg-primary-600"
			@click="onSubmit()"
		>
			{{ addInviteLoading ? "Submitting..." : "Next" }}
			<Icon name="material-symbols:arrow-forward-ios" />
		</button>
	</div>
</template>
