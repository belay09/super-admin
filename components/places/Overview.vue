<script setup>
import getPlacesMediasQuery from "@/graphql/query/medias/placeMedias.gql";
import getPlacesMenuQuery from "@/graphql/query/menu/list.gql";
import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});
const { notify } = useNotify();

/**----------------------------------Place menu-------------------- */
const filter = ref({
  placeId: {
    _eq: props.place.id,
  },
});
const limit = ref(6);
const offset = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const menus = ref([]);
const length = ref(0);

const { onResult, onError, loading, fetchMore } = authListQuery(
  getPlacesMenuQuery,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.menus) {
    menus.value = result.data?.menus;
    length.value = result.data?.menusAggregate?.aggregate?.count;
  }
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

/*...................Place medias data fetch.............*/
const mediasFilter = ref({
  placeId: {
    _eq: props.place.id,
  },
});
const mediasLimit = ref(100);
const mediasOffset = ref(0);
const mediasSort = ref([{}]);
const medias = ref([]);
const {
  onResult: mediasOnResult,
  onError: mediasOnError,
  loading: mediasLoading,
  refetch: mediasRefetch,
} = authListQuery(
  getPlacesMediasQuery,
  mediasFilter,
  mediasSort,
  mediasOffset,
  mediasLimit
);

mediasOnResult((result) => {
  if (result.data?.placeMedias) {
    medias.value = result.data?.placeMedias;
  }
});
mediasOnError((error) => {});

/*------------------------------Map-----------------------------*/

const center = ref([9.010631945576197, 38.76055205651439]);
const zoom = ref(12);

/**
 * Retrieves the center coordinates of a place.
 *
 * @return {Array<number>} The center coordinates of the place.
 */
const getPlaceCenter = () => {
  let mainLocationIndex = props.place?.placeLocations.findIndex(
    (placeLocation) => placeLocation.isMainLocation
  );

  if (mainLocationIndex !== -1) {
    return props.place.placeLocations[mainLocationIndex].location.coordinates;
  } else {
    return [9.010631945576197, 38.76055205651439];
  }
};
center.value = getPlaceCenter();

/**
 * Sets the zoom level to 14 and centers the map at the given coordinates.
 *
 * @param {Array} coordinates - The coordinates to center the map on.
 * @param {number} index - The index of the coordinates in the array.
 */
const flyTo = (coordinates) => {
  console.log(coordinates);
  zoom.value = 14;
  center.value = coordinates;
};

/** --------------------------Mouse hover----------------------- */
</script>

<template>
  <div class="grid grid-cols-4">
    <!----------------------------- Left Side--------------------- -->
    <div
      class="flex flex-col space-y-4 pr-8 col-span-3 h-screen overflow-scroll scroll"
    >
      <div class="flex items-start justify-between">
        <!-- Cuisines -->
        <div v-if="place.cousins">
          <p
            class="text-lg font-medium dark:text-white uppercase xl:capitalize"
          >
            Cuisines
          </p>

          <p
            class="xl:text-lg text-sheger_brown-200 dark:text-sheger_light_gray-400 xl:text-black"
          >
            {{ place.cousins }}
          </p>
        </div>

        <!-- -----------------------------Sheger recommendation, Takeout and House specail menu ---------------- -->
        <div v-if="place.type == 'Hotels'">
          <!----------------- Sheger gebeta recommendation -------------------------------->
          <div
            v-if="!place.shegerRecommendationId"
            class="hidden lg:flex justify-between items-center space-x-6 border dark:border-sheger_brown-100 rounded-md pl-8 pr-4 py-4"
          >
            <div class="flex flex-col items-center space-y-2">
              <p class="text-lg font-medium dark:text-white">
                {{ place.shegerRecommendation?.title }}
              </p>
              <img
                :src="
                  place.shegerRecommendation?.shegerRecommendationBadge?.url
                "
                alt="sheger recommendation image  "
                class="w-24 h-24 object-center object-cover"
              />
              <p class="text-lg font-medium dark:text-white">
                Sheger <span class="text-primary-600">Gebeta</span>
              </p>
            </div>

            <p
              class="pl-6 text-sheger_brown-200 dark:text-sheger_light_gray-400 border-l max-w-sm"
            >
              {{ place.shegerRecommendation?.description }}
            </p>
          </div>
          <!---------------------------- Offer takeouts  if there is no sheger recommendation---------------------->
          <div
            v-else-if="place.offerTakeouts"
            class="hidden lg:flex justify-between space-x-6 border dark:border-sheger_brown-100 rounded-md pl-8 pr-4 py-4"
          >
            <div>
              <img
                src="/images/static/takeout-motor-pizza.png"
                alt="takeout image"
                class=""
              />
            </div>

            <div class="flex flex-col space-y-4 pl-5 border-l">
              <div class="flex justify-between items-center space-x-6">
                <p class="primary-text text-lg font-medium">We offer Takeout</p>
                <button
                  @click="viewMenu"
                  class="flex items-center space-x-2 px-2 py-1 border rounded-md"
                >
                  <Icon
                    name="uil:book-alt"
                    size="24"
                    class="primary-text text-lg"
                  />

                  <p class="primary-text text-lg">View Menu</p>
                </button>
              </div>
              <p class="secondary-text max-w-md">
                Please use the following number to order a delivery from our
                place
              </p>

              <div class="flex items-center space-x-6 flex-wrap">
                <div class="flex items-center space-x-4 flex-wrap">
                  <Icon
                    name="uil:phone-volume"
                    class="dark:text-white text-2xl"
                  />
                  <p>{{ place.orderPhoneNumber1 }}</p>
                </div>
                <div class="flex items-center space-x-4 flex-wrap">
                  <Icon
                    name="uil:phone-volume"
                    class="dark:text-white text-2xl"
                  />
                  <p>{{ place.orderPhoneNumber2 }}</p>
                </div>
              </div>
            </div>
          </div>
          <!-- ------------------------------House Special if there is no sheger recommendation and takeout---------------- -->
          <div v-else-if="place.menus.length > 0">
            <UiCardsMenu :menu="place.menus[0]"></UiCardsMenu>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <p class="text-xl font-medium">Recommended Dishes</p>

        <div class="flex gap-7 overflow-x-scroll my-3 scroll">
          <Ui-Cards-Dish v-for="menu in menus" :key="menu.id" :menu="menu" />
        </div>
        <div>
          <!-- ------------------Places contact us and location for large screens--------------------- -->

          <div class="flex justify-between">
            <!-- --------------------------Contact us for large screens---------------- -->
            <div class="flex flex-col space-y-6 w-[40%]">
              <p class="font-medium text-2xl">Location</p>
              <div class="flex flex-wrap gap-2">
                <Places-Locations
                  :placeLocations="place.placeLocations"
                  @fly-to="flyTo"
                />
              </div>

              <Places-ContactUs :place="place" />
            </div>

            <!-- --------------------------Map for large screens---------------- -->
            <div v-if="place.placeLocations?.length > 0" class="w-[60%]">
              <Places-Map
                :place-locations="place.placeLocations"
                :center="center"
                :zoom="zoom"
              ></Places-Map>
            </div>
          </div>

          <!-- -------------------Amenities and Open hours --------------------- -->
          <div class="flex space-x-6 pt-16">
            <div class="xl:pr-16 2xl:pr-20">
              <h3 class="text-lg font-medium dark:text-white xl:text-2xl">
                Amenities & More
              </h3>
              <div class="grid grid-cols-2 gap-x-6">
                <div
                  v-for="placeAmenity in place.placeAmenities"
                  :key="placeAmenity.id"
                  class="flex items-center space-x-2 py-3 text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >
                  <div class="">
                    <Icon
                      name="heroicons:currency-dollar"
                      class="text-black text-sm md:text-lg dark:text-white"
                    />
                  </div>
                  <p class="text-sm xl:text-lg">
                    {{ placeAmenity.amenity?.title }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex flex-col space-y-6 xl:pl-12 2xl:pl-24 xl:border-l">
              <h3 class="text-lg font-medium dark:text-white lg:text-2xl">
                Open Hours
              </h3>

              <div>
                <p class="dark:text-white">Monday - Saturday</p>
                <p
                  class="text-sheger_brown-200 dark:text-sheger_light_gray-400 px-2"
                >
                  08:00 AM - 10 PM
                </p>
              </div>
              <div>
                <p class="dark:text-white">Sunday</p>
                <p
                  class="text-sheger_brown-200 dark:text-sheger_light_gray-400 px-2"
                >
                  07:00 AM - 12 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!----------------------------- Right Side--------------------- -->

    <div class="col-span-1 pl-8 border-l">
      <div class="flex items-center justify-between">
        <p class="text-xl">Sheger Review</p>
        <button class="secondary-border py-2 px-4 rounded-md">View Menu</button>
      </div>
      <!-- ------------------Sheger video------------------ -->
      <div>
        <img
          src="@/images/temporary/sheger-review-video-small.png"
          class="w-full object-cover object-center"
          alt="Video image"
        />
      </div>

      <!-- --------------Gallery and upload image---------------- -->
      <div>
        <div class="flex items-center justify-between py-6">
          <p class="text-xl">
            Gallery
            <span class="text-sheger-gray-100"
              >({{ medias.length }} Pictures)</span
            >
          </p>
          <button class="secondary-border py-2 px-4 rounded-md">Upload</button>
        </div>

        <div
          class="flex flex-col space-y-3 max-h-screen overflow-scroll scroll"
        >
          <Places-Gallery
            v-for="placeMedia in medias"
            :key="placeMedia.id"
            :media="placeMedia"
            @on-deleted="mediasRefetch()"
          >
          </Places-Gallery>
        </div>
      </div>
    </div>
  </div>
</template>
