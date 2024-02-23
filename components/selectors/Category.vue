<script setup>
import listQuery from "@/graphql/query/categories/list.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Object,
  },
  type: String,
});

const { notify } = useNotify();

/**------------------------------Amenity Data Fetch--------------- */
const selectedItem = ref(props.modelValue);
const items = ref([]);
const search = ref("");
const sort = ref([{}]);
const limit = ref(20);
const offset = ref(0);

/**------------------Filter---------------- */
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      title: {
        _ilike: `%${search.value}%`,
      },
    },
  ];

  if (props.type) {
    query._and.push({
      type: {
        _eq: props.type,
      },
    });
  }
  return query;
});

const { onResult, onError, loading } = authListQuery(
  listQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.basicsCategories) {
    items.value = result.data.basicsCategories;
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
    selectedItem.value = value;
  }
);

watch(
  () => selectedItem.value,
  (value) => {
    emit("update:modelValue", value);
  }
);
</script>

<template>
  <HSingleSelectWithSearch
    :items="items"
    v-model="selectedItem"
    @search="makeSearch"
    id="category"
    placeholder="Select one"
    name="category"
    label="Category"
    :loading="loading"
    rules="required"
  >
  </HSingleSelectWithSearch>
</template>
