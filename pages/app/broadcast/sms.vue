<script setup>
import listQuery from "@/graphql/query/broadcast/sms.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();

/***--------------------------------------Tab--------------------- */
const currentTabIndex = ref(0);
const tabs = ref([
  {
    name: "Published",
    value: "SENT",
    length: 0,
  },
  {
    name: "Draft",
    value: "DRAFT",
    length: 0,
  },
]);

/***---------------------push notifications  data fetch--------------------- */
const items = ref([]);
const limit = ref(100);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const offset = ref(0);

const length = ref(12);

/**-------------------Compute filter---------------- */
const filter = computed(() => {
  let query = {
    status: {
      _eq: tabs.value[currentTabIndex.value].value,
    },
  };

  return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
  listQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.smsNotifications) {
    items.value = result.data.smsNotifications;
    length.value = result.data.total?.aggregate?.count;
    tabs.value[0].length = result.data.published?.aggregate?.count;
    tabs.value[1].length = result.data.draft?.aggregate?.count;
  }
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
provide("refetch", () => {
  refetch();
});
definePageMeta({
  layout: "broadcast",
});
</script>

<template>
  <div class="flex flex-col w-full gap-y-5">
    <!-- ----------------Tab------------------ -->
    <div class="relative">
      <H-Tab v-model:currentTabIndex="currentTabIndex" :tabs="tabs">
        <template v-slot:tab="{ tabData }">
          <div class="secondary-flex-row">
            <span class="text-xl">{{ tabData.tab?.name }}</span>
            <span
              :class="{ 'bg-primary-100': tabData.isActive }"
              class="px-2 py-1 bg-gray-200 rounded-lg"
              >{{ tabData.tab?.length }}</span
            >
          </div>
        </template>
      </H-Tab>
      <BroadCastActions />
    </div>

    <div class="grid flex-grow grid-cols-3 gap-6">
      <Ui-Cards-Sms v-for="item in items" :item="item" :key="item.id" />
    </div>
    <div v-if="!loading && items.length" class="flex flex-col py-6 space-y-8">
      <div class="mt-5">
        <HPaginate
          v-model:offset="offset"
          :items-per-page="limit"
          :total-data="length"
        />
      </div>
    </div>

    <p v-if="!loading && items.length == 0">No Results</p>
  </div>
</template>
