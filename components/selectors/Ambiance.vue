<script setup>
import query from "@/graphql/query/ambiances/list.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Number,
  },
});

const { notify } = useNotify();

/***---------------------Place data fetch--------------------- */
const items = ref([]);
const limit = ref(20);
const length = ref(0);
const sort = ref([{}]);
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
  query,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.places) {
    places.value = result.data.places;
    length.value = result.data.placesAggregate?.aggregate?.count;
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
    place.value = value;
  }
);

watch(
  () => place.value,
  (value) => {
    emit("update:modelValue", value);
  }
);
</script>

<template>
  <H-SingleSelectWithSearch
    :items="places"
    v-model="place"
    @search="makeSearch"
    id="place"
    name="place"
    label="Place"
    :loading="loading"
    rules="required"
  ></H-SingleSelectWithSearch>
</template>
