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
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="grid grid-cols-3 items-start">
      <!-- -------------------Add ad space-------------------- -->
      <div class="col-span-1 pr-10 border-r">
        <AdSpace-Add v-if="!showEditPlaceAd"></AdSpace-Add>
        <AdSpace-Edit v-else :id="placeAdId"></AdSpace-Edit>
      </div>

      <!-- -------------------Ad space list-------------------- -->
      <AdSpace-List
        :makeRefetch="makeRefetch"
        @edit="showPlaceEdit"
      ></AdSpace-List>
    </div>
  </div>
</template>
