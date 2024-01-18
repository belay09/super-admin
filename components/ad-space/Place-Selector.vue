<script setup>
import placesQuery from "@/graphql/query/places/list.gql";
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
const places = ref([]);
const place = ref(props.modelValue);
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
      name: {
        _ilike: `%${search.value}%`,
      },
    },
    {
      status: {
        _eq: "ACTIVE",
      },
    },
  ];

  return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
  placesQuery,
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
  <Lazy-H-SingleSelectWithSearch
    :items="places"
    v-model="place"
    @search="makeSearch"
    id="place"
    name="place"
    label="Place"
    :loading="loading"
    rules="required"
  ></Lazy-H-SingleSelectWithSearch>
</template>
