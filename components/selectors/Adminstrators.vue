<script setup>
import listQuery from "@/graphql/query/admin/mini.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Object,
  },
});

const { notify } = useNotify();

/**------------------------------City Data Fetch--------------- */
const selectedItem = ref(props.modelValue);
const items = ref([]);
const search = ref("");
const sort = ref([{ fullName: "ASC_NULLS_LAST" }]);
const limit = ref(20);
const offset = ref(0);

/**------------------Filter---------------- */
const filter = computed(() => {
  return {
    userRoles: {
      _or: [
        { userRole: { value: { _eq: "SHEGERADMIN" } } },
        { userRole: { value: { _eq: "ENCODER" } } },
      ],
    },
    status: { _neq: "DELETED" },
  };
});

const { onResult, onError, loading } = authListQuery(
  listQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.usersUsers) {
    items.value = result.data.usersUsers;
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
    id="admin"
    placeholder="Select Reviewer"
    name="reviewer"
    label="Select Reviewer"
    rules="required"
    :loading="loading"
  ></HSingleSelectWithSearch>
</template>
