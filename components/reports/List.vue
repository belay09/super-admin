<script setup>
const router = useRouter();

/***--------------------------Table data------------------- */
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
    text: "Report description",
    value: "report_description",
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

items.value = [
  {
    id: 1,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 2,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 3,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 4,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 5,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 6,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 7,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
  },
  {
    id: 8,
    name: "Selamu dawit",
    place_name: "Hilton hotel",
    review_content: "asfgdaedgewt",
    report_category: "False information",
    reported_by: "Samuel Noah",

    status: "Active",

    reported_at: "2022 Jan 22",
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
  <div class="flex flex-col space-y-8 py-6">
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium text-sheger-gray-100">
        Showing 9/12 reports
      </p>
    </div>

    <div class="">
      <h-table
        :headers="headers"
        :items="items"
        v-model:sort="sort"
        :loading="loading"
        @click:row="clickRow"
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
          <p class="bg-sheger-green-100 rounded-full py-0.5 text-center w-16">
            active
          </p>
        </template>

        <template v-slot:review_content="{ item }">
          <p class="tertiary-text">Lorem ipsum dolor, sit amet</p>
        </template>
        <template v-slot:report_description="{ item }">
          <p class="tertiary-text">Lorem ipsum dolor, sit amet</p>
        </template>
        <template v-slot:sign_up_method="{ item }">
          <p class="tertiary-text">
            {{ item.sign_up_method }}
          </p>
          <p>Verified</p>
        </template>
        <template v-slot:reported_at="{ item }">
          <p class="tertiary-text">
            {{ item.reported_at }}
          </p>
        </template>
        <template v-slot:action="{ item }">
          <button>
            <Icon name="fontisto:more-v" class="text-xl dark:text-white" />
          </button>
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
