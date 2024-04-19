<script setup>
import listQuery from "@/graphql/query/cousins/list.gql";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Array,
  },
  init: {
    type: Array,
  },
});

/*---------------------------Place or Menu Or Review cousins---------------------------**/
const items = ref();
const search = ref("");
const cousins = ref(props.modelValue);
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

const {
  onResult,
  onError,
  loading,
  refetch,
  fetchMore: fetchMoreTag,
} = authListQuery(listQuery, filter, "", 0, 100);

onResult((result) => {
  if (result.data?.basicsCousins) {
    items.value = result.data?.basicsCousins;
  }
});

function makeSearch(value) {
  search.value = value;
}

watch(
  () => props.modelValue,
  (value) => {
    cousins.value = value;
  }
);

watch(
  () => cousins.value,
  (value) => {
    emit("update:modelValue", value);
  }
);
</script>

<template>
  <h-multi-select-chips
    multiple
    chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
    :items="items"
    :init="init"
    v-model="cousins"
    value="id"
    showBy="name"
    listClass="h-40"
    returnBy="id"
    name="cousin"
    label="Cousins"
    placeholder="Select Cousins"
    @search="makeSearch"
    :loading="loading"
  >
  </h-multi-select-chips>
</template>
