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
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 2,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 3,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 4,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 5,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 6,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 7,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
    created_at: "2022 Jan 22",
  },
  {
    id: 8,
    name: "Selamu dawit",
    phone_number: "+25191234567",
    status: "Active",
    reviews: 12,
    bookmarks: 5,
    sign_up_method: "Google",
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

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <!-- ---------search and filter--------- -->
    <div class="relative">
      <div class="flex absolute right-0">
        <div class="secondary-flex-row">
          <H-Textfield
            name="search"
            type="text"
            placeholder="Search here"
            trailing-icon="uil:search"
          ></H-Textfield>
          <div class="border rounded-md py-3 px-4">
            <Icon
              name="heroicons-outline:adjustments"
              class="text-2xl cursor-pointer z-30"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- ----------------Tab------------------ -->
    <div class="pt-10"></div>
    <Users-List></Users-List>
  </div>
</template>
