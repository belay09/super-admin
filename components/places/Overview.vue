<script setup>
/**----------------------------Default place--------------------------------- */

const place = ref({
  id: 1,
  name: "Hilton Hotel",
  placeAmenities: [
    {
      id: 1,
      amenity: {
        title: "Free Wifi",
      },
    },
    {
      id: 2,
      amenity: {
        title: "Free Parking",
      },
    },
    {
      id: 3,
      amenity: {
        title: "Outdoor service",
      },
    },
    {
      id: 4,
      amenity: {
        title: "Take Option",
      },
    },
    {
      id: 5,
      amenity: {
        title: "Children Friendly",
      },
    },
  ],
});

/*------------------------------Map-----------------------------*/
const placeLocations = ref([
  {
    id: 1,
    location: {
      coordinates: [9.010631945576197, 38.76055205651439],
    },
    area: {
      name: "Megegnana",
    },
    isMainLocation: true,
  },
]);

const center = ref([9.010631945576197, 38.76055205651439]);
const zoom = ref(12);

/**
 * Retrieves the center coordinates of a place.
 *
 * @return {Array<number>} The center coordinates of the place.
 */
const getPlaceCenter = () => {
  let mainLocationIndex = placeLocations.value.findIndex(
    (placeLocation) => placeLocation.isMainLocation
  );

  if (mainLocationIndex !== -1) {
    return placeLocations.value[mainLocationIndex].location.coordinates;
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
const flyTo = async (cordinates, index) => {
  zoom.value = 14;
  center.value = cordinates;
};

/** --------------------------Mouse hover----------------------- */
</script>

<template>
  <div class="grid grid-cols-4">
    <!-- --------------Overview  header---------------- -->
    <!-- Left -->
    <div
      class="flex flex-col space-y-4 pr-8 col-span-3 h-screen overflow-scroll scroll"
    >
      <div class="flex items-start justify-between">
        <!-- Cuisines -->
        <div>
          <p class="text-lg font-medium uppercase xl:capitalize">Cuisines</p>

          <p
            class="xl:text-lg text-sheger_brown-200 dark:text-sheger_light_gray-400 xl:text-black"
          >
            Burger, French Fires, Pizza, Italian
          </p>
        </div>

        <!-- Recomendation Bage -->
        <div
          class="flex items-center w-[60%] border border-sheger-gray-500 p-3 rounded-lg"
        >
          <!-- Bage image -->
          <div>
            <img src="/images/static/sheger-recomedation-bage.png" />
          </div>
          <!-- description -->
          <div
            class="w-[70%] text-sm font-light pl-7 border-l border-sheger-gray-500"
          >
            Shager Gebeta recommands this place for sit suspendisse felis enim
            purus. Phasellus pretium ut pharetra senectus. Hendrerit orci nunc
            lorem enim et quis sed phasellus.
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <p class="text-xl font-medium">Recommended Dishes</p>
        <div class="flex gap-7 overflow-x-scroll my-3 scroll">
          <Ui-Cards-Dishe />
          <Ui-Cards-Dishe />
          <Ui-Cards-Dishe />
          <Ui-Cards-Dishe />
        </div>
        <div>
          <!-- ------------------Places contact us and location for large screens--------------------- -->

          <div class="flex justify-between">
            <!-- --------------------------Contact us for large screens---------------- -->
            <div class="flex flex-col space-y-6 w-[40%]">
              <p class="font-medium text-2xl">Location</p>
              <div class="flex flex-wrap gap-2">
                <Places-Locations
                  :placeLocations="placeLocations"
                  @flyTo="flyTo"
                />
              </div>

              <Places-ContactUs />
            </div>

            <!-- --------------------------Map for large screens---------------- -->
            <div v-if="placeLocations?.length > 0" class="w-[60%]">
              <Places-Map
                :place-locations="placeLocations"
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
                  v-for="placeAmenitie in place.placeAmenities"
                  :key="placeAmenitie.id"
                  class="flex items-center space-x-2 py-3 text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >
                  <div class="">
                    <Icon
                      name="heroicons:currency-dollar"
                      class="text-black text-sm md:text-lg dark:text-white"
                    />
                  </div>
                  <p class="text-sm xl:text-lg">
                    {{ placeAmenitie.amenity?.title }}
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

    <!-- right -->
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
            Galler <span class="text-sheger-gray-100">(30 Pictures)</span>
          </p>
          <button class="secondary-border py-2 px-4 rounded-md">Upload</button>
        </div>

        <div
          class="flex flex-col space-y-2 max-h-screen overflow-scroll scroll"
        >
          <Places-Gallery v-for="i in 8" :key="i"> </Places-Gallery>
        </div>
      </div>
    </div>
  </div>
</template>
