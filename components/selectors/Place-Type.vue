<script setup>
import placeTypeQuery from "@/graphql/query/basics/getPlaceTypes.gql";

import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const { notify } = useNotify();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Number,
  },
});

/*---------------------------Place Places---------------------------**/
const items = ref([]);
const search = ref("");
const placeType = ref();

const filter = ref({});
const { onResult, onError, loading } = authListQuery(
  placeTypeQuery,
  filter,
  [{}],
  0,
  5
);

onResultPlace((result) => {
  items.value = result.data?.placeTypes;
});

function makeSearch(value) {
  search.value = value;
}

watch(
  () => props.modelValue,
  (value) => {
    Place.value = value;
  }
);

watch(
  () => placeType,
  (value) => {
    emit("update:modelValue", value);
  }
);

onMounted(() => {
  placeType.value = props.modelValue;
});
</script>

<template>
  <H-SingleSelectWithSearch
    :items="items"
    v-model="placeType"
    @search="makeSearch"
    id="placeType"
    name="placeType"
    label="Place Type"
    :loading="loading"
    rules="required"
  ></H-SingleSelectWithSearch>
</template>
