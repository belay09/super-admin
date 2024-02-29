<script setup>
import listQuery from "@/graphql/query/basics/getPlaceTypes.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Number,
  },
});

const { notify } = useNotify();

/*---------------------------Place Places---------------------------**/
const items = ref([]);
const search = ref("");
const item = ref(props.modelValue);

const filter = computed(() => {
  let query = {
    value: {
      _ilike: `%${search.value}%`,
    },
  };

  return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
  listQuery,
  filter,
  [{}],
  0,
  100
);
onResult((result) => {
  if (result.data?.placeTypes) {
    items.value = result.data.placeTypes;
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
    id="placeType"
    name="placeType"
    label="Place Type"
    :loading="loading"
  ></H-SingleSelectWithSearch>
</template>
