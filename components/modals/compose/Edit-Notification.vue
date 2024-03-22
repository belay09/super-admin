<script setup>
import editMutation from "@/graphql/mutations/broadcast/update-push-notification.gql";
import publishMutation from "@/graphql/mutations/broadcast/broadcast-push-notification.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();
const { handleSubmit, isSubmitting } = useForm({});

const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    required: true,
  },
});
const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
const refetchNotifications = inject("refetch");
/**------------------------------User and Place Owners------------------------------ */
const tabs = ref([
  {
    name: "Users",
    value: "USER",
    icon: "tabler:users",
  },
  {
    name: "Place Owners",
    value: "PLACE_OWNER",
    icon: "bi:building-fill",
  },
]);

function getTabIndex() {
  if (props.item === null) {
    return 0;
  } else {
    return tabs.value.findIndex((tab) => tab.value === props.item.targetGroup);
  }
}
const currentTabIndex = ref(getTabIndex());

/**---------------------Publish Push Notification-------------- */

const {
  mutate: publishMutate,
  onDone: publishDone,
  onError: publishError,
  loading: publishLoading,
} = authMutation(publishMutation);

publishDone(() => {
  isPublish.value = false;
  notify({
    title: "Push Notification Published",
    description: "Push Notification updated and published successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  refetchNotifications();
  open.value = false;
});

publishError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**---------------------------Add Push Notification --------------------------- */
const isPublish = ref(false);
const notificationInput = ref({
  ...props.item,
});
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editMutation);

/**-----------------------Handle add --------------------------- */
const handleEdit = handleSubmit((values, clickedButton) => {
  if (clickedButton.evt === "send") {
    isPublish.value = true;
  } else {
    isPublish.value = false;
  }
  // notificationInput.value.targetGroup = tabs.value[currentTabIndex.value].value;
  editMutate({
    id: props.item.id,
    input: {
      body: notificationInput.value.body,
      title: notificationInput.value.title,
      targetGroup: tabs.value[currentTabIndex.value].value,
    },
  });
});

editDone(({ data }) => {
  if (isPublish.value) {
    publishMutate({
      target_group: tabs.value[currentTabIndex.value].value,
      push_notification_id: data?.updatePushNotificationsByPk?.id,
    });
  } else {
    notify({
      title: "Push Notification Saved",
      description: "Push Notification saved successfully",
      type: "error",
      borderClass: "border-l-8 border-green-300",
    });
    open.value = false;
    refetchNotifications();
  }
});

editError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <ModalsModal body-class="max-w-[700px] !p-6" v-model="open">
    <template #header>
      <h2 class="leading-6 text-gray-900">Compose Push Notification</h2>
    </template>
    <template #content>
      <form class="mt-4 space-y-4" action="">
        <H-Tab v-model:current-tab-index="currentTabIndex" :tabs="tabs">
          <template v-slot:tab="{ tabData }">
            <div class="secondary-flex-row">
              <span class="text-base">{{ tabData.tab?.name }}</span>
              <Icon class="text-lg" :name="tabData.tab.icon" />
            </div>
          </template>
        </H-Tab>

        <div>
          <!-- ---------------------Category------------------- -->

          <SelectorsMessageCategory
            v-model="notificationInput.category"
          ></SelectorsMessageCategory>

          <!-- ---------------------Title------------------- -->
          <HTextfield
            v-model="notificationInput.title"
            name="title"
            id="title"
            label="Title"
            rules="required"
          >
          </HTextfield>
        </div>

        <!-- ---------------------Message-------------------- -->
        <HTextarea
          v-model="notificationInput.body"
          name="message"
          id="message"
          label="Message"
          class=""
          rules="required"
        />

        <!-- -------------------------Regard--------------------- -->
        <div class="text-gray-600">
          <p>Regards.</p>
          <p>Sheger Gebeta Team</p>
        </div>

        <div class="flex gap-x-4">
          <button
            :disabled="!isPublish && editLoading"
            @click.prevent="handleEdit('draft')"
            class="w-full py-3 border border-gray-300 rounded-md"
          >
            Save as

            <Icon
              v-if="!isPublish && editLoading"
              name="eos-icons:bubble-loading"
              class="text-2xl text-primary-600"
            />
          </button>
          <button
            :disabled="isPublish && (editLoading || publishLoading)"
            @click.prevent="handleEdit('send')"
            class="flex items-center justify-center w-full py-3 text-white rounded-md gap-x-4 bg-primary-600"
          >
            <Icon name="lucide:send" />
            <span>Send Now</span>

            <Icon
              v-if="isPublish && (editLoading || publishLoading)"
              name="eos-icons:bubble-loading"
              class="text-2xl text-white"
            />
          </button>
        </div>
      </form>
    </template>
  </ModalsModal>
</template>
