<script setup>
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
    text: "Email",
    value: "email",
  },

  {
    text: "Role",
    value: "role",
  },
  {
    text: "Status",
    value: "status",
  },

  {
    text: "Action",
    value: "action",
  },
];

items.value = [
  {
    id: 1,
    name: "Selamu dawit",
    email: "selamudev@gmail.com",
    status: "active",
    role: "Data encoder",

    created_at: "2022 Jan 22",
  },
  {
    id: 2,
    name: "Yontan tesfaye",
    email: "selamudev@gmail.com",
    status: "revoked",
    role: "Administrator",
    created_at: "2022 Jan 22",
  },
  {
    id: 3,
    name: "Selamu dawit",
    email: "selamudev@gmail.com",
    status: "revoked",
    role: "Administrator",
    created_at: "2022 Jan 22",
  },
  {
    id: 4,
    name: "Samuel Noah",
    email: "selamudev@gmail.com",
    status: "active",
    role: "Data encoder",

    created_at: "2022 Jan 22",
  },
];

const loading = ref(true);
loading.value = false;
const clickRow = (item) => {
  //   router.push({
  //     name: "app-users-roles-edit",
  //     params: { edit: item.id },
  //   });
};

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="flex items-center justify-between">
      <p class="text-2xl text-sheger-gray-600 font-medium">2 Administrators</p>
      <button class="primary-button block bg-primary-600">
        <Icon
          name="mingcute:user-add-line"
          class="text-xl text-white"
          color=""
        />
        <span class="text-white">Add Administrator</span>
      </button>
    </div>

    <div class="flex flex-col space-y-8 py-6">
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
          tableHeaderStyle=" bg-gray-200  "
          tableBodyRowStyle="border py-6"
          rowHeadStyle="py-6"
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
              </div>
            </div>
          </template>

          <template v-slot:status="{ item }">
            <p
              v-if="item.status === 'active'"
              class="text-green-600 font-medium"
            >
              Active
            </p>
            <p
              v-if="item.status === 'revoked'"
              class="text-red-600 font-medium"
            >
              Revoked
            </p>
          </template>

          <template v-slot:action="{ item }">
            <button>
              <Icon name="fontisto:more-v" class="text-xl dark:text-white" />
            </button>
          </template>
          <template v-slot:created_at="{ item }">
            <p class="tertiary-text">
              {{ item.created_at }}
            </p>
          </template>
        </h-table>
      </div>
    </div>
  </div>
</template>
