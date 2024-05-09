<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useAuthStore } from "@/stores/auth.js";
import counter from "@/graphql/query/notification/counter.gql";
import notificationInApp from "@/composables/notification.js";

const router = useRouter();
const authStore = useAuthStore();

/**-----------------------------Logout----------------------------- */

const { onLogout } = useApollo();

function handleLogout() {
	showLogoutConformationModal.value = false;
	authStore.logout();
	onLogout("authClient");
	router.replace("/");
}

/**-----------------------------Fetch Notification Counter----------------------------- */
const notificationCounter = ref(0);
const { onResult: result, refetch: counterRefetch } = notificationInApp(
	counter,
	"authClient"
);

provide("counterRefetch", counterRefetch);

result((result) => {
	notificationCounter.value =
		result.data?.notificationsAggregate?.aggregate?.count;
	console.log("counter ref", notificationCounter.value);
});

const route = useRoute();

/**-----------------------------Navs is Auto Import From Utils Folder----------------------------- */

const currNav = computed(() => {
	return navs.find((nav) => {
		return route.path.includes(nav.to);
	});
});

const showLogoutConformationModal = ref(false);
const openNotificationSideBar = ref(false);
</script>

<template>
	<CommonNotification v-model="openNotificationSideBar" />
	<ModalsConfirmation
		v-model="showLogoutConformationModal"
		title="Log out"
		description="Are you sure you want to log out?"
		confirm-button="Log out"
		@confirm="handleLogout"
		icon="mdi:warning-box"
	/>

	<div
		class="sticky top-0 z-40 flex items-center justify-between py-4 ml-10 mr-16 bg-white border-b border-sheger-gray-300"
	>
		<!-- ----------------------------Page name---------------- -->
		<div
			class="flex items-center text-xl font-semibold gap-x-4 text-primary-600"
		>
			<Icon :name="currNav?.icon" />
			<p>{{ currNav?.name }}</p>
		</div>

		<div class="flex items-center">
			<button
				@click="openNotificationSideBar = true"
				type="button"
				class="relative text-gray-400 hover:text-gray-500"
			>
				<span class="sr-only">View notifications</span>
				<Icon
					class="text-3xl text-black"
					name="basil:notification-on-outline"
				></Icon>
				<span
					v-if="notificationCounter > 0"
					class="counter bg-red-500 text-white text-center rounded-full w-[14px] h-[15px] text-xs absolute bottom-2 right-1"
					>{{ notificationCounter }}</span
				>
			</button>

			<!-- -----------------Clickable Profile Data with chevron icon------------------------- -->
			<div class="p-5 gap-x-[20px] flex items-center">
				<!-- Separator -->
				<div
					class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10"
					aria-hidden="true"
				/>

				<!-- Profile dropdown -->
				<Menu as="div" class="relative">
					<MenuButton class="-m-4 flex items-center p-1.5">
						<span class="sr-only">Open user menu</span>

						<div
							class="flex items-center px-1 py-2 align-center bg-primary-50 lg:pl-3 lg:pr-5 md:px-1 sm:px-1 rounded-3xl"
						>
							<img
								class="w-[30px] h-[30px] rounded-full"
								:src="authStore?.user?.picture"
								alt="logo"
							/>
							<span class="hidden lg:flex lg:items-center">
								<div class="ml-3">
									<p class="text-sm text-black capitalize">
										{{ authStore?.user?.email }}
									</p>
								</div>
								<div class="ml-2">
									<Icon name="mingcute:down-line" width="16" height="16"></Icon>
								</div>
							</span>
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
							class="absolute right-0 z-10 mt-2.5 w-36 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
						>
							<MenuItem v-slot="{ active }">
								<button
									type="button"
									@click="navigateTo('/app/administrators/update')"
									:class="[
										active ? 'bg-primary-50 text-primary-600' : 'text-gray-900',
										'group flex w-full item-center rounded-md px-2 py-2 text-sm ',
									]"
								>
									update profile
									<Icon
										name="mdi:account-edit"
										width="17"
										height="17"
										class="ml-2"
									></Icon>
								</button>
							</MenuItem>
							<MenuItem v-slot="{ active }">
								<button
									type="button"
									@click="showLogoutConformationModal = true"
									:class="[
										active ? 'bg-primary-50 text-primary-600' : 'text-gray-900',
										'group flex w-full items-center rounded-md px-2 py-2 text-sm ',
									]"
								>
									Logout
									<Icon
										name="mdi:logout"
										width="17"
										height="17"
										class="ml-2"
									></Icon>
								</button>
							</MenuItem>
						</MenuItems>
					</transition>
				</Menu>
			</div>
		</div>
	</div>
</template>
