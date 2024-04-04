<script setup>
/*----------------------------Imports---------------------------*/

import getPlaceQuery from "@/graphql/query/places/item.gql";
import getPlacesMediasQuery from "@/graphql/query/medias/placeMedias.gql";
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth";

/*----------------------------Global Variables---------------------------*/
const { notify } = useNotify();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

/***---------------------Tab--------------------- */
const tabs = ref([
  {
    name: "Overview",
    value: "overview",
  },
  {
    name: "Menu",
    value: "menu",
  },
  {
    name: "Reviews",
    value: "reviews",
  },
  {
    name: "Administrators",
    value: "administrators",
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

/*...................Place detail data fetch.............*/
const place = ref(null);
const {
  onResult: placeOnResult,
  onError: placeOnError,
  loading: placeLoading,
  refetch,
} = authItemQuery(getPlaceQuery, route.params.id);

placeOnResult((result) => {
  if (result.data?.place) {
    place.value = result.data.place;
  }
});

placeOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

provide("refetchPlace", refetch);
/*.................... page meta data.............*/

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div>
    <!-- Top -->
    <Places-Analytics v-if="place" :place="place" />

    <!-- Tab -->
    <div class="py-8" v-if="place">
      <H-Tab
        v-model:current-tab-index="currentTabIndex"
        :tabs="tabs"
        tab-class="text-xl "
        tab-container-class="gap-x-12"
      >
        <template #overview>
          <div class="py-8"><Places-Overview :place="place" /></div>
        </template>
        <template #menu>
          <div class="py-8"><Places-Menus :place-id="place.id" /></div>
        </template>
        <template #administrators>
          <AdministratorsPlaceList></AdministratorsPlaceList>
        </template>
        <template #reviews>
          <div class="py-6">
            <PlaceReviewsReviewAnalytics />
            <PlaceReviews-UserReviewList />
          </div>
        </template>
      </H-Tab>
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
