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
        <AdSpace-Add></AdSpace-Add>
      </div>

      <!-- -------------------Ad space list-------------------- -->
      <AdSpace-List></AdSpace-List>
    </div>
  </div>
</template>
