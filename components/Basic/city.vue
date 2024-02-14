<script setup>
import query from "@/graphql/query/basics/cities.gql";

const props = defineProps({
  modelValue: {
    type: [Object, Function, String],
  },
  name: String,
  woreda_id: String,
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
const items = ref([]);
const helper = ref({});
const search = ref("");
const selectedCity = ref(0)

watch(selectedCity, (newVal) => {
    emits("update:modelValue", newVal)
});

const filter = computed(() => {
  let query = {};
  if (search.value) {
    console.log(search.value, "placeTagSearch");
    query.name = {
      _ilike: `%${search.value}%`,
    };
  }
  return query;
});
const { onResult, loading, onerror } = authListQuery(query, filter, "", 0, 5);
onResult((result) => {
  if (result.data) {
    items.value = result.data.basicsCities.map(({ name, id, __typename }) => ({
      id: id,
      name: name,
    }));
  }
  if (props.modelValue) {
    helper.value.region_id = props.modelValue;
  }
});

const onSearch = (term) => {
  console.log(term, "term");
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
    v-model="selectedCity"
    v-model:selected="helper.region_id"
    @search="onSearch"
    :items="items"
    @onSelectionFound="getValue"
    :name="name || 'Sub sector'"
    :placeHolder="placeHolder || 'Select'"
    :trailingIcon="!helper.region_id ? 'tabler:chevron-down' : undefined"
    :class="['placeholder-gray-500 font-body text-base py-3', props.class]"
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
        <span> City </span>
        <!-- <span v-if="rules == 'required'" class="text-red-600">*</span> -->
      </div>
    </template>
  </H-SingleSelectWithSearch>
</template>
