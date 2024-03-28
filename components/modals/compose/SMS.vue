<script setup>
import addMutation from "@/graphql/mutations/broadcast/add-sms.gql";
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
const currentTabIndex = ref(0);
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

/**---------------------------Add Sms Notification --------------------------- */
const isPublish = ref(false);
const message = ref("");
const {
  mutate: addMutate,
  onDone: addDone,
  onError: addError,
  loading: addLoading,
} = authMutation(addMutation);

/**-----------------------Handle add --------------------------- */
const handleAdd = handleSubmit((values, clickedButton) => {
  if (clickedButton.evt === "send") {
    isPublish.value = true;
  } else {
    isPublish.value = false;
  }
  addMutate({
    input: {
      message: message.value,
      targetGroup: tabs.value[currentTabIndex.value].value,
      status: "DRAFT",
    },
  });
});

addDone(({ data }) => {
  if (isPublish.value) {
    publishMutate({
      target_group: tabs.value[currentTabIndex.value].value,
      sms_id: data?.insertSmsNotificationsOne?.id,
    });
  } else {
    refetchNotifications();
    notify({
      title: "Sms Notification Saved",
      description: "Sms Notification saved successfully",
      type: "error",
      borderClass: "border-l-8 border-green-300",
    });
  }
});

addError((error) => {
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
            :disabled="!isPublish && addLoading"
            @click.prevent="handleAdd('draft')"
            class="w-full py-3 border border-gray-300 rounded-md"
          >
            Save as Draft

            <Icon
              v-if="!isPublish && addLoading"
              name="eos-icons:bubble-loading"
              class="text-2xl text-white"
            />
          </button>
          <button
            :disabled="isPublish && (addLoading || publishLoading)"
            @click.prevent="handleAdd('send')"
            class="flex items-center justify-center w-full py-3 text-white rounded-md gap-x-4 bg-primary-600"
          >
            <Icon name="lucide:send" />
            <span>Send Now</span>

            <Icon
              v-if="isPublish && (addLoading || publishLoading)"
              name="eos-icons:bubble-loading"
              class="text-2xl text-white"
            />
          </button>
        </div>
      </form>
    </template>
  </ModalsModal>
</template>
