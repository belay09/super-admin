<script setup>
// import list from "@/composables/query/list";
// import woreda_query from "@/API/queries/basic/region.gql";

const props = defineProps({
  modelValue: {
    type: [Object, Function, String],
  },
  name: String,
  placeHolder: {
    type: String,
  },
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
const searchTerm = ref("");
const items = ref([]);
const id = ref("");
const selected = ref("");
const helper = ref({});
const search = ref();
const limit = ref(100);
const filter = computed(() => {
  let default_filter = {};
  if (search.value) {
    default_filter.name = { _ilike: `%${search.value}%` };
  }
  return default_filter;
});

const { onResult, loading, onerror } = list(woreda_query, { filter }, "user");
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
  <InputsListSearchSelect
    v-model="helper.region"
    v-model:selected="helper.region_id"
    @search="onSearch"
    :items="items"
    @onSelectionFound="getValue"
    :name="name || 'Region'"
    :placeHolder="placeHolder || 'Select'"
    :trailingIcon="!helper.region_id ? 'tabler:chevron-down' : undefined"
    :class="['placeholder-gray-500 font-body text-base py-1', props.class]"
    :loading="loading"
    supporter="h-52"
    :hideDetail="hideDetail"
    :disabled="disabled"
    :disableClass="disableClass"
    :rules="rules"
    class="focus:ring-primary  :bg- -secondary  :text-white"
  >
    <template #label>
      <div class="pb-4 text-primary-text  :text-white">
        <span>Region city </span>
        <span v-if="rules == 'required'" class="text-red-600">*</span>
      </div></template
    >
  </InputsListSearchSelect>
</template>
