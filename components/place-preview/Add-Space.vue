<script setup>
import placeAdsQuery from "@/graphql/query/place-ads/list.gql";
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js";
import addViewCount from "~/composables/add-view-count";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const props = defineProps({
  type: {
    type: String,
    default: "HOTELS",
  },
});

const images = ref([]);
const currentImageIndex = ref(0);

const filter = computed(() => {
  return {
    type: {
      _eq: props.type.toUpperCase(),
    },
  };
});

const placeAd = ref(null);
const { data, loading: adsLoading } = useAsyncQuery(placeAdsQuery, {
  filter: filter.value,
  limit: 1,
});

if (data.value?.placeAds) {
  placeAd.value = data.value.placeAds[0];
}

const clientSideFetchEnabled = computed(() => {
  return placeAd.value;
});

const { onResult, onError, loading } = anonymousListQuery(
  placeAdsQuery,
  filter,
  ref([{}]),
  0,
  1,
  authStore.isLoggedIn,
  clientSideFetchEnabled
);

onResult((result) => {
  if (result.data?.placeAds) {
    placeAd.value = result.data.placeAds[0];
    images.value = placeAd.value.place_ad_medias.map(
      (adMedia) => adMedia?.media.url
    );
  }
});

/**-------------------------View count------------------------ */
if (placeAd.value) {
  getCurrentBrowserFingerPrint().then((fingerprint) => {});
  addViewCount({
    resourceId: placeAd.value?.id,
    isPlace: false,
    fingerPrint:
      authStore?.getUserID ||
      (await getCurrentBrowserFingerPrint())?.toString(),
    type: "PLACE_ADD",
  });
}

// write a code that change the image based on time interval
setInterval(() => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;
}, 5000);
</script>
<template>
  <div
    v-if="placeAd"
    :style="{
      '--image-url': `url(${
        images[currentImageIndex] || '/images/temporary/default-place.png'
      })`,
    }"
    class="relative bg-[image:var(--image-url)] bg-no-repeat bg-center bg-cover w-full transition-opacity duration-300"
  >
    <NuxtLink :to="`/${type}/${placeAd.place?.id}`">
      <div
        class="duration-300 iphone5:p-4 samsg:p-5 md:p-8 xl:p-12 2xl:p-[100px] iphone5:w-[17rem] md:w-[60%] lg:w-[50%] iphone5:h-[17rem] samsg:h-[18rem] md:h-[25rem] xl:w-[42%] lg:h-[30rem] xl:h-[570px] flex flex-col iphone5:space-y-2 md:space-y-6 lg:space-y-10 space-y-12 bg-[url('/images/static/red-background-gradient.png')] bg-no-repeat iphone5:bg-cover bg-right lg:bg-cover rounded-lg"
      >
        <p
          class="text-white iphone5:text-2xl md:text-5xl lg:text-5xl 2xl:text-6xl font-bold line-clamp-2"
        >
          {{ placeAd.slogan }}
        </p>
        <p class="text-white iphone5:text-sm md:text-xl line-clamp-3">
          {{ placeAd.description }}
        </p>
        <div class="flex space-x-4 items-center">
          <img
            :src="placeAd?.place.light_logo?.url"
            class="object-center object-cover w-12 h-12"
            alt="place logo"
          />
          <p class="text-gray-200 md:text-xl">{{ placeAd.place?.name }}</p>
        </div>
      </div>
    </NuxtLink>
    <!-- filter -->
    <div class="lg:absolute w-full xl:border-[#D1D5DB] lg:-bottom-16">
      <PlaceFilter :type="type"></PlaceFilter>
    </div>
  </div>
</template>
