<script setup>
const placeTypeItems = ref([
  {
    name: "Hotels",
    id: "Hotels",
    total: 3,
  },
  {
    name: "Restaurants",
    id: "Restaurants",
    total: 2,
  },
  {
    name: "Cafes",
    id: "Cafes",
    total: 2,
  },
  {
    name: "Caterings",
    id: "Caterings",
    total: 4,
  },
]);
</script>

<template>
  <div class="col-span-2 pl-10">
    <div class="flex items-center justify-between">
      <h3 class="text-2xl font-medium">4 Ads Running</h3>
      <div class="secondary-flex-row">
        <H-Textfield
          name="search"
          type="text"
          placeholder="Search here"
          trailing-icon="uil:search"
        ></H-Textfield>
        <div class="border rounded-md py-3 px-4">
          <Icon
            name="heroicons-outline:adjustments"
            class="text-2xl cursor-pointer z-30"
          />
        </div>
      </div>
    </div>

    <!-- -------------------Ad space place type total places ------------- -->

    <AdSpacePlaceLength :placeTypeItems="placeTypeItems"></AdSpacePlaceLength>

    <!-- -------------------Add ad space list-------------------- -->
    <!-- ad-space-default -->
    <div class="h-screen overflow-y-scroll scroll">
      <div class="grid grid-cols-2 gap-6">
        <div class="rounded-lg border" v-for="(item, index) in 4" :key="index">
          <!-- -----------------Image section------------------------ -->

          <img
            src="/images/temporary/ad-space-default.png"
            alt="ad-space-default image"
            class="w-full object-cover object-center rounded-t-lg"
          />

          <!-- --------------------Card body------------------------ -->
          <div class="flex flex-col space-y-4 py-4 px-5">
            <!-- ------------------Place name and logo------------------ -->
            <div class="secondary-flex-row">
              <div>
                <img
                  class="w-8 h-8 object-cover"
                  src="/images/temporary/default-place-logo.png"
                  alt="place logo"
                />
              </div>
              <p class="text-xl font-medium">Hilton Hotel</p>
            </div>
            <!-- -------------------Place type----------------------- -->
            <p
              class="bg-primary-100 px-4 rounded-md self-start text-primary-600"
            >
              Hotel
            </p>

            <!-- ------------------Slogan title------------ -->
            <p class="text-xl font-medium">
              Sed ac risus eu facilisis ipsum justo.
            </p>

            <!-- ------------------Description------------- -->
            <p class="secondary-text">
              Facilisis sagittis rutrum morbi risus ipsum sed ullamcorper
              ultrices. Non mi tellus aliquam diam tincidunt aenean vulputate.
            </p>

            <!-- -----------------Date------------------- -->

            <div class="primary-flex-row">
              <Icon class="text-xl" name="uil:calendar-alt"></Icon>
              <p class="secondary-text">01/01/2022</p>
            </div>
          </div>

          <!-- -------------------Card footer------------------------ -->

          <div class="grid grid-cols-2 px-10 py-4 gap-x-4 border-t">
            <!-- ------------------Edit ad space---------------- -->
            <button class="primary-button border justify-center secondary-text">
              <Icon name="ic:round-edit" class="text-xl"></Icon>
              <span> Edit</span>
            </button>

            <!-- ------------------Delete ad space---------------- -->
            <button class="primary-button border justify-center secondary-text">
              <Icon name="uil:trash-alt" class="text-xl"></Icon>
              <span> Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
