<script setup>
import listQuery from "@/graphql/query/sheger-recommendations/list.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["edit"]);
const props = defineProps({
  makeRefetch: {
    type: Boolean,
    default: false,
  },
});

/***---------------------recommendations data fetch--------------------- */
const sort = ref([{}]);
const recommendations = ref([]);
const limit = ref(6);
const search = ref("");
const offset = ref(0);

/***-------------------------Compute offset------------------------- */

/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      title: {
        _ilike: `%${search.value}%`,
      },
    },
  ];
  return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
  listQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.basicsShegerRecommendations) {
    recommendations.value = result.data.basicsShegerRecommendations;
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

watch(
  () => props.makeRefetch,
  (newVal) => {
    if (newVal) {
      refetch();
    }
  }
);
function onDeleted() {
  refetch();
}
</script>

<template>
  <div class="col-span-2 pl-10">
    <div class="flex items-center justify-end">
      <div class="secondary-flex-row">
        <H-Textfield
          name="search"
          type="text"
          placeholder="Search here"
          trailing-icon="uil:search"
          v-model="search"
        ></H-Textfield>
      </div>
    </div>

    <!-- -------------------Ad space place type total places ------------- -->
    <!-- -------------------Add ad space list-------------------- -->
    <!-- ad-space-default -->
    <div class="pt-6">
      <div class="grid grid-cols-1 gap-6">
        <Ui-Cards-Recommendation-Item
          v-for="recommendation in recommendations"
          :key="recommendation.id"
          :recommendation="recommendation"
          @onDeleted="onDeleted"
          @edit="emit('edit', recommendation.id)"
        >
        </Ui-Cards-Recommendation-Item>
      </div>
    </div>
  </div>
</template>
