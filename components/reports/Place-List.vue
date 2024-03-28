<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

import { format, parseISO } from "date-fns";

import UpdatePlaceReviewReportMutation from "@/graphql/mutations/reports/updatePlaceReviewReport.gql";

import UpdateUser from "@/graphql/mutations/users/edit.gql";

defineProps({
  items: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["refetch"]);

const router = useRouter();
const route = useRoute();

/***--------------------------Table data------------------- */
const sort = ref([{ name: "desc" }]);

const headers = [
  {
    text: "Name",
    value: "name",
  },
  {
    text: "Place Name",
    value: "place_name",
  },

  {
    text: "Review content",
    value: "review_content",
  },

  {
    text: "Report category",
    value: "report_category",
  },

  {
    text: "Reported by",
    value: "reported_by",
  },

  {
    text: "Reported At",
    value: "reported_at",
  },
  {
    text: "Action",
    value: "action",
  },
];

const clickRow = (item) => {
  router.push({
    name: "app-users-roles-edit",
    params: { edit: item.id },
  });
};

/*-------------------------- Address report ------------------- */
const {
  mutate: addressReport,
  loading: addressReportLoading,
  onDone: onAddressReportDone,
} = authMutation(UpdatePlaceReviewReportMutation);

const handleAddressReport = (id) => {
  addressReport({
    id,
    changes: {
      isAddressed: true,
    },
  });
};

onAddressReportDone(() => {
  emit("refetch");
});

/*-------------------------- Suspend user ------------------- */
const showSuspendModal = ref(false);
const selectedUser = ref(null);
const {
  mutate: suspendUser,
  loading: suspendUserLoading,
  onDone: onSuspendUserDone,
} = authMutation(UpdateUser);

const handleSuspendUser = (id) => {
  suspendUser({
    id,
    input: {
      status: "SUSPENDED",
    },
  });
};

onSuspendUserDone(() => {
  emit("refetch");
  showSuspendModal.value = false;
});

// view post
function viewPost(item) {
  console.log("item", item);
  router.push({
    name: "app-places-id",
    params: { id: item.place_review?.place.id },
    query: { tab: "reviews" },
  });
}
</script>

<template>
  <Modals-Modal
    v-model="showSuspendModal"
    @close="showSuspendModal = false"
    title="Suspend User"
  >
    <template #header>
      <p class="text-xl font-medium text-primary-600">Suspend User Account</p>
    </template>
    <template #content>
      <div class="flex flex-col mt-5 gap-y-4">
        <p class="text-center">Are you sure you want to suspend this user?</p>
        <div class="flex justify-center gap-x-4">
          <button
            type="button"
            @click="showSuspendModal = false"
            class="px-4 py-2 border border-gray-300 rounded-md hover:text-red-600 hover:border hover:border-red-600"
          >
            Cancel
          </button>
          <button
            type="button"
            @click="handleSuspendUser(selectedUser.id)"
            class="px-4 py-2 text-white bg-red-600 border border-red-600 rounded-md"
          >
            Suspend
          </button>
        </div>
      </div>
    </template>
  </Modals-Modal>

  <div class="relative flex flex-col my-6">
    <div class="">
      <h-table
        :headers="headers"
        :items="items"
        v-model:sort="sort"
        :loading="addressReportLoading || loading"
        @click:row="clickRow"
        supporterClass="shadow-md overflow-x-auto min-h-[600px] overflow-y-hidden rounded-md border border-gray-200"
        supportHeaderClass="bg-gray-100 border"
        tableHeaderStyle="secondary-border bg-gray-50"
        tableBodyRowStyle="border py-6"
        rowHeadStyle="secondary-text"
      >
        <template v-slot:name="{ item }">
          <div class="secondary-flex-row">
            <div>
              <img
                v-if="
                  item?.place_review?.user?.photoUrl &&
                  item?.place_review?.user?.photoUrl != ''
                "
                :src="item?.place_review?.user?.photoUrl"
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
              <p>{{ item?.place_review?.user?.fullName }}</p>
              <p class="secondary-text">
                {{ item?.place_review?.user?.email }}
              </p>
            </div>
          </div>
        </template>

        <template v-slot:place_name="{ item }">
          <p class="tertiary-text">{{ item?.place_review?.place?.name }}</p>
        </template>

        <template v-slot:report_category="{ item }">
          <p class="tertiary-text">{{ item?.report_type?.description }}</p>
        </template>

        <template v-slot:review_content="{ item }">
          <p class="tertiary-text line-clamp-1 max-w-[40ch]">
            {{ item?.place_review?.comment }}
          </p>
        </template>

        <template v-slot:reported_by="{ item }">
          <p class="capitalize tertiary-text">
            {{ item?.reporter?.fullName }}
          </p>
        </template>
        <template v-slot:reported_at="{ item }">
          <p class="tertiary-text">
            {{ format(parseISO(item?.createdAt), "LLL dd, yyyy") }}
          </p>
        </template>
        <template v-slot:action="{ item }">
          <Menu>
            <MenuButton
              ><button>
                <Icon name="fontisto:more-v" class="text-xl" /></button
            ></MenuButton>
            <MenuItems
              class="absolute z-50 flex flex-col mt-2 overflow-hidden bg-white rounded-lg shadow-md right-5 w-fit"
            >
              <MenuItem v-if="!item.isAddressed">
                <button
                  class="flex items-center gap-x-3 !text-base px-3 py-2 hover:bg-gray-100"
                  @click="handleAddressReport(item.id)"
                >
                  <icon name="lucide:check-circle" /> Mark as addressed
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  @click="viewPost(item)"
                  class="flex items-center gap-x-3 !text-base px-3 py-2 hover:bg-gray-100"
                >
                  <icon name="lucide:text-select" /> View Post
                </button>
              </MenuItem>
              <MenuItem v-if="item?.place_review?.user?.status !== 'SUSPENDED'">
                <button
                  class="flex items-center text-red-600 gap-x-3 !text-base px-3 py-2 hover:bg-gray-100"
                  @click="
                    showSuspendModal = true;
                    selectedUser = item?.place_review?.user;
                  "
                >
                  <icon name="lucide:user-minus" /> Suspend Account
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </template>
      </h-table>
    </div>
  </div>
</template>
