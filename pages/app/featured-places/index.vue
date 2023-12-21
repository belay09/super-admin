<script setup>
definePageMeta({
  layout: "home",
});
</script>
<template>
  <div class="px-4">
    <div class="grid grid-cols-3 w-[80%]">
      <UiCardsPlace featured/>
      <UiCardsPlace featured/>
      <UiCardsPlace featured/>
      <UiCardsPlace featured/>
      <UiCardsPlace featured/>
    </div>
    <HPaginate
      v-modeloffset="0"
      :items-per-page="8"
      :total-data="100"
      class="w-full pt-16"
    ></HPaginate>
  </div>
</template>
