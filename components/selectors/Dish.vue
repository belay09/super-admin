<script setup>
import menuQuery from "@/graphql/query/menu/mini.gql";

import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: [Array, String, Object],
  },
  place_Id: {
    type: Number,
  },
  init: {
    type: Array,
  },
});

const { notify } = useNotify();

/***---------------------menu data fetch--------------------- */
const menus = ref([]);
const menu = ref(props.modelValue);
const limit = ref(100);
const length = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const offset = ref(0);
const search = ref("");

/**-------------------Compute filter---------------- */
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      title: {
        _ilike: `%${search.value}%`,
      },
    },
    {
      placeId: {
        _eq: props.place_Id,
      },
    },
  ];

  return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
  menuQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.menus) {
    menus.value = result.data.menus;
    length.value = result.data.menusAggregate?.aggregate?.count;
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

function makeSearch(value) {
  search.value = value;
}

watch(
  () => props.modelValue,
  (value) => {
    menu.value = value;
  }
);

watch(
  () => menu.value,
  (value) => {
    emit("update:modelValue", value);
  }
);
</script>

<template>
  <h-multi-select-chips
    multiple
    chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
    :items="menus"
    v-model="menu"
    :init="init"
    value="id"
    showBy="name"
    listClass="h-40"
    returnBy="id"
    name="tag"
    label="Dishes"
    placeholder="Select Dishes"
    @search="makeSearch"
    :loading="loading"
  >
  </h-multi-select-chips>
</template>
