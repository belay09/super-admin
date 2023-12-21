<script setup>
definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="grid grid-cols-3 items-start">
      <!-- -------------------Add ad space-------------------- -->
      <div class="col-span-1 pr-10 border-r">
        <SponsoredDrinks-Add></SponsoredDrinks-Add>
      </div>

      <!-- -------------------Ad space list-------------------- -->
      <SponsoredDrinks-List></SponsoredDrinks-List>
    </div>
  </div>
</template>
