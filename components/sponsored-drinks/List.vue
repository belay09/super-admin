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

const length = ref(20);
const limit = ref(6);
const offset = ref(0);
</script>

<template>
  <div class="col-span-2 pl-10">
    <div class="flex items-center justify-end">
      <div class="secondary-flex-row">
        <H-Textfield
          name="search"
          type="text"
          placeholder="Search here"
          trailing-icon="uil:search"
        ></H-Textfield>
      </div>
    </div>

    <!-- -------------------Ad space place type total places ------------- -->

    <!-- -------------------Add ad space list-------------------- -->
    <!-- ad-space-default -->
    <div class="pt-6">
      <div class="grid grid-cols-2 gap-6">
        <div class="rounded-lg border" v-for="(item, index) in 6" :key="index">
          <!-- --------------------Card body------------------------ -->
          <div class="flex items-center space-x-5 px-5">
            <!-- ------------------Image section -->
            <img
              src="/images/temporary/default-drink-image.png"
              alt="ad-space-default image"
              class="w-[40%] object-cover object-center rounded-t-lg"
            />

            <!-- ------------------Place name and logo------------------ -->
            <div class="flex flex-col space-y-4 w-[60%]">
              <p class="text-xl font-medium">Negus</p>
              <p class="">None Alcoholic Drink</p>
              <p class="">ETB 50</p>
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

    <div class="mt-5">
      <HPaginate
        v-model:offset="offset"
        :items-per-page="limit"
        :total-data="length"
      />
    </div>
  </div>
</template>
