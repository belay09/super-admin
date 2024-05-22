<script setup>
import getPlacePortfolios from "@/graphql/query/places/getPlacePortfolios.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["moreImage"]);

const props = defineProps({
  placeId: {
    type: String,
    required: true,
  },
});

/*...................Place portfolios data fetch.............*/
const filter = ref({
  placeId: {
    _eq: props.placeId,
  },
});
const limit = ref(100);
const offset = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const portfolios = ref([]);
const { onResult, onError, loading } = authListQuery(
  getPlacePortfolios,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.portfolios) {
    portfolios.value = result.data?.portfolios;
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
</script>
<template>
  <div class="flex flex-col space-y-8">
    <PlacePreviewPortfolioItem
      v-for="(portfolio, index) in portfolios"
      :key="index"
      :portfolio="portfolio"
      @moreImage="emit('moreImage')"
    />
  </div>
</template>
