<script setup>
const router = useRouter();
const props = defineProps({
  type: {
    type: String,
    required: true,
    default: "place",
  },
});

const search = ref("");
const priceRange = ref([0, 5000]);
const ambiance = ref(-1);
const location = ref(-1);

const gotoSearchPage = () => {
  let query = {};
  if (props.type !== "place") {
    query.place = props.type;
  }
  if (search && search.value !== "") {
    query.search = search.value;
  }
  if (ambiance && ambiance.value !== -1) {
    query.ambiance = ambiance.value;
  }
  if (location && location.value !== -1) {
    query.location = location.value;
  }
  if (priceRange && (priceRange.value[0] != 0 || priceRange.value[1] != 5000)) {
    query.priceRange = priceRange.value;
  }

  router.push({
    path: "/search",
    query,
  });
};

/*....................Window resize.............*/
const windowSize = ref(null);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
});
</script>

<template>
  <ClientOnly>
    <!------------------------------ for small screen ---------------------------------->
    <div
      v-if="windowSize && windowSize < 1024"
      class="relative w-full iphone5:px-4 samsg:px-5 md:px-8 lg:hidden"
    >
      <!-- -------------------Search page navigation Link-------------------- -->
      <div
        @click="gotoSearchPage"
        class="flex items-center justify-between space-x-4 iphone5:py-4 md:py-4 px-4 rounded-md bg-white absolute filter-shadow-small border-[#D1D5DB] iphone5:inset-x-4 samsg:inset-x-5 md:inset-x-8 -bottom-10 dark:bg-sheger_brown-300 dark:filter-shadow-small-dark dark:border hover:cursor-pointer"
      >
        <div
          class="relative pb-2 border-b-2 flex justify-between items-end border-b-[#C4C2C2] dark:border-x-sheger_brown-100 w-full"
        >
          <p class="text-sheger_brown-200 dark:text-sheger_light_gray-400">
            Search Here
          </p>
          <Icon
            @click="router.push('/search')"
            name="gis:search-map"
            class="transform text-2xl dark:text-white cursor-pointer"
          />
        </div>

        <Icon
          name="heroicons-outline:adjustments"
          class="text-3xl cursor-pointer z-30 dark:text-white"
        />
      </div>
    </div>

    <!------------------------- for large screen  filter ------------------------------>

    <div
      v-else-if="windowSize && windowSize >= 1024"
      class="hidden lg:flex items-center justify-between px-3 rounded-lg py-6 bg-white filter-shadow dark:filter-shadow-dark dark:shadow-opaq lg:mx-8 xl:mx-12 2xl:mx-24 xl:px-6 border border-[#D1D5DB] dark:bg-sheger_brown-300 dark:border-sheger_brown-100"
    >
      <!-- -------------------Section 1.  Search input ------------------- -->

      <div class="relative border-b">
        <input
          @keyup.enter="gotoSearchPage"
          type="text"
          placeholder="Search Here"
          v-model="search"
          class="py-3 w-40 xl:w-60 2xl:w-80 xl:text-sm 2xl:text-lg border-none pl-8 focus:border-none focus:outline-none focus:ring-0 dark:bg-transparent text-sheger_brown-200 dark:text-sheger_light_gray-400"
        />
        <Icon
          @click="gotoSearchPage"
          name="gis:search-map"
          size="20"
          color="gray"
          class="absolute top-1/2 left-0 transform -translate-y-1/2 cursor-pointer dark:text-sheger_light_gray-400"
        />
      </div>

      <!-- ------------------Section 2.  Filters---------------- -->
      <div class="flex items-start xl:px-2 2xl:px-6">
        <!-- --------------------2.1 Ambiance---------------------- -->
        <div class="flex flex-col space-y-6 xl:px-3 2xl:px-6">
          <div class="flex items-center space-x-2">
            <Icon
              name="uil:mountains-sun"
              size="20"
              class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
            />
            <p
              class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400"
            >
              Ambiances
            </p>
          </div>

          <FilterAmbiances v-model:model-value="ambiance"></FilterAmbiances>
        </div>

        <!-- ---------------------2.2 Price--------------------- -->
        <FilterPriceRange
          v-model="priceRange"
          :minValue="0"
          :maxValue="5000"
          container-class="space-y-5 px-3 xl:px-6 2xl:px-12 w-72 2xl:w-96 border-x border-sheger_brown-100 "
        >
          <template #label>
            <div class="flex items-center space-x-2">
              <Icon
                name="uil:money-stack"
                size="20"
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              />
              <p
                class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >
                Budget Range
              </p>
            </div>
          </template>
        </FilterPriceRange>

        <!-- ---------------------2.3 Location------------------ -->
        <div class="flex items-center space-y-6 px-3 xl:px-6 2xl:px-12">
          <div class="flex flex-col space-y-6">
            <div class="flex items-center space-x-2">
              <Icon
                name="uil:sign-alt"
                size="20"
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              />
              <p
                class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >
                Locations
              </p>
            </div>
            <FilterLocations v-model="location"></FilterLocations>
          </div>
        </div>
      </div>

      <!-- ---------------------Section 3.  Button------------------ -->
      <button
        @click="gotoSearchPage"
        class="flex justify-center items-center py-3 px-3 2xl:px-6 space-x-2 rounded-md bg-primary-600 hover:bg-primary-300"
      >
        <Icon name="uil:search-alt" size="20" color="white" class="" />
        <p class="text-sm 2xl:text-lg text-white whitespace-nowrap">
          Search <span class="capitalize">{{ type }}</span>
        </p>
      </button>
    </div>
    <template #placeholder>
      <div
        class="hidden lg:flex items-center justify-between px-3 rounded-lg py-6 h-32 bg-white filter-shadow dark:filter-shadow-dark dark:shadow-opaq lg:mx-8 xl:mx-12 2xl:mx-24 xl:px-6 border border-[#D1D5DB] dark:bg-sheger_brown-300 dark:border-sheger_brown-100"
      ></div>

      <div
        class="flex h-16 items-center justify-between space-x-4 iphone5:py-4 md:py-4 px-4 rounded-md bg-white absolute filter-shadow-small border-[#D1D5DB] iphone5:inset-x-4 samsg:inset-x-5 md:inset-x-8 -bottom-10 dark:bg-sheger_brown-300 dark:filter-shadow-small-dark dark:border lg:hidden"
      ></div>
    </template>
  </ClientOnly>
</template>
