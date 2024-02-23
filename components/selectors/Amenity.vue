<script setup>
import listQuery from "@/graphql/query/amenities/list.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Object,
  },
});

const { notify } = useNotify();

/**------------------------------Amenity Data Fetch--------------- */
const selectedItem = ref(props.modelValue);
const items = ref([]);
const search = ref("");
const sort = ref([{}]);
const limit = ref(20);
const offset = ref(0);

/**------------------Filter---------------- */
const filter = computed(() => {
  let query = {
    title: {
      _ilike: `%${search.value}%`,
    },
  };
  return query;
});

const { onResult, onError, loading } = authListQuery(
  listQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.basicsAmenities) {
    items.value = result.data.basicsAmenities;
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
    id="amenity"
    placeholder="Select one"
    name="amenity"
    label="Amenity"
    :loading="loading"
    rules="required"
  >
    <template v-slot:header="{ item }">
      <div class="flex items-center gap-x-5">
        <div class="border-r pr-4">
          <CommonSVG
            v-if="item?.icon?.lightIconUrl"
            :url="item?.icon?.lightIconUrl"
          ></CommonSVG>
          <Icon v-else name="mdi:null" class="text-xl" />
        </div>
        <p>{{ item.name }}</p>
      </div>
    </template>
  </HSingleSelectWithSearch>
</template>
