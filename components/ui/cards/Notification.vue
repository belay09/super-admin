<script setup>
import deleteMutation from "@/graphql/mutations/broadcast/delete-push-notification.gql";
import publishMutation from "@/graphql/mutations/broadcast/broadcast-push-notification.gql";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const refetchNotifications = inject("refetch");

/**-----------------------Delete email notification --------------------------- */
const {
  mutate: deleteMutate,
  onDone: deleteDone,
  onError: deleteError,
  loading: deleteLoading,
} = authMutation(deleteMutation);
const handleDelete = () => {
  deleteMutate({ id: props.item.id });
};

deleteDone(() => {
  refetchNotifications();
  showDeletePushNotificationModal.value = false;
  notify({
    title: "Push notification deleted",
    description: "Push notification deleted successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

deleteError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**----------------------Publish push notification------------------- */

const {
  mutate: publishMutate,
  onDone: publishDone,
  onError: publishError,
  loading: publishLoading,
} = authMutation(publishMutation);

publishDone(() => {
  notify({
    title: "Push Notification Published",
    description: "Push Notification published successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  refetchNotifications();
});

publishError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const handlePublish = () => {
  publishMutate({
    target_group: props.item?.targetGroup,
    push_notification_id: props.item?.id,
  });
};

/**----------------------------Modals------------------------ */

const showDeletePushNotificationModal = ref(false);
const openComposeEditPushNotifications = ref(false);
const openPublishModal = ref(false);
</script>
<template>
  <!-- -----------------Edit Push notification Modal---------------- -->

  <ModalsComposeEditNotification
    v-if="openComposeEditPushNotifications"
    :item="item"
    v-model="openComposeEditPushNotifications"
  />
  <!-- -----------------------Delete push notification Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleDelete"
    v-model="showDeletePushNotificationModal"
    title="Delete Push Notification"
    sure-question="Are you sure you want to delete this push notification?"
    description="This action is irreversible and will permanently remove the push notification"
  ></ModalsConfirmation>

  <!-- -----------------------Publish push notification Modal---------------- -->
  <ModalsConfirmation
    @confirm="handlePublish"
    v-model="openPublishModal"
    title="Publish Push Notification"
    sure-question="Are you sure you want to publish this push notification?"
    description="This action send the push notification to all users."
  ></ModalsConfirmation>
  <div class="p-4 space-y-3 border border-gray-300 rounded-lg">
    <div class="flex items-center justify-between">
      <p class="text-lg font-medium leading-7">{{ item.title }}</p>
      <Popover class="relative">
        <PopoverButton>
          <Icon
            class="text-2xl cursor-pointer"
            name="ph:dots-three-outline-vertical-fill"
          />
        </PopoverButton>

        <PopoverPanel
          class="absolute right-0 z-10 min-w-[230px] p-4 mt-1.5 bg-white rounded-lg shadow-lg class"
        >
          <ul class="space-y-2">
            <li
              v-if="item.status != 'SENT'"
              @click="openComposeEditPushNotifications = true"
              class="flex items-center text-base cursor-pointer gap-x-4"
            >
              <Icon class="text-xl" name="carbon:edit" />
              <span>Edit Message</span>
            </li>
            <li
              class="flex items-center text-base cursor-pointer gap-x-4"
              @click="openPublishModal = true"
            >
              <Icon class="text-xl" name="bi:check-all" />
              <span>
                {{ item.status == "SENT" ? "Resend" : "Publish" }} Message</span
              >
            </li>
            <li
              @click="showDeletePushNotificationModal = true"
              v-if="item.status != 'SENT'"
              class="flex items-center text-base cursor-pointer text-primary-500 gap-x-4"
            >
              <Icon class="text-xl" name="ph:trash-bold" />
              <span>Delete Message</span>
            </li>
          </ul>
        </PopoverPanel>
      </Popover>
    </div>
    <div class="flex gap-x-2">
      <Icon class="text-xl" name="tabler:calendar-clock" />
      <span class="text-sm text-gray-600">Jan 12 2024 , 12:09 PM</span>
    </div>
    <div class="space-x-2">
      <span
        class="px-2 py-1 text-xs font-medium bg-sheger-blue-50 rounded-xl text-sheger-blue-800"
      >
        Pending
      </span>
      <span
        class="px-2 py-1 text-xs font-medium bg-sheger-gray-100/5 rounded-xl"
      >
        <Icon name="ph:users" />
        User
      </span>
      <span
        class="px-2 py-1 text-xs font-medium bg-sheger-gray-100/5 rounded-xl"
      >
        <Icon name="mdi:bell-outline" />
        Notification
      </span>
    </div>
    <p class="text-base text-gray-700">
      {{ item.body }}
    </p>
  </div>
</template>
