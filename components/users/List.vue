<script setup>
import { format } from "date-fns";
import editUserMutation from "@/graphql/mutations/users/edit.gql";
import useNotify from "@/use/notify";
import { onClickOutside } from "@vueuse/core";

/**---------------------------Globals---------------- */
const { notify } = useNotify();
const emit = defineEmits(["update:modelValue", "edit"]);
const props = defineProps({
  // pageTracker
  modelValue: {
    type: Number,
    default: () => 1,
  },

  users: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  totalPage: {
    type: Number,
    required: true,
    default: () => 1,
  },
});

const pageTracker = ref(0);
watch(
  () => props.modelValue,
  (newVal) => {
    pageTracker.value = newVal;
  }
);
watch(pageTracker, (newVal) => {
  emit("update:modelValue", newVal);
});

/***--------------------------Table data------------------- */
const headers = [
  {
    text: "Name",
    value: "name",
  },
  {
    text: "Phone number",
    value: "phoneNumber",
  },

  {
    text: "Status",
    value: "status",
  },
  {
    text: "Reviews",
    value: "reviews",
  },
  {
    text: "Bookmarks",
    value: "bookmarks",
  },
  // {
  //   text: "Sign up method",
  //   value: "sign_up_method",
  // },

  {
    text: "created At",
    value: "createdAt",
  },
  {
    text: "Action",
    value: "action",
  },
];

/**------------------------Edit place----------------------- */
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editUserMutation);

editDone(() => {
  emit("edit");
  notify({
    title: "Updated successfully",
    description: "Updated successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  showActivateUserModal.value = false;
  showSuspendUserModal.value = false;
  showDeleteUserModal.value = false;

  showMoreAction.value = false;
  selectedItemId.value = null;
});

editError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**--------------------------Handle change user status---------------- */
const handleChangeUserStatus = (status) => {
  let input = {
    status,
  };
  editMutate({ input, id: selectedItemId.value });
};

const selectedItemId = ref(null);
const showMoreAction = ref(false);
function selectItemAndShowMoreAction(id) {
  selectedItemId.value = id;
  showMoreAction.value = true;
}
const showActivateUserModal = ref(false);
const showDeleteUserModal = ref(false);
const showSuspendUserModal = ref(false);

/**--------------------------Click outside------------------- */
const statusActionsContainer = ref(null);
onClickOutside(statusActionsContainer, (e) => (showMoreAction.value = false));

onMounted(() => {
  pageTracker.value = props.modelValue;
});
</script>

<template>
  <!-- -----------------------Activate  Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangeUserStatus('ACTIVE')"
    v-model="showActivateUserModal"
    title="Activate Account"
    sure-question="Are you sure you want to activate the place?"
    description="Activating this account will result in the user able to login to this account."
  ></ModalsConfirmation>

  <!-- -----------------------Suspend  Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangeUserStatus('SUSPENDED')"
    v-model="showSuspendUserModal"
    title="Suspend Account"
    sure-question="Are you sure you want to suspend this account?"
    description="Suspending this account will result in the user unable to login to their account."
  ></ModalsConfirmation>
  <!-- -----------------------Delete  Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangeUserStatus('DELETED')"
    v-model="showDeleteUserModal"
    title="Delete Account"
    sure-question="Are you sure you want to delete this account?"
    description="Deleting this account will result in the user unable to login to their account."
  ></ModalsConfirmation>
  <div class="flex flex-col py-6 space-y-8">
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium">
        Showing {{ totalPage > 0 ? pageTracker : 0 }} /{{ totalPage }}
      </p>
      <div class="flex items-center gap-8">
        <H-Page
          v-model:model-value="pageTracker"
          :total-page="totalPage"
        ></H-Page>
      </div>
    </div>

    <div class="">
      <h-table
        :headers="headers"
        :items="users"
        :loading="loading"
        supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
        supportHeaderClass="bg-gray-100 border"
        tableHeaderStyle="secondary-border  bg-gray-50"
        tableBodyRowStyle="border py-6"
        rowHeadStyle="secondary-text"
      >
        <template v-slot:name="{ item }">
          <div class="secondary-flex-row">
            <div>
              <img
                v-if="item.photoUrl"
                :src="item.photoUrl"
                alt="user image"
                class="w-10 h-10 rounded-full"
              />
              <img
                v-else
                src="/images/temporary/default-profile.png"
                alt="user image"
                class="w-10 h-10 rounded-full"
              />
            </div>
            <div>
              <p>{{ item.fullName }}</p>
              <p class="secondary-text">{{ item.email }}</p>
            </div>
          </div>
        </template>

        <!-- -----------------Account status------------ -->
        <template v-slot:status="{ item }">
          <p
            :class="
              item.status == 'ACTIVE'
                ? 'bg-green-100'
                : item.status == 'SUSPENDED'
                ? 'bg-yellow-100'
                : 'bg-red-100'
            "
            class="rounded-full py-0.5 text-center"
          >
            {{ item.status }}
          </p>
        </template>
        <template v-slot:reviews="{ item }">
          <p class="tertiary-text">
            {{
              item.placeReviewsAggregate?.aggregate?.count +
              item.reviewReviewsAggregate?.aggregate?.count
            }}
          </p>
        </template>
        <template v-slot:bookmarks="{ item }">
          <p class="tertiary-text">
            {{
              item.userPlaceBookMarksAggregate?.aggregate.count +
              item.userReviewBookMarksAggregate?.aggregate.count
            }}
          </p>
        </template>
        <!-- <template v-slot:sign_up_method="{ item }">
          <p class="tertiary-text">
            {{ item.sign_up_method }}
          </p>
          <p>Verified</p>
        </template> -->
        <template v-slot:createdAt="{ item }">
          <p class="tertiary-text">
            {{ format(new Date(item.createdAt), " dd MMM, yyyy") }}
          </p>
        </template>
        <template v-slot:action="{ item }">
          <div class="relative">
            <button
              @click="selectItemAndShowMoreAction(item.id)"
              class="hover:cursor-pointer"
            >
              <Icon name="fontisto:more-v" class="text-xl dark:text-white" />
            </button>

            <!-- -----------------------Extend date and Remove from feature --------------- -->
            <div
              ref="statusActionsContainer"
              v-if="showMoreAction && selectedItemId == item.id"
              class="absolute top-4 right-0 z-[999] w-72 flex flex-col gap-y-4 shadow-lg bg-white rounded-lg p-5 hover:cursor-pointer"
            >
              <!-- -------------Activate user------------- -->
              <button
                @click="showActivateUserModal = true"
                class="flex items-center gap-3"
              >
                <Icon name="uil:user-check" class="text-2xl shrink-0" />
                <p class="text-sm">Activate Account</p>
              </button>
              <!-- -------------Suspend user------------- -->

              <button
                @click="showSuspendUserModal = true"
                class="flex items-center gap-3"
              >
                <Icon name="uil:user-minus" class="text-2xl shrink-0" />
                <p class="text-sm">Suspend Account</p>
              </button>
              <!-- -------------Delete user------------- -->

              <button
                @click="showDeleteUserModal = true"
                class="flex items-center gap-3 text-primary-600"
              >
                <Icon name="uil:trash-alt" class="text-2xl shrink-0" />
                <p class="text-sm whitespace-nowrap">Delete Account</p>
              </button>
            </div>
          </div>
        </template>
      </h-table>
    </div>
  </div>
</template>
