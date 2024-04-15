<script setup>
import listQuery from "@/graphql/query/cousins/list.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Number,
  },
});

const { notify } = useNotify();

/***---------------------menu data fetch--------------------- */
const items = ref([]);
const item = ref(props.modelValue);
const limit = ref(100);
const sort = ref([{ id: "ASC_NULLS_LAST" }]);
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
  ];

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
  if (result.data?.basicsCousins) {
    items.value = result.data.basicsCousins;
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
    item.value = value;
  }
);

watch(
  () => item.value,
  (value) => {
    emit("update:modelValue", value);
  }
);
</script>

<template>
  <H-SingleSelectWithSearch
    :items="items"
    v-model="item"
    @search="makeSearch"
    id="cousin"
    name="cousin"
    label="Cousin"
    :loading="loading"
    rules="required"
  ></H-SingleSelectWithSearch>
</template>
