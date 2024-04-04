<script setup>
import getPlacesMediasQuery from "@/graphql/query/medias/placeMedias.gql";
import getPlacesMenuQuery from "@/graphql/query/menu/list.gql";
import addPlaceMediaMutation from "@/graphql/mutations/place/insertPlaceMedias.gql";
import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});
const { notify } = useNotify();
const route = useRoute();
const router = useRouter();

/**----------------------------------Place menu-------------------- */
/*...................Place menus which are attached to review data fetch.............*/
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      placeId: {
        _eq: props.place.id,
      },
    },
    {
      menu_reviewsAggregate: {
        count: {
          predicate: {
            _gt: 0,
          },
        },
      },
    },
  ];

  return query;
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

/*------------------------Upload images----------------------*/

const selectedGalleryImages = ref([]);

const {
  mutate: addPlaceMedia,
  onDone: addPlaceMediaDone,
  loading: addPlaceMediaLoading,
  onError: addPlaceMediaError,
} = authMutation(addPlaceMediaMutation);

const addPlaceMediaHandler = () => {
  const placeMedias = selectedGalleryImages.value.map((imageUrl) => {
    return {
      placeId: route.params.id,
      media: {
        data: {
          url: imageUrl,
        },
      },
    };
  });

  addPlaceMedia({
    obj: placeMedias,
  });
};

addPlaceMediaDone(() => {
  notify({
    title: "Success",
    description: "Images uploaded successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  openUploadFilesModal.value = false;
  mediasRefetch();
  selectedGalleryImages.value = [];
});

addPlaceMediaError((error) => {
  notify({
    title: "Something went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-------------------------------View menu---------------------------- */
function viewMenu() {
  router.push({
    name: "app-places-id",
    params: { id: route.params.id },
    query: { tab: "menu" },
  });
}

const openUploadFilesModal = ref(false);
</script>

<template>
  <HFileUploadModal
    @uploadDone="addPlaceMediaHandler"
    v-model:openModal="openUploadFilesModal"
    v-model="selectedGalleryImages"
    :fileLimit="10"
  />

  <div class="grid grid-cols-4">
    <!----------------------------- Left Side--------------------- -->
    <div
      class="flex flex-col h-screen col-span-3 pr-8 space-y-4 overflow-scroll scroll"
    >
      <div class="flex items-start justify-between">
        <!-- Cuisines -->
        <div v-if="place.cousins">
          <p
            class="text-lg font-medium uppercase dark:text-white xl:capitalize"
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
            class="items-center justify-between hidden py-4 pl-8 pr-4 space-x-6 border rounded-md lg:flex dark:border-sheger_brown-100"
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
                class="object-cover object-center w-24 h-24"
              />
              <p class="text-lg font-medium dark:text-white">
                Sheger <span class="text-primary-600">Gebeta</span>
              </p>
            </div>

            <p
              class="max-w-sm pl-6 border-l text-sheger_brown-200 dark:text-sheger_light_gray-400"
            >
              {{ place.shegerRecommendation?.description }}
            </p>
          </div>
          <!---------------------------- Offer takeouts  if there is no sheger recommendation---------------------->
          <div
            v-else-if="place.offerTakeouts"
            class="justify-between hidden py-4 pl-8 pr-4 space-x-6 border rounded-md lg:flex dark:border-sheger_brown-100"
          >
            <div>
              <img
                src="/images/static/takeout-motor-pizza.png"
                alt="takeout image"
                class=""
              />
            </div>

            <div class="flex flex-col pl-5 space-y-4 border-l">
              <div class="flex items-center justify-between space-x-6">
                <p class="text-lg font-medium primary-text">We offer Takeout</p>
                <button
                  @click="viewMenu"
                  class="flex items-center px-2 py-1 space-x-2 border rounded-md"
                >
                  <Icon
                    name="uil:book-alt"
                    size="24"
                    class="text-lg primary-text"
                  />

                  <p class="text-lg primary-text">View Menu</p>
                </button>
              </div>
              <p class="max-w-md secondary-text">
                Please use the following number to order a delivery from our
                place
              </p>

              <div class="flex flex-wrap items-center space-x-6">
                <div class="flex flex-wrap items-center space-x-4">
                  <Icon
                    name="uil:phone-volume"
                    class="text-2xl dark:text-white"
                  />
                  <p>{{ place.orderPhoneNumber1 }}</p>
                </div>
                <div class="flex flex-wrap items-center space-x-4">
                  <Icon
                    name="uil:phone-volume"
                    class="text-2xl dark:text-white"
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

        <div class="flex my-3 overflow-x-scroll gap-7 scroll w-full">
          <Ui-Cards-Dish v-for="menu in menus" :key="menu.id" :menu="menu" />
        </div>
        <div>
          <!-- ------------------Places contact us and location for large screens--------------------- -->

          <div class="flex justify-between">
            <!-- --------------------------Contact us for large screens---------------- -->
            <div class="flex flex-col space-y-6 w-[40%]">
              <p class="text-2xl font-medium">Location</p>
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
          <div class="flex pt-16 space-x-6">
            <div class="xl:pr-16 2xl:pr-20">
              <h3 class="text-lg font-medium dark:text-white xl:text-2xl">
                Amenities & More
              </h3>
              <div class="grid grid-cols-2 gap-x-6">
                <div
                  v-for="placeAmenity in place.placeAmenities"
                  :key="placeAmenity.id"
                  class="flex items-center py-3 space-x-2 text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >
                  <div class="">
                    <Icon
                      name="heroicons:currency-dollar"
                      class="text-sm text-black md:text-lg dark:text-white"
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
                  class="px-2 text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >
                  08:00 AM - 10 PM
                </p>
              </div>
              <div>
                <p class="dark:text-white">Sunday</p>
                <p
                  class="px-2 text-sheger_brown-200 dark:text-sheger_light_gray-400"
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

    <div class="col-span-1 pl-8 border-l flex flex-col gap-y-4">
      <div @click="viewMenu" class="flex items-center justify-between">
        <p class="text-xl">Sheger Review</p>
        <button class="px-4 py-2 rounded-md secondary-border">View Menu</button>
      </div>
      <!-- ------------------Sheger video------------------ -->

      <ShegerReviewsReviewVideo
        v-if="place.reviews.length > 0"
        :video-url="place.reviews[0].youtubeVideoUrl"
      />

      <!-- --------------Gallery and upload image---------------- -->
      <div>
        <div class="flex items-center justify-between py-6">
          <p class="text-xl">
            Gallery
            <span class="text-sheger-gray-100"
              >({{ medias.length }} Pictures)</span
            >
          </p>
          <button
            @click="openUploadFilesModal = true"
            class="px-4 py-2 rounded-md secondary-border"
          >
            Upload
          </button>
        </div>

        <div
          class="flex flex-col max-h-screen space-y-3 overflow-scroll scroll"
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
