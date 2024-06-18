<script setup>
import getPlacesMenuQuery from "@/graphql/query/menu/list.gql";
import get_one from "@/composables/get_one";
import hour from "@/graphql/query/places/hour.gql";
/*----------------------------Globals-----------------------------*/

const emit = defineEmits(["setCurrentTab"]);
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});
const openHour = computed(() => props.place.open_hours);
openHour.value = props.place.open_hours

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
      _or: [
        // reviewed menu
        {
          menu_reviewsAggregate: {
            count: {
              predicate: {
                _gt: 0,
              },
            },
          },
        },
        // featured menu
        {
          isFeatured: {
            _eq: true,
          },
        },
      ],
    },
  ];

  return query;
});
const limit = ref(6);
const offset = ref(0);
const sort = ref([
  {
    menu_reviewsAggregate: {
      count: "DESC_NULLS_LAST",
    },
  },
]);
const menus = ref([]);

const { onResult, onError, loading } = anonymousListQuery(
  getPlacesMenuQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.menus) {
    menus.value = result.data?.menus;
  }
});

/*------------------------------Map-----------------------------*/
const center = ref([9.010631945576197, 38.76055205651439]);
const zoom = ref(15);

/**
 * Retrieves the center coordinates of a place.
 *
 * @return {Array<number>} The center coordinates of the place.
 */
const getPlaceCenter = () => {
  let mainLocationIndex = props.place.placeLocations.findIndex(
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
const flyTo = async (coordinates, index) => {
  zoom.value = 15;
  center.value = coordinates;
};

/*------------------------View menu---------------------------*/
function viewMenu() {
  emit("setCurrentTab", "menu");
}

/*....................Window resize.............*/
const windowSize = ref(null);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
});
const id = computed(() => props.place.id);
;

const { onResult: onGetPlaceResult } = get_one(hour);
onGetPlaceResult((result) => {
  console.log("data", data);
  if (result.data?.places_hour) {
    openHour.value = result.data;
  }
});
</script>

<template>
  <div class="flex justify-between space-x-6">
    <!-- --------------Overview  header---------------- -->
    <div class="flex flex-col space-y-4 pt-6">
      <div v-if="place.place_cousins.length > 0">
        <p class="text-lg font-medium dark:text-white uppercase xl:capitalize">
          Cuisines
        </p>

        <div class="flex flex-wrap gap-3">
          <p
            v-for="placeCousin in place.place_cousins"
            :key="placeCousin.id"
            class="text-lg text-sheger_dark_gray-200 space-x-2 bg-gray-200 border px-3 rounded-full"
          >
            {{ placeCousin.cousin?.title }}
          </p>
        </div>
      </div>
      <p class="text-lg font-medium dark:text-white hidden xl:block">
        Recommended Dishes
      </p>
      <p class="text-lg font-medium dark:text-white xl:hidden">
        Popular Dishes
      </p>
    </div>

    <!-- -----------------------------Sheger recommendation, Takeout and House special menu ---------------- -->
    <div>
      <!----------------- Sheger gebeta recommendation -------------------------------->
      <div
        v-if="place.shegerRecommendationId"
        class="hidden lg:flex justify-between items-center space-x-6 border dark:border-sheger_brown-100 rounded-md pl-8 pr-4 py-4"
      >
        <div class="flex flex-col items-center space-y-2">
          <p class="text-lg font-medium dark:text-white whitespace-nowrap">
            {{ place.shegerRecommendation?.title }}
          </p>
          <img
            :src="place.shegerRecommendation?.shegerRecommendationBadge?.url"
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
            Please use the following number to order a delivery from our place
          </p>

          <div class="flex items-center space-x-6 flex-wrap">
            <div class="flex items-center space-x-4 flex-wrap">
              <Icon name="uil:phone-volume" class="dark:text-white text-2xl" />
              <p>{{ place.orderPhoneNumber1 }}</p>
            </div>
            <div class="flex items-center space-x-4 flex-wrap">
              <Icon name="uil:phone-volume" class="dark:text-white text-2xl" />
              <p>{{ place.orderPhoneNumber2 }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- ------------------------------House Special if there is no sheger recommendation and takeout---------------- -->
      <div v-else-if="place.menus.length > 0">
        <PlacePreviewPlaceMenuItemCard
          :menu="place.menus[0]"
        ></PlacePreviewPlaceMenuItemCard>
      </div>
    </div>
  </div>

  <!-- -------------------Places recommended dishes for large screens--------------------- -->

  <div class="w-full overflow-x-scroll scroll my-6">
    <div class="flex space-x-4 lg:space-x-6 w-full">
      <PlacePreviewDishLargeItemCard
        class="dark:bg-sheger_brown-100"
        v-for="menu in menus"
        :key="menu.id"
        :menu="menu"
        :showPlace="false"
      ></PlacePreviewDishLargeItemCard>
    </div>
  </div>

  <!-- ------------------Places contact us and location for large screens--------------------- -->
  <div class="hidden xl:flex justify-between">
    <!-- --------------------------Contact us for large screens---------------- -->
    <div class="flex flex-col space-y-6 w-[40%]">
      <p class="font-medium text-2xl dark:text-white">Location</p>

      <div class="flex flex-wrap gap-2">
        <PlacePreviewLocations
          :place-locations="place.placeLocations"
          @flyTo="flyTo"
        ></PlacePreviewLocations>
      </div>

      <PlacePreviewContactUs :place="place"></PlacePreviewContactUs>
    </div>

    <!-- --------------------------Map for large screens---------------- -->
    <div v-if="place.placeLocations?.length > 0" class="w-[60%]">
      <PlacePreviewMap
        :place-locations="place.placeLocations"
        :center="center"
        :zoom="zoom"
      ></PlacePreviewMap>
    </div>
  </div>

  <!-- -------------------Amenities and Open hours --------------------- -->
  <div
    class="flex flex-col space-y-6 xl:flex-row xl:space-x-6 xl:space-y-0 pt-4 xl:pt-16"
  >
    <div class="xl:pr-16 2xl:pr-20">
      <h3 class="text-lg font-medium dark:text-white xl:text-2xl">
        Amenities & More
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-2 lg:gap-x-4">
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
      <div class="flex-col w-full">
        <h1
          class="mb-5 text-2xl font-medium capitalize font-poppins justify-center-center"
        >
          open hours
        </h1>
        <div class="flex flex-wrap" v-if="place.open_hours && place.open_hours.length">
          <div
            class="w-1/2"
            v-for="hour in place.open_hours.slice(0, 4)"
            :key="hour.day"
          >
            <h1
              class="mb-2 text-lg font-normal capitalize font-poppins justify-center-center"
            >
              {{ hour.day }}
            </h1>
            <div class="flex items-center">
              <h1
                class="mb-2 ml-4 text-sm font-normal text-gray-500 capitalize font-poppins justify-center-center"
              >
                {{ hour.from }} - {{ hour.to }}
              </h1>
              <h1
                class="mb-2 ml-4 text-sm font-normal text-gray-500 capitalize font-poppins justify-center-center"
                :class="
                  hour.status === 'OPEN' ? 'text-green-500' : 'text-red-500'
                "
              >
                {{ hour.status }}
              </h1>
            </div>
          </div>
          <div class="w-1/2" v-for="hour in place.open_hours.slice(4)" :key="hour.day">
            <h1
              class="mb-2 text-lg font-normal capitalize font-poppins justify-center-center"
            >
              {{ hour.day }}
            </h1>
            <div class="flex items-center">
              <h1
                class="mb-2 ml-4 text-sm font-normal text-gray-500 capitalize font-poppins justify-center-center"
              >
                {{ hour.from }} - {{ hour.to }}
              </h1>
              <h1
                class="mb-2 ml-4 text-sm font-normal text-gray-500 capitalize font-poppins justify-center-center"
                :class="
                  hour.status === 'OPEN' ? 'text-green-500' : 'text-red-500'
                "
              >
                {{ hour.status }}
              </h1>
            </div>
          </div>
        </div>
        <div v-else class="w-full flex mt-4 items-center">
          <p class="text-lg text-gray-500 capitalize">open hour not found</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ------------------Places contact us and location for large screens--------------------- -->
  <div
    v-if="place.placeLocations.length > 0"
    class="flex flex-col space-y-4 py-6 xl:hidden"
  >
    <!-- --------------------------Map  for small screen---------------- -->

    <p class="font-medium dark:text-white">
      Location ({{ place.placeLocations.length }})
    </p>
    <div class="flex overflow-x-scroll gap-2">
      <PlacePreviewLocations
        :place-locations="place.placeLocations"
        @flyTo="flyTo"
      ></PlacePreviewLocations>
    </div>
    <div class="w-full">
      <PlacePreviewMap
        :place-locations="place.placeLocations"
        :center="center"
      ></PlacePreviewMap>
    </div>

    <!-- --------------------------Contact us for small screens---------------- -->
    <PlacePreviewContactUs :place="place"></PlacePreviewContactUs>
  </div>
</template>
