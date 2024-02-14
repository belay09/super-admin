<script setup>
const showEditDrink = ref(false);
const drinkId = ref(null);
function showDrinkEdit(id) {
  drinkId.value = id;
  if (showEditDrink.value) {
    showEditDrink.value = false;
    setTimeout(() => {
      showEditDrink.value = true;
    }, 400);
  } else {
    showEditDrink.value = true;
  }
}

const makeRefetch = ref(false);

function changeRefetch() {
  makeRefetch.value = true;
  setTimeout(() => {
    makeRefetch.value = false;
  }, 100);
}

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="grid grid-cols-3 items-start">
      <!-- -------------------Drinks add and edit-------------------- -->
      <div class="col-span-1 pr-10 border-r">
        <SponsoredDrinks-Add
          v-if="!showEditDrink"
          @add="changeRefetch"
        ></SponsoredDrinks-Add>
        <SponsoredDrinks-Edit
          v-else
          :id="drinkId"
          @edit="changeRefetch"
        ></SponsoredDrinks-Edit>

        <!-- ----------------------Add new button------------------- -->
        <button
          v-if="showEditDrink"
          @click="showEditDrink = false"
          class="primary-button bg-primary-600 text-white secondary-border py-3 mt-4 w-full"
        >
          <span>Add New</span>
          <Icon name="heroicons:plus-small-solid" class="text-2xl"></Icon>
        </button>
      </div>

      <!-- -------------------Drinks list-------------------- -->
      <SponsoredDrinks-List
        :make-refetch="makeRefetch"
        @edit="showDrinkEdit"
      ></SponsoredDrinks-List>
    </div>
  </div>
</template>
