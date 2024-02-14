<script setup>
definePageMeta({
  layout: "home",
});

const showEditPlaceAd = ref(false);
const placeAdId = ref(null);
function showPlaceEdit(id) {
  placeAdId.value = id;

  if (showEditPlaceAd.value) {
    showEditPlaceAd.value = false;
    setTimeout(() => {
      showEditPlaceAd.value = true;
    }, 400);
  } else {
    showEditPlaceAd.value = true;
  }
}

const makeRefetch = ref(false);
function changeRefetch() {
  makeRefetch.value = true;
  setTimeout(() => {
    makeRefetch.value = false;
  }, 100);
}
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="grid grid-cols-3 items-start">
      <!-- -------------------Add ad space-------------------- -->
      <div class="col-span-1 pr-10 border-r">
        <AdSpace-Add @add="changeRefetch" v-if="!showEditPlaceAd"></AdSpace-Add>
        <AdSpace-Edit
          v-else
          :id="placeAdId"
          @edit="changeRefetch"
        ></AdSpace-Edit>
        <!-- ----------------------Add new button------------------- -->
        <button
          v-if="showEditPlaceAd"
          @click="showEditPlaceAd = false"
          class="primary-button bg-primary-600 text-white secondary-border py-3 mt-4 w-full"
        >
          <span>Add New</span>
          <Icon name="heroicons:plus-small-solid" class="text-2xl"></Icon>
        </button>
      </div>

      <!-- -------------------Ad space list-------------------- -->
      <AdSpace-List
        :makeRefetch="makeRefetch"
        @edit="showPlaceEdit"
      ></AdSpace-List>
    </div>
  </div>
</template>
