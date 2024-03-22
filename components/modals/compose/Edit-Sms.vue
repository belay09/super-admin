<script setup>
import editMutation from "@/graphql/mutations/broadcast/update-sms.gql";
import publishMutation from "@/graphql/mutations/broadcast/broadcast-sms.gql";

import useNotify from "@/use/notify";
import Editor from "primevue/editor";

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

/**---------------------------Edit Sms Notification --------------------------- */
const isPublish = ref(false);
const message = ref(props.item.message || "");
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editMutation);

const handleEdit = handleSubmit((values, clickedButton) => {
  if (clickedButton.evt === "send") {
    isPublish.value = true;
  } else {
    isPublish.value = false;
  }
  editMutate({
    id: props.item.id,
    input: {
      message: message.value,
      targetGroup: tabs.value[currentTabIndex.value].value,
    },
  });
});

editDone(({ data }) => {
  if (isPublish.value) {
    publishMutate({
      target_group: tabs.value[currentTabIndex.value].value,
      email_message_id: data?.updateSmsNotificationsByPk?.id,
    });
  } else {
    refetchNotifications();
    notify({
      title: "Sms Notification Updated",
      description: "Sms Notification Updated successfully",
      type: "error",
      borderClass: "border-l-8 border-green-300",
    });
    open.value = false;
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
  <ModalsModal body-class="max-w-[550px] !p-6" v-model="open">
    <template #header>
      <h2 class="leading-6 text-gray-900">Compose SMS Message</h2>
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
        <!-- ---------------------Message-------------------- -->
        <HTextarea
          v-model="message"
          name="message"
          id="message"
          label="Message"
          class=""
          rules="required"
        />

        <div class="flex gap-x-4">
          <button
            :disabled="!isPublish && editLoading"
            @click.prevent="handleEdit('draft')"
            class="w-full py-3 border border-gray-300 rounded-md"
          >
            Save as Draft

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
