<script setup>
/***---------------------Tab--------------------- */

const tabs = [
  {
    name: "Active",
    value: "Active",
    length: 12,
  },
  {
    name: "Suspended",
    value: "Suspended",
    length: 5,
  },
  {
    name: "Deleted",
    value: "Deleted",
    length: 2,
  },
];

const router = useRouter();
const search = ref("");
const items = ref([]);
const sort = ref([{ name: "desc" }]);
const offset = ref(0);
const limit = ref(20);
const length = ref(100);
const headers = [
  {
    text: "Name",
    value: "name",
  },
  {
    text: "Phone number",
    value: "phone_number",
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
  {
    text: "Sign up method",
    value: "sign_up_method",
  },

  {
    text: "created At",
    value: "created_at",
  },
];

items.value = [
  {
    id: 1,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 2,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 3,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 4,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 5,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 6,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 7,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
  {
    id: 8,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Email",
    created_at: "2022 Jan 22",
  },
];

const loading = ref(true);
loading.value = false;
const clickRow = (item) => {
  router.push({
    name: "app-users-roles-edit",
    params: { edit: item.id },
  });
};
</script>

<template>
  <H-Tab :tabs="tabs">
    <template v-slot:tab="{ tabData }">
      <div class="secondary-flex-row">
        <span class="text-xl">{{ tabData.tab?.name }}</span>
        <span
          :class="{ 'bg-primary-100': tabData.isActive }"
          class="px-1.5 py-0.5 rounded-lg border bg-gray-200"
          >{{ tabData.tab?.length }}</span
        >
      </div>
    </template>

    <template #Active>
      <div class="flex flex-col space-y-8 py-6">
        <div class="flex items-center justify-between">
          <p class="text-xl font-medium">Showing 9/12 users</p>
          <H-Limit></H-Limit>
        </div>

        <div class="">
          <h-table
            :headers="headers"
            :items="items"
            v-model:sort="sort"
            :loading="loading"
            @click:row="clickRow"
            supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
            rowBodyStyle="border-b border-gray-300"
            supportHeaderClass="bg-gray-100 border"
            tableHeaderStyle="secondary-border  bg-gray-50"
            tableBodyRowStyle="border py-6"
            rowHeadStyle="secondary-text"
          >
            <template v-slot:name="{ item }">
              <div class="secondary-flex-row">
                <div>
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="user image"
                    class="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <p>{{ item.name }}</p>
                  <p class="secondary-text">selamudev@gmail.com</p>
                </div>
              </div>
            </template>

            <template v-slot:status="{ item }">
              <p
                class="bg-sheger-green-100 rounded-full py-0.5 text-center w-16"
              >
                active
              </p>
            </template>
            <template v-slot:reviews="{ item }">
              <p class="tertiary-text">
                {{ item.reviews }}
              </p>
            </template>
            <template v-slot:bookmarks="{ item }">
              <p class="tertiary-text">
                {{ item.bookmarks }}
              </p>
            </template>
            <template v-slot:sign_up_method="{ item }">
              <p class="tertiary-text">
                {{ item.sign_up_method }}
              </p>
              <p>Verified</p>
            </template>
            <template v-slot:created_at="{ item }">
              <p class="tertiary-text">
                {{ item.created_at }}
              </p>
            </template>
          </h-table>
        </div>
        <div class="mt-5">
          <HPaginate
            v-model:offset="offset"
            :items-per-page="limit"
            :total-data="length"
          />
        </div>
      </div>
    </template>
  </H-Tab>
</template>
