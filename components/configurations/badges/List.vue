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
    <div class="pt-6">
      <!-- ---------------------Skeleton loader--------------------- -->
      <div v-if="loading" class="grid grid-cols-1 gap-6">
        <div v-for="i in 4" class="rounded-lg border skeleton-container">
          <!-- Skeleton loader for the card body -->
          <div class="flex items-center space-x-5 px-12">
            <!-- Image skeleton -->
            <div class="skeleton w-[40%] h-36 rounded-t-lg"></div>

            <!-- Place name and logo skeleton -->
            <div class="flex flex-col space-y-4 w-[60%] py-6">
              <!-- Title skeleton -->
              <div class="skeleton w-full h-6 mb-2"></div>
              <!-- Description skeleton -->
              <div class="skeleton w-full h-16"></div>
            </div>
          </div>

          <!-- Skeleton loader for the card footer -->
          <div class="grid grid-cols-2 px-12 py-4 gap-x-4 border-t">
            <!-- Edit button skeleton -->
            <div class="skeleton w-2/3 h-10"></div>
            <!-- Delete button skeleton -->
            <div class="skeleton w-2/3 h-10"></div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 gap-6">
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
