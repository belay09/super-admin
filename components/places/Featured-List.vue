<script setup></script>
<template>
  <div class="flex flex-col space-y-8 py-6">
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium">Showing 9/12</p>
      <div class="flex items-center gap-4">
        <button class="primary-button block bg-primary-600">
          <Icon name="lucide:building-2" class="text-xl text-white" color="" />
          <span class="text-white">Feature New</span>
        </button>
        <H-Limit></H-Limit>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-4 w-[85%]">
      <UiCardsPlace featured />
      <UiCardsPlace featured />
      <UiCardsPlace featured />
      <UiCardsPlace featured />
      <UiCardsPlace featured />
    </div>
    <HPaginate
      v-modeloffset="0"
      :items-per-page="8"
      :total-data="100"
      class="w-full pt-16"
    ></HPaginate>
  </div>
</template>
