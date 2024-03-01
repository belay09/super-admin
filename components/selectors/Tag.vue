<script setup>
import tagQuery from "@/graphql/query/tags/mini.gql";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Array,
  },
  init: {
    type: Array,
  },
  type: String,
});

/*---------------------------Place or Menu Or Review Tags---------------------------**/
const items = ref([]);
const search = ref("");
const tags = ref(props.modelValue);
const tagFilter = computed(() => {
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

const {
  onResult: onResultTag,
  onError: onErrorTag,
  loading: loadingTag,
  refetch: refetchTag,
  fetchMore: fetchMoreTag,
} = authListQuery(tagQuery, tagFilter, "", 0, 20);

onResultTag((result) => {
  items.value = result.data?.basicsTags;
});

function makeSearch(value) {
  search.value = value;
}

watch(
  () => props.modelValue,
  (value) => {
    tags.value = value;
  }
);

watch(
  () => tags.value,
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
    v-model="tags"
    value="id"
    showBy="name"
    listClass="h-40"
    returnBy="id"
    name="tag"
    label="Tag"
    placeholder="Select Tag"
    @search="makeSearch"
    :loading="loadingTag"
  >
  </h-multi-select-chips>
</template>
