<script setup>
import listQuery from "@/graphql/query/broadcast/push-notification-categories.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: String,
  },
});

const { notify } = useNotify();

/*---------------------------Place Places---------------------------**/
const items = ref([]);
const search = ref("");
const item = ref(props.modelValue);

const filter = computed(() => {
  let query = {
    name: {
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
  if (result.data?.broadcastMessageCategories) {
    items.value = result.data.broadcastMessageCategories;
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
    id="category"
    name="category"
    rules="required"
    label="Category"
    :loading="loading"
  ></H-SingleSelectWithSearch>
</template>
