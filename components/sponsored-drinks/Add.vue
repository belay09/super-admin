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
    <!-- ----------------------Title------------------- -->

    <H-Textfield
      id="drink_title"
      name="drink_title"
      label="Drink title"
      placeholder="Title"
      type="text"
    ></H-Textfield>

    <!-- ----------------------Price------------------- -->

    <H-Textfield
      id="price"
      name="price"
      label="Price"
      type="number"
    ></H-Textfield>

    <!-- ---------------------Description---------------- -->

    <H-Textarea
      id="description"
      name="description"
      label="Description"
      class="pt-4"
    ></H-Textarea>

    <!-- ----------------------Upload Image 1------------------- -->
    <div>
      <img
        src="@/images/temprary/upload-image.png"
        class="w-full py-2"
        alt="upload temprary image"
      />
    </div>

    <!-- ----------------------Upload Image 2------------------- -->
    <div>
      <img
        src="@/images/temprary/upload-image.png"
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
