<script setup>
import getReviewQuery from "@/graphql/query/reviews/item.gql";
import useNotify from "@/use/notify";

/**----------------------------Globals--------------------------- */
const { notify } = useNotify();
const route = useRoute();
const router = useRouter();
/*...................Review detail data fetch.............*/
const review = ref(null);

const {
  onResult: reviewOnResult,
  onError: reviewOnError,
  loading: reviewLoading,
} = authItemQuery(getReviewQuery, route.params.id);

reviewOnResult((result) => {
  if (result.data?.reviewsByPk) {
    review.value = result.data.reviewsByPk;
  }
});

reviewOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

const tabs = ref([
  {
    name: "Overview",
    value: "overview",
  },

  {
    name: "Review",
    value: "reviews",
  },
]);

/**----------------------Assign tab in route to currentTabIndex value--------------- */
function getCurrentTab() {
  if (route.query?.tab && route.query?.tab != "") {
    let index = tabs.value.findIndex(
      (tab) => tab.value.toLowerCase() == route.query?.tab.toLowerCase()
    );
    if (index > -1) {
      return index;
    }
  }
  return 0;
}
const currentTabIndex = ref(getCurrentTab());
watch(currentTabIndex, () => {
  router.push({ query: { tab: tabs.value[currentTabIndex.value].value } });
});

watchEffect(() => {
  if (route.query?.tab && route.query?.tab != "") {
    let index = tabs.value.findIndex(
      (tab) => tab.value.toLowerCase() == route.query?.tab.toLowerCase()
    );
    if (index > -1) {
      currentTabIndex.value = index;
    }
  }
});

definePageMeta({
  layout: "engagement",
});
</script>

<template>
  <div v-if="review">
    <!-- Top -->
    <Sheger-Reviews-Analytics v-if="review" :review="review" />

    <!-- Tab -->
    <div v-if="review" class="py-4 border-t">
      <div class=""><Sheger-Reviews-Overview :review="review" /></div>
    </div>
  </div>
</template>
<style>
.dp__input {
  line-height: 57px;
  font-size: 14px;
  border-radius: 10px;
}
.dp__theme_light {
  --dp-hover-color: #f0e4e5;
  --dp-primary-color: #d34553;
  --dp-icon-color: #070707;
}
</style>
