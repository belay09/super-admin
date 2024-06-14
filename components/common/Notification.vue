<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

import notificationInApp from "@/composables/get.js";
import updateNotification from "@/graphql/mutations/notification/updateNotification.gql";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import mutator from "@/composables/auth-mutation";
import { format, parseISO } from 'date-fns'

import notification_subscription from "@/graphql/mutations/notification/rigisterDevice.gql";
import notification from "@/graphql/query/notification/inApp.gql";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);
const limit = ref(10);
const offset = ref(0);
const open = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit("update:modelValue", value);
  },
});

/* --------------------------- Notification Counter Refetch --------------------------- */
const counterRefetch = inject("counterRefetch");

/* --------------------------- Firebase Config --------------------------- */

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
onDone((result) => {});
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

/* --------------------------- Fetch Notifications --------------------------- */

const notificationValue = ref({});
const { onResult, refetch: notificationRefetch,fetchMore } = notificationInApp(
  notification,
  {
    limit,
    offset,
  }
);
onResult((result) => {
  notificationValue.value = result.data.notifications;
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
  notificationRefetch();
  counterRefetch();
});
const markasread = () => {
  updateNot({
    isSeen: true,
  });
};

const fetchMoreAndMore = async () => {
  await fetchMore({
    variables: {
      offset: notificationValue.value.length,
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      // No new notification posts

      if (!fetchMoreResult) return previousResult;

      // Concat previous feed with new feed posts
      return {
        ...previousResult,
        notifications: [
          ...previousResult?.notifications,
          ...fetchMoreResult?.notifications,
        ],
      };
    },
  });
};
const router = useRouter();

const routeBasedOnNotificationType = (notificationValue) => {
  switch (notificationValue.type) {
    case 'LIST_MY_BUSINESS':
    case 'NEW_PLACE':
      router.push('/app/places/' + notificationValue?.payload?.places?.id);
      open.value = false;
      break;
    case 'SEASONAL_PLACE':
    case 'WEEKLY_RECOMMENDED_PLACE':
    case 'RECENTLY_OPENED_PLACE':
    case 'NEW_PLACE_REVIEWED':
    case 'NEW_PLACE_REGISTERED':
    case 'NEW_FEATURED_PLACE':
      router.push('/app/places');
      open.value = false;
      break;
    
    case 'MENU_LAST_UPDATE_NOTIFICATION':
      // Assuming there's a route related to menu updates
      router.push('/app/places/' + notificationValue?.payload?.menus?.Places[0]?.id + '?tab=menu');      open.value = false;
      break;
    
    case 'NEW_REVIEW':
    case 'SUBSCRIPTION_PLAN_NOTICE':
    case 'SUBSCRIPTION_PLAN_WARNING':
    case 'SUBSCRIPTION_PLAN_CLOSE':
    case 'PAYMENT_VERIFIED':
    case 'NEW_PAYMENT_REQUEST':
      router.push('/app/billings');
      open.value = false;
      break;
    
    case 'CONTACT_US':
    case 'NEW_SUPPORT_REQUEST':
      router.push('/app/support-contact');
      open.value = false;
      break;
    
    default:
      console.log('Unknown notification type');
      open.value = false;
      break;
  }
};

const notificationIcons = {
  LIST_MY_BUSINESS: 'fa-briefcase',
  NEW_PLACE: 'ep:place',
  CONTACT_US: 'fa-envelope',
  MENU_LAST_UPDATE_NOTIFICATION: 'dashicons:food',
  SUBSCRIPTION_PLAN_NOTICE: 'fa-bell',
  SUBSCRIPTION_PLAN_WARNING: 'fa-exclamation-triangle',
  SUBSCRIPTION_PLAN_CLOSE: 'fa-times-circle',
  PAYMENT_VERIFIED: 'fa-check-circle',
  SEASONAL_PLACE: 'carbon:review',
  WEEKLY_RECOMMENDED_PLACE: 'fa-star',
  RECENTLY_OPENED_PLACE: 'carbon:review',
  NEW_PLACE_REVIEWED: 'carbon:review',
  NEW_SUPPORT_REQUEST: 'fa-comments',
  NEW_PAYMENT_REQUEST: 'streamline:payment-10',
  NEW_PLACE_REGISTERED: 'ep:place',
  NEW_REVIEW: 'fa-comments',
  NEW_FEATURED_PLACE: 'ep:place',
}
const getIcon = (notificationType) => {
  return notificationIcons[notificationType] || 'fa-check-circle'
}
</script>
<template>
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
              <DialogPanel class="relative pointer-events-auto max-w-7xl">
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
                    class="absolute flex pt-4 pr-2 -ml-10 left-5 top-64 xl:top-96 sm:-ml-10 sm:pr-4"
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
                <div class="w-full flex flex-col h-screen py-4 px-2 overflow-y-auto bg-white">
                  <div class="flex justify-between mb-4">
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
                  <!-- <div
                    v-if="notificationValue.length > 0"
                    class="divide-y-4 rounded divide-gray-100"
                  >
                    <HNotify
                      v-for="(message, index) in notificationValue"
                      :message="message"
                      :key="index"
                    ></HNotify>
                  </div> -->
                  <div
                      v-for="message in notificationValue"
                      :class="{ 'bg-[#F0E4E5] ': !message.isSeen }"
                      class="flex-col w-full p-2 mb-2 border-b  cursor-pointer hover:bg-gray-100  rounded-t"
                      @click="routeBasedOnNotificationType(message)"
                    >

                      <div
                        class="flex justify-between items-center overflow-y-auto w-full  rounded"
                      >
                        <div class="flex w-full gap-2 items-center">
                          <Icon
                            :name="getIcon(message.type)"
                            width="30"
                            height="30"
                            color="gray-900"
                          />
                          <h1
                            class="text-md font-poppins font-normal capitalize pl-2"
                          >
                            {{ message.title }}
                          </h1>
                        </div>
                        <div class="flex">
                          {{ format(parseISO(message.createdAt), 'dd,MMM') }}
                        </div>
                      </div>
                      <p
                        class="text-sm font-poppins font-light text-gray-700 capitalize p-5"
                      >
                        {{ message.message }}
                      </p>
                    </div>
                  <div
                    v-if="notificationValue.length < 4"
                    class="flex-col justify-center w-full pt-64 my-auto"
                  >
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
                  <button
                    @click="fetchMoreAndMore"
                    class="text-primary-600 bg-primary-200 w-fit mx-auto mb-0 px-10 py-1 rounded-t-xl flex self-center fixed bottom-0"
                  >
                    Fetch More
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
