<script setup>
import reviewAdsQuery from "@/graphql/query/review-ads/list.gql";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const images = ref([]);
const currentImageIndex = ref(0);
const filter = computed(() => {
  return {};
});

const reviewAd = ref(null);
const { data, loading: adsLoading } = useAsyncQuery(reviewAdsQuery, {
  filter: filter.value,
  limit: 1,
});

if (data.value?.reviewAds) {
  reviewAd.value = data.value.reviewAds[0];
}

const clientSideFetchEnabled = computed(() => {
  return reviewAd.value;
});

const { onResult, onError, loading } = anonymousListQuery(
  reviewAdsQuery,
  filter,
  ref([{}]),
  0,
  1,
  authStore.isLoggedIn,
  clientSideFetchEnabled
);

onResult((result) => {
  if (result.data?.reviewAds) {
    reviewAd.value = result.data.reviewAds[0];
    images.value = reviewAd.value.review_ad_medias.map(
      (adMedia) => adMedia?.media.url
    );
  }
});
// write a code that change the image based on time interval
setInterval(() => {
  currentImageIndex.value =
    (currentImageIndex.value + 1) % images.value?.length;
}, 5000);
</script>
<template>
  <div
    v-if="reviewAd"
    class="iphone5:w-[65%] lg:w-1/2 lg:flex-1 flex flex-col space-y-2 md:space-y-3 lg:space-y-6 iphone5:py-8 lg:py-16 iphone5:pl-4 samsg:pl-5 md:pl-8 xl:pl-12 2xl:pl-[100px]"
  >
    <div class="">
      <p class="iphone5:text-2xl lg:text-4xl font-medium lg:pb-2 text-white">
        {{ reviewAd.review?.title }}
      </p>
      <img
        src="/images/static/sheger-review-red-line-writing.png"
        alt=" red decoration"
      />
    </div>
    <p
      class="iphone5:text-sm max-w-3xl xl:text-xl py-3 text-white line-clamp-4"
    >
      {{ reviewAd.review?.description }}
    </p>
  </div>
  <!-- -----------------------Review menu section---------------- -->
  <div class="iphone5:w-[35%] lg:flex-1 h-full">
    <img
      class="w-full h-full object-cover"
      :src="
        images[currentImageIndex] || '/images/temporary/default-food-image.png'
      "
      alt="default"
    />
  </div>
</template>
