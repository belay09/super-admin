<script setup>
import query from "@/graphql/query/basics/subcity.gql";

const props = defineProps({
  modelValue: {
    type: [Object, Function, String],
  },
  name: String,
  placeHolder: {
    type: String,
  },
  region_id: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  prefix: String,
  textClass: String,
  rules: String,
  showLabel: {
    type: Boolean,
    default: true,
  },
  hideDetail: {
    type: Boolean,
    default: false,
  },
  class: {
    type: String,
    default: "text-gray-800",
  },
  labelClass: {
    type: String,
  },
  disableClass: {
    type: String,
    default: "",
  },
});
const emits = defineEmits(["update:modelValue", "update:name"]);
const items = ref([]);
const helper = ref({});
const search = ref("");

const selectedArea = ref(0);
watch(
  selectedArea,
  (newVal) => {
    emits("update:modelValue", newVal);
  }
);

const filter = computed(() => {
  let filter = {
    _and: [],
  };
  filter._and.push({ name: { _ilike: `%${search.value}%` } });
  if (props.region_id) {
    filter._and.push({ cityId: { _eq: props.region_id } });
  }
  return filter;
});

const { onResult, loading, onerror } = authListQuery(query, filter, "", 0, 5);
onResult((result) => {
  if (result.data) {
    items.value = result.data.items;
  }
  if (props.modelValue) {
    helper.value.region_id = props.modelValue;
  }
});

const onSearch = (term) => {
  search.value = term;
};

const getValue = (value) => {
  if (!value) {
    //props.textClass to  used only  for report pages
    if (!props.textClass) return;
    emits("update:modelValue", undefined);
    emits("update:name", undefined);
  } else {
    emits("update:modelValue", value.id);
    emits("update:name", value.name);
  }
};
</script>

<template>
  <H-SingleSelectWithSearch
    v-model="selectedArea"
    v-model:selected="helper.region_id"
    @search="onSearch"
    :items="items"
    @onSelectionFound="getValue"
    :name="name || 'Sub sector'"
    :placeHolder="placeHolder || 'Select'"
    :trailingIcon="!helper.region_id ? 'tabler:chevron-down' : undefined"
    :class="['placeholder-gray-500 font-body text-base py-1', props.class]"
    :loading="loading"
    supporter="h-52"
    :hideDetail="hideDetail"
    :disabled="disabled"
    :disableClass="disableClass"
    :rules="rules"
    returnObject
    class="focus:ring-primary :bg- -secondary :text-white"
  >
    <template #label>
      <div class="pb-4 text-primary-text :text-white">
        <span>Area</span>
      </div></template
    >
  </H-SingleSelectWithSearch>
</template>
