<script setup>
/***---------------------Tab--------------------- */

const placeTypeItems = ref([
  {
    name: "Hotels",
    id: "Hotels",
  },
  {
    name: "Restaurants",
    id: "Restaurants",
  },
  {
    name: "Cafes",
    id: "Cafes",
  },
  {
    name: "Caterings",
    id: "Caterings",
  },
]);
const placeType = ref("");

/**------------------------Place select--------------------- */
const places = ref([
  {
    name: "Hilton Hotel",
    id: "1",
  },
  {
    name: "Addis Coffe house",
    id: "2",
  },
  {
    name: "Blue Sky Hotel",
    id: "3",
  },
  {
    name: "Ethiopia Hotel",
    id: "4",
  },

  {
    name: "Harmony Hotel",
    id: "5",
  },
  {
    name: "Bahir dar Hotel",
    id: "6",
  },
]);
const place = ref("");
</script>

<template>
  <form class="flex flex-col" action="">
    <!-- ----------------Add space or place type----- -->
    <H-SingleSelect
      name="ad_space"
      id="ad_space"
      label="AD Space"
      :items="placeTypeItems"
      v-model="placeType"
    ></H-SingleSelect>

    <!-- ------------------Place---------------- -->
    <H-SingleSelectWithSearch
      :items="places"
      v-model="place"
      id="place"
      name="place"
      label="Place"
    ></H-SingleSelectWithSearch>

    <!-- -----------------Start and End Date -->
    <div class="flex items-center justify-between pt-6 gap-x-6">
      <HDatePicker
        id="start_date"
        name="start_date"
        label="Start Date"
        class="w-full"
        trailing-icon="uil:calender"
        trailing-icon-class="lg:text-sheger-gray-100"
      ></HDatePicker>
      <HDatePicker
        id="end_date"
        name="end_date"
        label="End Date"
        trailing-icon="uil:calender"
        trailing-icon-class="lg:text-sheger-gray-100"
        class="w-full"
      ></HDatePicker>
    </div>

    <!-- ----------------------Slogan------------------- -->

    <H-Textfield
      id="slogan"
      name="slogan"
      label="Slogan"
      placeholder="Write here"
    ></H-Textfield>

    <!-- ---------------------Description---------------- -->

    <H-Textarea
      id="description"
      name="description"
      label="Description"
      class="pt-4"
    ></H-Textarea>

    <!-- ----------------------Upload Image------------------- -->
    <div>
      <img
        src="/images/temporary/upload-image.png"
        class="w-full py-2"
        alt="upload temprary image"
      />
    </div>

    <!-- ----------------------Submit------------------- -->
    <button type="submit" class="primary-button secondary-border py-3 mt-4">
      <Icon name="heroicons:plus-small-solid" class="text-2 xl"></Icon>

      <span>Add</span>
    </button>
  </form>
</template>
