<script setup>
import deleteMutation from "@/graphql/mutations/broadcast/delete-sms.gql";
import publishMutation from "@/graphql/mutations/broadcast/broadcast-sms.gql";

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
  showDeleteSmsNotificationModal.value = false;
  notify({
    title: "Email notification deleted",
    description: "Email notification deleted successfully",
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

/**---------------------Publish Sms-------------- */

const {
  mutate: publishMutate,
  onDone: publishDone,
  onError: publishError,
  loading: publishLoading,
} = authMutation(publishMutation);

publishDone(() => {
  refetchNotifications();
  isPublish.value = false;
  notify({
    title: "Sms Notification Published",
    description: "Sms Notification published successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
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
    sms_id: props.item?.id,
  });
};

/**----------------------Modals---------------- */

const showDeleteSmsNotificationModal = ref(false);
const openComposeEditSms = ref(false);
const openPublishModal = ref(false);
</script>
<template>
  <!-- -----------------Edit email notification Modal---------------- -->

  <ModalsComposeEditSms
    v-if="openComposeEditSms"
    :item="item"
    v-model="openComposeEditSms"
  />
  <!-- -----------------------Delete email notification Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleDelete"
    v-model="showDeleteSmsNotificationModal"
    title="Delete Sms Notification"
    sure-question="Are you sure you want to delete this sms notification?"
    description="This action is irreversible and will permanently remove the sms notification"
  ></ModalsConfirmation>

  <!-- -----------------------Publish Email notification Modal---------------- -->
  <ModalsConfirmation
    @confirm="handlePublish"
    v-model="openPublishModal"
    title="Publish Sms Notification"
    sure-question="Are you sure you want to publish this sms notification?"
    description="This action send the sms notification to all users."
  ></ModalsConfirmation>
  <div class="p-4 space-y-3 border border-gray-300 rounded-lg">
    <div class="flex items-center justify-between">
      <p class="text-lg font-medium leading-7">Message</p>
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
              @click="openComposeEditSms = true"
              class="flex items-center text-base cursor-pointer gap-x-4"
            >
              <Icon class="text-xl" name="carbon:edit" />
              <span>Edit Message</span>
            </li>
            <li
              @click="openPublishModal = true"
              class="flex items-center text-base cursor-pointer gap-x-4"
            >
              <Icon class="text-xl" name="bi:check-all" />
              <span>
                {{ item.status == "SENT" ? "Resend" : "Publish" }} Message</span
              >
            </li>
            <li
              @click="showDeleteSmsNotificationModal = true"
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
        <Icon name="heroicons-outline:mail-open" />
        Email
      </span>
    </div>
    <p class="text-base text-gray-700">
      {{ item.message }}
    </p>
  </div>
</template>
