<script setup>
const emit = defineEmits(["makeSearch"]);

const search = ref("");
const priceRange = ref([0, 5000]);
const ambiance = ref(-1);
const dishType = ref(-1);

const makeSearch = () => {
  emit("makeSearch", {
    search: search.value,
    priceRange: priceRange.value,
    ambiance: ambiance.value,
    dishType: dishType.value,
  });
};

/**------------------------Check weather the filters are selected------------------- */

// make the above function computed
const isFilterSelected = computed(() => {
  if (
    search.value != "" ||
    priceRange.value[0] != 0 ||
    priceRange.value[1] != 5000 ||
    ambiance.value != -1 ||
    dishType.value != -1
  ) {
    return true;
  } else {
    return false;
  }
});

/**---------------------------_Clear filter variables------------------------- */
const clearFilter = () => {
  search.value = "";
  priceRange.value = [0, 5000];
  dishType.value = -1;
  ambiance.value = -1;
  makeSearch();
};

const showFilterModal = ref(false);
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
  <!-- ---------------------Filter modal for small screen--------------- -->
  <ModalsModal
    :auto-close="true"
    v-model="showFilterModal"
    v-if="showFilterModal"
  >
    <template #content>
      <div
        class="iphone5:w-full iphone5:px-4 z-20 md:px-5 xl:px-12 lg:max-w-2xl lg:min-w-[36rem] lg:pb-10 mx-auto iphone5:my-8 lg:mt-0 lg:relative flex flex-col space-y-6"
      >
        <!-- --------------------Header  section------------------- -->
        <div class="flex justify-between items-center w-full relative">
          <p class="text-sheger_brown-200 text-xl dark:text-white">Filter</p>
          <button
            @click="showFilterModal = false"
            class="w-10 h-10 absolute iphone5:-right-4 samsg:-right-5"
          >
            <Icon
              name="heroicons:x-mark-20-solid"
              class="font-medium text-2xl dark:text-white"
            />
          </button>
        </div>

        <!-- ---------------------Price range------------------------ -->
        <FilterPriceRange v-model="priceRange" :minValue="0" :maxValue="5000">
        </FilterPriceRange>
        <!-- -----------------------Ambiance------------------------ -->
        <div>
          <div class="flex items-center space-x-2">
            <Icon
              name="uil:mountains-sun"
              class="text-xl text-sheger_brown-200 dark:text-sheger_light_gray-400"
            />
            <p
              class="text-sheger_brown-200 dark:text-sheger_light_gray-400 text-lg"
            >
              Ambiance
            </p>
          </div>

          <FilterAmbiances v-model:model-value="ambiance"></FilterAmbiances>
        </div>

        <!-- -------------------------Dish types--------------- -->
        <div>
          <div class="flex items-center space-x-2">
            <Icon
              name="uil:map-pin-alt"
              class="text-xl text-sheger_brown-200 dark:text-sheger_light_gray-400"
            />

            <p
              class="text-sheger_brown-200 dark:text-sheger_light_gray-400 text-lg"
            >
              Dish Type
            </p>
          </div>

          <FilterCategory
            v-model="dishType"
            type="MENU_CATEGORY"
          ></FilterCategory>
        </div>

        <!-- ---------------------------Filter button---------------- -->

        <button
          :disabled="!isFilterSelected"
          @click="clearFilter"
          class="bg-primary-600 py-3 my-16 px-6 text-center rounded-md font-bold text-white w-full disabled:bg-opacity-80"
        >
          Clear Filter
        </button>
        <button
          @click="
            makeSearch();
            showFilterModal = false;
          "
          class="bg-primary-600 py-3 my-16 px-6 text-center rounded-md font-bold text-white w-full"
        >
          Filter
        </button>
      </div>
    </template>
  </ModalsModal>
  <ClientOnly>
    <!------------------------------ for small screen ---------------------------------->

    <div
      v-if="windowSize && windowSize < 1024"
      class="relative w-full iphone5:px-4 samsg:px-5 md:px-8 lg:hidden"
    >
      <div
        class="flex items-center justify-between space-x-4 iphone5:py-2 px-4 rounded-md bg-white absolute filter-shadow-small border-[#D1D5DB] iphone5:inset-x-4 samsg:inset-x-5 md:inset-x-8 -bottom-10 dark:bg-sheger_brown-300 dark:filter-shadow-small-dark dark:border hover:cursor-pointer"
      >
        <div class="relative flex justify-between items-end w-full">
          <HTextfield
            name="search"
            id="search"
            v-model="search"
            type="text"
            class="border-none text-sheger_brown-200 dark:bg-transparent w-full"
            placeholder="Search here"
            leading-icon="gis:search-map"
            main-div="w-full"
            @search="makeSearch"
          ></HTextfield>
        </div>

        <button class="relative" @click="showFilterModal = true">
          <Icon
            name="heroicons-outline:adjustments"
            class="text-xl cursor-pointer z-30 dark:text-white"
          />
          <span
            v-show="isFilterSelected"
            class="absolute top-0 -right-1 w-3 h-3 rounded-full bg-primary-600"
          ></span>
        </button>
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
          @keyup.enter="makeSearch"
          type="text"
          placeholder="Search Here"
          v-model="search"
          class="py-3 w-40 xl:w-60 2xl:w-80 xl:text-sm 2xl:text-lg border-none pl-8 focus:border-none focus:outline-none focus:ring-0 dark:bg-transparent text-sheger_brown-200 dark:text-sheger_light_gray-400"
        />
        <Icon
          @click="makeSearch"
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
                Dish Type
              </p>
            </div>

            <FilterCategory
              type="MENU_CATEGORY"
              v-model:model-value="dishType"
            ></FilterCategory>
          </div>
        </div>
      </div>

      <!-- ---------------------Section 3.  Button------------------ -->
      <button
        @click="makeSearch"
        class="flex justify-center items-center py-3 px-3 2xl:px-6 space-x-2 rounded-md bg-primary-600 hover:bg-primary-300"
      >
        <Icon name="uil:search-alt" size="20" color="white" class="" />
        <p class="text-sm 2xl:text-lg text-white whitespace-nowrap">Search</p>
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
