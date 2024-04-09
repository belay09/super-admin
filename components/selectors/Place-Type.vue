<script setup>
import listQuery from "@/graphql/query/basics/getPlaceTypes.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
  },
});

const { notify } = useNotify();

/*---------------------------Place types data fetch---------------------------**/
const item = ref(props.modelValue);
const items = ref([]);
const { onResult, onError, loading, refetch } = authListQuery(
  listQuery,
  ref({}),
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
  <H-SingleSelect
    id="placeType"
    name="placeType"
    label="Place Type"
    :items="items"
    v-model="item"
    rules="required"
  ></H-SingleSelect>
</template>
