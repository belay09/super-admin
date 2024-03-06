<script setup>
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
import { useAuthStore } from "@/stores/auth.js";
import notificationInApp from "@/composables/notification.js";
import updateNotification from "@/graphql/mutations/notification/updateNotification.gql";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import mutator from "@/composables/auth-mutation";

const { onLogout } = useApollo();
import notification_subscription from "@/graphql/mutations/notification/rigisterDevice.gql";
import notification from "@/graphql/query/notification/inApp.gql";
import counter from "@/graphql/query/notification/counter.gql";
const router = useRouter();
const authStore = useAuthStore();

const route = useRoute();
function gotoMessage() {
	router.push("/app/supports");
}
const open = ref(false);
function logout() {
	authStore.logout();
	onLogout("authClient");
	router.push("/");
}
function pushed() {
	router.push("/app/administrators/update");
}

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const notificationTimeGap = ref(
	parseInt(import.meta.env.VITE_NOTIFICATION_TIME_GAP || 120000)
); //default is 120000 (2 Minutes)

/* --------------------------- Register device Id --------------------------- */
const { mutate, onError, loading, onDone } = mutator(notification_subscription);
onDone((result) => {
	console.log("egistering", result);
});
if (!("Notification" in window)) {
	// Check if the browser supports notifications
	alert("This browser does not support desktop notification");
} else if (Notification.permission === "granted") {
	// Check whether notification permissions have already been granted;
	// if so, create a notification
	register();
} else if (Notification.permission !== "denied") {
	// We need to ask the user for permission
	Notification.requestPermission().then((permission) => {
		// If the user accepts, let's create a notification
		if (permission === "granted") {
			register();
		}
	});
}
function register() {
	getToken(messaging, {
		vapidKey: import.meta.env.VITE_FIREBASE_VAP_ID,
	}).then((per) => {
		if (per) {
			console.log(per);
			mutate({
				deviceToken: per,
			});
		} else {
		}
	});
}
/* ------------------------- On receiving a message ------------------------- */
onMessage(messaging, (payload) => {
	// Add the payload to the messages array
	messages.push(payload);
	3;
});

// Read messages from localStorage
let messages = JSON.parse(localStorage.getItem("Primary-messages")) || [];

let notificationInterval = setInterval(() => {
	// Check if there are any messages
	if (messages.length > 0) {
		// Create a notification with the count of messages
		notify({
			title: "New Messages",
			description: `You received ${messages.length} new message(s).`,
			type: "info",
		});
		// Clear the messages in localStorage
		localStorage.removeItem("Primary-messages");
		messages = [];
	}
}, notificationTimeGap.value);
const notificationValue = ref({});
const { onResult, refetch } = notificationInApp(notification, "authClient");
onResult((result) => {
	notificationValue.value = result.data.notifications;
});

const notificationCounter = ref(0);
const { onResult: result, refetch: refet } = notificationInApp(
	counter,
	"authClient"
);
result((result) => {
	notificationCounter.value =
		result.data?.notificationsAggregate?.aggregate?.count;
	console.log("counter ref", notificationCounter.value);
});
const {
	mutate: updateNot,
	loading: updating,
	onDone: updateDone,
	onError: updateError,
} = mutator(updateNotification, "");
updateNot({
	isSeen: false,
});
updateError((error) => {
	console.log("error", error);
	notify("error", "Error", error.message);
	uploadingg.value = false;
	// Handle the error
});

updateDone(({ data }) => {
	refetch();
	refet();
});
const markasread = () => {
	updateNot({
		isSeen: true,
	});
};

const navs = ref([
	{
		name: "Dashboard",
		icon: "material-symbols:dashboard-outline",
		to: "/app/dashboard",
	},
	{
		name: "Place",
		icon: "uil:shop",
		to: "/app/places",
	},
	{
		name: "Featured Places",
		icon: "lucide:building",
		to: "/app/featured-places",
	},
	{
		name: "Sheger Reviews",
		icon: "ri:menu-unfold-fill",
		to: "/app/sheger-reviews",
	},
	{
		name: "Ad Space",
		icon: "icons8:advertising",
		to: "/app/ad_space",
	},
	{
		name: "User",
		icon: "tabler:users",
		to: "/app/users",
	},
	{
		icon: "fa6-solid:martini-glass-empty",
		name: "Sponsored drinks",
		to: "/app/sponsored_drinks",
	},
	{
		name: "Administrators",
		icon: "bi:shield",
		to: "/app/administrators",
	},
	{
		name: "Reports",
		icon: "ph:flag-light",
		to: "/app/reports",
	},
	{
		name: "Billings",
		icon: "solar:bill-list-bold",
		to: "/app/billings",
	},
	{
		name: "Configurations",
		icon: "streamline:insert-side",
		to: "/app/configurations",
	},
]);

const currNav = computed(() => {
	return navs.value.find((nav) => {
		return route.path.includes(nav.to);
	});
});
</script>

<template>
	<ModalsConfirmation
		v-model="showLogoutConformationModal"
		title="Log out"
		description="Are you sure you want to log out?"
		confirm-button="Log out"
		@confirm="handleLogout"
		icon="mdi:warning-box"
	/>
	<HNotification />
	<div class="">
		<div class="flex">
			<div
				class="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col"
			>
				<!-- Sidebar component, swap this element with another sidebar if you like -->
				<div
					class="fixed top-0 left-0 flex flex-col h-screen px-6 overflow-y-auto border-r border-gray-200 grow gap-y-5 bg-primary-50 scroll"
				>
					<div class="flex items-center h-16 shrink-0">
						<img
							class="w-auto h-12"
							src="/images/static/sheger-admin-logo.png"
							alt="Sheger Admin Logo"
						/>
					</div>
					<nav class="flex flex-col flex-1">
						<ul role="list" class="flex flex-col flex-1 gap-y-7">
							<li>
								<ul role="list" class="mx-2 space-y-1">
									<UiSidebar />
								</ul>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<main class="relative flex flex-col w-full">
				<!-- top bar -->
				<div
					class="sticky top-0 z-50 flex items-center justify-between py-4 ml-10 mr-16 bg-white border-b border-sheger-gray-300"
				>
					<div
						class="flex items-center text-xl font-semibold gap-x-4 text-primary-600"
					>
						<Icon :name="currNav.icon" />
						<p>{{ currNav?.name }}</p>
					</div>

					<!----------------------------- Right----------------------- -->
					<div class="flex items-center gap-4">
						<!-- -----------------Message ---------------------------- -->
						<div
							@click="gotoMessage"
							class="flex items-center space-x-4 cursor-pointer"
						>
							<Icon name="ant-design:message-outlined" class="text-3xl" />
						</div>
						<!-- -----------------Notifcation ---------------------------- -->
						<button
							@click="open = true"
							type="button"
							class="relative p-2.5 text-gray-400 hover:text-gray-500"
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
										class="flex items-center px-1 py-1 align-center bg-primary-50 lg:pl-3 lg:pr-5 md:px-1 sm:px-1 rounded-3xl"
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
												<Icon
													name="mingcute:down-line"
													width="16"
													height="16"
												></Icon>
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
												@click="pushed"
												:class="[
													active
														? 'bg-primary-50 text-primary-600'
														: 'text-gray-900',
													'group flex w-full item-center rounded-md px-2 py-2 text-sm justify-center',
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
												@click="logout"
												:class="[
													active
														? 'bg-primary-50 text-primary-600'
														: 'text-gray-900',
													'group flex w-full items-center rounded-md px-2 py-2 text-sm justify-center',
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
				<div class="h-full px-10 py-6 pr-16 overflow-y-scroll">
					<!-- Main area -->
					<slot />
				</div>
			</main>
		</div>
	</div>
	<TransitionRoot as="template" :show="open">
		<Dialog as="div" class="relative z-50" @close="open = false">
			<TransitionChild
				as="template"
				enter="ease-in-out duration-500"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in-out duration-500"
				leave-from="opacity-100"
				leave-to="opacity-0"
			>
				<div
					class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
				/>
			</TransitionChild>

			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none"
					>
						<TransitionChild
							as="template"
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enter-from="translate-x-full"
							enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leave-from="translate-x-0"
							leave-to="translate-x-full"
						>
							<DialogPanel class="relative pointer-events-auto w-96">
								<TransitionChild
									as="template"
									enter="ease-in-out duration-500"
									enter-from="opacity-0"
									enter-to="opacity-100"
									leave="ease-in-out duration-500"
									leave-from="opacity-100"
									leave-to="opacity-0"
								>
									<div
										class="absolute flex pt-4 pr-2 -ml-8 left-5 top-64 xl:top-96 sm:-ml-10 sm:pr-4"
									>
										<button
											type="button"
											class="relative w-10 h-10 text-gray-300 rounded-full hover:text-white focus:outline-none focus:ring-2 bg-primary-500"
											@click="open = false"
										>
											<span class="absolute -inset-1.5" />
											<span class="sr-only">Close panel</span>
											<Icon
												name="ph:x"
												color="white"
												width="20"
												height="20"
												class="self-center"
											></Icon>
										</button>
									</div>
								</TransitionChild>
								<div class="w-full h-screen py-2 overflow-y-auto bg-white">
									<div class="flex justify-between px-2 mb-4">
										<h1
											class="font-medium text-lg leading-[35px] font-body text-secondary :text-white capitalize"
										>
											notifications
										</h1>
										<button
											@click="markasread"
											class="p-2.5 text-primary-600 font-poppins capitalize"
										>
											mark as read
										</button>
									</div>
									<div v-if="notificationValue.length>0" class="divide-y-2 divide-gray-100">
										<HNotify
											v-for="message in notificationValue"
											:message="message"
										></HNotify>
									</div>
									<div v-if="notificationValue.length<4" class="flex-col justify-center w-full pt-64 my-auto">
										<div class="flex justify-center m-auto my-auto">
											<Icon
												name="basil:notification-on-outline"
												class="item-center h-[100px] w-[100px] text-primary-600"
											>
											</Icon>
										</div>
										<div class="flex justify-center m-auto my-auto">
											<h1
												class="item-center text-primary-600 text-md font-poppins"
											>
												No More Notifications
											</h1>
										</div>
									</div>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
