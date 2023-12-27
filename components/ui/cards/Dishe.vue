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

      <div class="flex items-center space-x-1"></div>
      <div class="flex items-center space-x-4">
        <div class="flex gap-1 items-center">
          <div class="text-xl flex gap-1 text-primary-600">
            <Icon name="uil:star" />
            <Icon name="uil:star" />
            <Icon name="uil:star" />
            <Icon name="uil:star" />
            <Icon name="uil:star" />
          </div>
          <div>(0 / 5)</div>
        </div>

        <!-- dash -->
        <div>
          <p class="text-sheger-gray-100">|</p>
        </div>
        <!-- Like -->
        <div class="flex items-center gap-2 ">
          <Icon name="uil:heart-sign" class="w-6 h-6 text-primary-600" />
          <p class="text-sheger-gray-400">2.5K <span class="">Likes</span></p>
        </div>
        <!-- <img
          class="w-8 h-8 object-contain object-center"
          src="/images/temporary/kuriftu.png"
          alt="place logo"
        /> -->
        <!-- <p cslass="md:text-xl">{{ review.place?.name }}</p> -->
      </div>
    </div>
  </div>
</template>
