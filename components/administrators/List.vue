<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import admin from "@/graphql/query/admin/query.gql";
import list from "@/composables/auth-list-query.js";
import { format, parseISO } from "date-fns";
import mutator from "@/composables/auth-mutation";
import invited from "@/graphql/mutations/admin/invite.gql";
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth.js";
import revokeMutate from "@/graphql/mutations/admin/revoke.gql";
import reactivateMutate from "@/graphql/mutations/admin/reactivate.gql";
import deleteMutate from "@/graphql/mutations/admin/delete.gql";
const config = useRuntimeConfig()

const authStore = useAuthStore();
const { notify } = useNotify();
const { handleSubmit, resetForm } = useForm({});

const formattedCreatedAt = ref("");
const count = ref(0);
const revoke = ref(false);
const img=ref()
const reactivate = ref(false);
const delet = ref(false);
const add = ref(false);
const item = ref({});
const email = ref("");
const selectedItemId = ref(null);
const base64File = ref(null);
const selectItems = [
	{ id: 1, name: "Administrator" },
	{ id: 2, name: "Data Encoder" },
	// Add more items as needed
];
const loading = ref(true);
const people = ref([]);
const router = useRouter();
// if (!authStore.place_hasura_access_token) {
//   router.push('/')
// }
const limit = ref(7);
const page = ref(1);
const offset = computed(() => {
	return (page.value - 1) * limit.value;
});
const filter = computed(() => {
	return {
		userRoles: {
			_or: [
				{ userRole: { value: { _eq: "SHEGERADMIN" } } },
				{ userRole: { value: { _eq: "ENCODER" } } },
			],
		},
		status: { _neq: "DELETED" },
	};
});
const {
	onResult: adminDone,
	onError: adminERR,
	refetch,
	loading: adminFetchLoading,
} = list(admin, filter, ref([]), offset, limit);

adminDone((result) => {
	// selectTags.value=result.data.basicsTags;
	people.value = result?.data?.usersUsers;
	count.value = result?.data?.usersUsersAggregate.aggregate.count;
	loading.value = false;
});

const toggleAdd = () => {
	add.value = true; // Toggle the boolean value
};
const toggleRevoke = (data) => {
	console.log("revoke email", data);
	email.value = data;
	revoke.value = true; // Toggle the boolean value
};
const toggleReactivate = (data) => {
	email.value = data;
	console.log("ractivate email", email.value);
	reactivate.value = true; // Toggle the boolean value
};
const toggleDelete = (data) => {
	email.value = data;
	console.log("delete email", email.value);
	delet.value = true; // Toggle the boolean value
};

const {
	mutate: invite,
	onError: onErrorADmin,
	onDone: inviteDone,
	loading: onLoading,
} = mutator(invited, "");
inviteDone((result) => {
	resetForm();
	notify({
		title: "Invite Successfully Sent",
		description: "check your email",
		borderClass: "border-l-8 border-green-800",
	});

	add.value = false;
});
onErrorADmin((error) => {
	let customDescription = "Something went wrong.";

	// Check if the error message indicates duplicate emails
	if (error.message.includes("all emails already exist")) {
		customDescription = "Email already exists. Please use a different email.";
	}
	if (error.message.includes("user with given phone number already exists")) {
		customDescription = "phone already exists. Please use a different phone.";
	}
	notify({
		title: "Error",
		description: customDescription,
		type: "error",
		borderClass: "border-l-8 border-red-300",
		cardClass: "bg-white",
	});
});

function updateName(selectedItemId) {
	const selectedItem = selectItems.find((item) => item.id === selectedItemId);

	if (selectedItem) {
		if (selectedItem.name === "Administrator") {
			return "SHEGERADMIN";
		} else if (selectedItem.name === "Data Encoder") {
			return "ENCODER";
		}
	}
	return null; // Return null if the item is not found or doesn't match any condition
}
const finish = handleSubmit(() => {
	const updatedRoleName = updateName(selectedItemId.value);
	if (updatedRoleName) {
		// Use the updated role name in the invite function
		invite({
			GivenName: item.value.name,
			MiddleName: item.value.lastname,
			family_name: item.value.family,
			email: item.value.email, 
			invitation_uri:config.public.REDIRECT_URI+ "/password",
			redirect_uri:config.public.REDIRECT_URI ,
			phone_number: "+251" + item.value.phone,
			role: updatedRoleName,
			place_id: people.value[0].placeId,
			profile_picture: img.value,
			

		});

		// Log the updated array for verification
		console.log(selectItems);
	} else {
		console.error("Invalid selectedItemId:", selectedItemId);
	}
});
const {
	mutate: revokee,
	onError: revokeonError,
	onDone: revokeDone,
	loading: revokeLoading,
} = mutator(revokeMutate, "");
revokeDone((result) => {
	notify({
		title: "Successfully revoked",
		description:
			result.data.updateUsersUsers.returning[0].fullName +
			" Can not Login Again",
		borderClass: "border-l-8 border-green-800",
	});
	refetch();
	revoke.value = false;
});
revokeonError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-800",
	});
});
const Revoke = () => {
	revokee({
		_eq: email.value,
	});
};

const {
	mutate: reactivatee,
	onError: reactivateonError,
	onDone: reactivateDone,
} = mutator(reactivateMutate, "");
reactivateDone((result) => {
	notify({
		title: "Successfully Reactivate",
		description:
			result.data.updateUsersUsers.returning[0].fullName + " Can Login Again",

		borderClass: "border-l-8 border-green-800",
	});
	refetch();
	reactivate.value = false;
});
reactivateonError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-600",
	});
});
const ReactivateFunction = () => {
	reactivatee({
		_eq: email.value,
	});
};
const {
	mutate: Delete,
	onError: DeleteonError,
	onDone: DeleteDone,
} = mutator(deleteMutate, "");
DeleteDone((result) => {
	notify({
		title: "Successfully deleted",
		description:
			result.data.updateUsersUsers.returning[0].fullName + " IS Deleted ",

		borderClass: "border-l-8 border-green-800",
	});
	refetch();
	delet.value = false;
});
DeleteonError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		cardClass: "bg-red-200",
	});
});
const DeleteFunction = () => {
	Delete({
		_eq: email.value,
	});
};

// Function to determine user status based on priority
const determineUserStatus = (userRoles) => {
	if (userRoles.some((role) => role.userRole.value === "SHEGERADMIN")) {
		return "Sheger Admin";
	} else if (userRoles.some((role) => role.userRole.value === "encoder")) {
		return "Encoder";
	} else {
		return "User";
	}
};

const validationError = "";
watch(item.value, () => {
	validatePhone();
});
const validatePhone = () => {
	console.log("Validation");
	const phoneRegex = /^\d{10}$/; // Assuming a 10-digit phone number for validation
	if (!phoneRegex.test(item.phone)) {
		validationError = "Please enter a valid 10-digit phone number.";
	} else {
		validationError = "";
	}
};

const headers = ref([
	{
		text: "#",
		value: "profile",
	},
	{
		text: "Full Name",
		value: "fullName",
	},
	{
		text: "Phone Number",
		value: "phoneNumber",
	},
	{
		text: "Role",
		value: "role",
	},
	{
		text: "Status",
		value: "status",
	},
	{
		text: "Created At",
		value: "createdAt",
	},
	{
		text: "Action",
		value: "action",
	},
]);
</script>
<template>
	<div v-if="!loading" class="h-full">
		<div class="flex justify-between">
			<h1 class="text-2xl capitalize font-inter">{{ count }} Administrators</h1>
			<div class="flex items-center">
				<button
					@click="toggleAdd"
					class="px-4 py-2 font-bold text-white rounded bg-primary-600 hover:bg-red-700"
				>
					<Icon
						name="uiw:user-add"
						color="white"
						width="20"
						height="20"
						class="self-center mr-2 font-inter"
					></Icon>
					Add Administrator
				</button>
			</div>
		</div>
		<div class="h-5/6">
			<div class="flow-root h-full mt-8">
				<div class="h-full">
					<div class="inline-block min-w-full py-2 align-middle">
						<H-Table
							:headers="headers"
							row-style="border-t border-gray-200 !py-2"
							:items="people"
							:loading="adminFetchLoading"
							row-head-style="bg-gray-200"
							supporter-class="border border-gray-200 rounded-md"
						>
							<template #profile="{ item }">
								<div class="flex-shrink-0 h-7 w-7">
									<img
										class="ml-2 rounded-full h-7 w-7"
										:src="
											item.photoUrl || '/images/temporary/default-profile.png'
										"
										alt=""
									/>
								</div>
							</template>
							<template #fullName="{ item }">
								<p class="capitalize">{{ item.fullName }}</p>
								<p class="text-gray-500 mt-1.5 font-light">
									{{ item.email }}
								</p>
							</template>
							<template #role="{ item }">
								<p class="px-3 py-5 text-sm capitalize whitespace-nowrap">
									{{ determineUserStatus(item.userRoles) }}
								</p>
							</template>
							<template #status="{ item }">
								<p class="px-3 py-5 text-sm whitespace-nowrap">
									<span
										:style="{
											color: item.status === 'ACTIVE' ? 'green' : 'red',
										}"
									>
										{{ item.status === "ACTIVE" ? "Active" : "Revoked" }}
									</span>
								</p>
							</template>
							<template #createdAt="{ item }">
								<td class="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
									{{ format(parseISO(item.createdAt), "dd/MM/yyyy") }}
								</td>
							</template>
							<template #action="{ item }">
								<div
									class="relative py-5 pl-6 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0"
								>
									<Menu as="div" class="relative">
										<MenuButton class="-m-4 flex items-center p-1.5">
											<span class="sr-only">Open user menu</span>

											<div
												class="flex items-center px-1 py-1 align-center lg:pl-3 lg:pr-5 md:px-1 sm:px-1 rounded-3xl"
											>
												<Icon
													name="charm:menu-kebab"
													color="black"
													width="20"
													height="20"
												></Icon>
											</div>
										</MenuButton>
										<transition
											enter-active-class="transition duration-100 ease-out"
											enter-from-class="transform scale-95 opacity-0"
											enter-to-class="transform scale-100 opacity-100"
											leave-active-class="transition duration-75 ease-in"
											leave-from-class="transform scale-100 opacity-100"
											leave-to-class="transform scale-95 opacity-0"
										>
											<MenuItems
												class="absolute right-0 z-50 mt-2.5 w-44 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
											>
												<MenuItem
													v-slot="{ active }"
													:disabled="item.status === 'ACTIVE'"
												>
													<button
														:disabled="item.status === 'ACTIVE'"
														@click="toggleReactivate(item.id)"
														:class="[
															active
																? 'bg-primary-100 text-black'
																: 'text-gray-900',
															item.status === 'ACTIVE'
																? 'cursor-not-allowed'
																: 'cursor-pointer',
															'group flex w-full items-center rounded-md px-2 py-2 text-sm',
														]"
													>
														<Icon
															name="bx:lock-open-alt"
															color="black"
															width="20"
															height="20"
														></Icon>

														<h1 class="ml-3">Reactivate access</h1>
													</button>
												</MenuItem>
												<MenuItem
													v-slot="{ active }"
													:disabled="item.status === 'SUSPENDED'"
												>
													<button
														@click="toggleRevoke(item.id)"
														:disabled="item.status === 'SUSPENDED'"
														:class="[
															active
																? 'bg-primary-50 text-black'
																: 'text-gray-900',
															item.status === 'SUSPENDED'
																? 'cursor-not-allowed'
																: 'cursor-pointer',
															'group flex w-full items-center rounded-md px-2 py-2 text-sm',
														]"
													>
														<Icon
															name="uil:lock"
															color="black"
															width="20"
															height="20"
														></Icon>

														<h1 class="ml-3">Revoke access</h1>
													</button>
												</MenuItem>
												<MenuItem v-slot="{ active }">
													<button
														@click="toggleDelete(item.id)"
														:class="[
															active
																? 'bg-primary-50 text-black'
																: 'text-gray-900',
															'group flex w-full items-center rounded-md px-2 py-2 text-sm',
														]"
													>
														<Icon
															name="uil:lock"
															color="black"
															width="20"
															height="20"
														></Icon>

														<h1 class="ml-3">Delete Admin</h1>
													</button>
												</MenuItem>
											</MenuItems>
										</transition>
									</Menu>
								</div>
							</template>
						</H-Table>
					</div>
				</div>
				<H-Paginate
					class="sticky bottom-0 left-0 bg-white"
					v-model="page"
					:total-data="count"
					:items-per-page="limit"
				/>
			</div>
		</div>
	</div>

	<!-- Revoke Confirmation Modal -->
	<Modals-Confirmation
		v-model="revoke"
		title="Revoke Access"
		icon="uil:lock"
		icon-class="self-center text-primary-600"
		sureQuestion="Are you sure you want to revoke access?"
		confirm-button="Revoke"
		description="Revoking access to the user will result on the user unable to
  login,update menu and change the place profile"
		@confirm="Revoke"
	/>

	<!-- Reactivation Confirmation Modal -->
	<Modals-Confirmation
		v-model="reactivate"
		title="Reactivate Access"
		icon="bx:lock-open-alt"
		icon-class="self-center text-primary-600"
		sureQuestion="Are you sure you want to reactivate access?"
		confirm-button="Reactivate"
		description="Reactivating access to the user will result on the user able to login, update menu and change the place profile."
		@confirm="ReactivateFunction"
	/>

	<!-- Deletion Confirmation Modal -->
	<Modals-Confirmation
		v-model="delet"
		title="Delete Administrator"
		icon="bx:lock-open-alt"
		icon-class="self-center text-primary-600"
		sureQuestion="Are you sure you want to delete administrator?"
		confirm-button="Delete"
		description="Deleting the user will result on the user unable to login,update menu
    and change the place profile and vanish for ever."
		@confirm="DeleteFunction"
	/>

	<ModalsMod
		v-if="add"
		:modelValue="add"
		v-slot:ModalContent
		v-bind:wrapper-class="'relative transform rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[35vw] sm:p-0'"
	>
		<form action="" @submit.prevent="finish">
			<div class="mx-8 my-4 col-span-full">
				<div class="flex justify-between mb-3">
					<h1 class="text-xl text-black capitalize font-poppins font-inter">
						Invite Administrators
					</h1>
					<button type="button" @click="add = false">
						<Icon
							name="ph:x"
							color="black"
							width="20"
							height="20"
							class="self-center"
						></Icon>
					</button>
				</div>
				<UploadProfileUpload v-model="img" />


				<div class="my-2 col-span-full">
					<HTextfield
						rules="required"
						name="first"
						v-model="item.name"
						:mainDiv="'my-2'"
					>
						<template #label>
							<h1
								class="text-base font-poppins font-normal text-[#524848] capitalize"
							>
								First name
							</h1>
						</template>
					</HTextfield>
				</div>
				<div class="my-2 col-span-full">
					<HTextfield
						rules="required"
						name="middle"
						v-model="item.lastname"
						:mainDiv="'my-2'"
					>
						<template #label>
							<h1
								class="text-base font-poppins font-normal text-[#524848] capitalize"
							>
								Middle name
							</h1>
						</template>
					</HTextfield>
				</div>
				<div class="my-2 col-span-full">
					<HTextfield
						rules="required"
						name="family"
						v-model="item.family"
						:mainDiv="'my-2'"
					>
						<template #label>
							<h1
								class="text-base font-poppins font-normal text-[#524848] capitalize"
							>
								last name
							</h1>
						</template>
					</HTextfield>
				</div>

				<div class="my-2 col-span-full">
					<HTextfield
						rules="required|email"
						name="email"
						v-model="item.email"
						:mainDiv="'my-2'"
					>
						<template #label>
							<h1
								class="text-base font-poppins font-normal text-[#524848] capitalize"
							>
								Email Address
							</h1>
						</template>
					</HTextfield>
				</div>
				<HTextfield
					v-model="item.phone"
					class="my-2 col-span-full"
					name="Phone Number"
					placeholder="910101010"
					placeholderStyle="text-gray-400 pl-14"
					rules="required|ethio_phone"
					:disabled="Load ? true : false"
				>
					<template #leading>
						<div class="absolute left-0 px-2 py-4 bg-gray-200">+251</div>
					</template>
					<template #label>
						<label class="form-label" for="Phone Number">Phone Number</label>
					</template>
				</HTextfield>

				<!-- Phone Number -->

				<div class="sm:col-span-3">
					<div class="mt-2">
						<HListselect
							v-model="selectedItemId"
							:items="selectItems"
							placeholder="Select an option"
							name="mySelect"
							:class="'w-full h-10 border-[1px] border-gray-300 rounded-md'"
							rules="required"
						>
							<template #label>
								<h1
									class="text-base font-poppins font-normal text-[#524848] capitalize"
								>
									role
								</h1>
							</template>
						</HListselect>
					</div>
				</div>
				<div class="flex justify-center my-4">
					<button
						type="submit"
						for="comment"
						class="block px-4 py-3 mt-2 font-normal text-white capitalize rounded-lg text-md font-poppins font bg-primary-600"
					>
						Invite Administrator
						<Icon
							v-if="onLoading"
							name="eos-icons:bubble-loading"
							class="text-2xl text-white"
						/>
					</button>
				</div>
			</div>
		</form>
	</ModalsMod>
</template>

<style scoped>
.skeleton-placeholder {
	background-color: #e2e8f0; /* Light gray background color */
	border-radius: 0.25rem; /* Rounded corners */
}
</style>
