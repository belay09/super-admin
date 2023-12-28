<script setup>
const tags = ["Meat Lover", "Spicy", "Chicken"];
</script>
<template>
  <div
    @mouseenter="startTimer"
    @mouseleave="cancelTimer"
    to="#"
    class="relative rounded-xl border block w-[395px] h-[395px]"
  >
    <div class="w-full mx-auto">
      <img
        src="/images/temporary/default-food-image.png"
        class="rounded-t-xl h-[181px] w-full object-cover"
      />
    </div>
    <div class="flex flex-col space-y-2 p-5">
      <div>
        <div class="flex justify-between items-center">
          <p class="text-lg font-medium secondary-text">ETB 300</p>
        </div>
      </div>
      <p class="text-2xl font-medium">Chicken Burger</p>

      <UiTagsPlaceReviewDishTags :tags="tags" />

      <!-- <div class="flex items-center space-x-1"></div> -->
    </div>
  </div>
</template>
