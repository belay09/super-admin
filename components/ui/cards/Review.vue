<script setup>
defineProps({
  featured: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <div class="flex flex-col border w-[397px] p-[25px] rounded-xl m-4 text-sm">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sheger-gray-100">ETB 350</p>
        <p class="text-xl font-medium">Chicken Burger</p>
      </div>
      <!-- Option Icon -->
      <div class="hover:cursor-pointer">
        <Icon name="iwwa:option" class="w-8 h-8" />
      </div>
    </div>
    <!-- Body -->
    <div class="flex flex-col gap-4 my-2">
      <!-- Rating and like -->
      <div class="flex items-center justify-between">
        <!-- Rating -->
        <div class="flex items-center gap-2">
          <Icon name="iwwa:star" class="w-6 h-6" />
          <p class="">
            3/5 <span class="text-sheger-gray-400">(1,234 reviews)</span>
          </p>
        </div>
        <!-- dash -->
        <div>
          <p class="text-sheger-gray-300">|</p>
        </div>
        <!-- Like -->
        <div class="flex items-center gap-2">
          <Icon name="icon-park-solid:like" class="w-6 h-6" />
          <p class="">2.5K <span class="text-sheger-gray-400">Likes</span></p>
        </div>
      </div>
      <div class="flex items-center gap-5">
        <!-- time to prepare  -->
        <div class="flex items-center gap-3">
          <Icon name="wi:time-3" class="h-5 w-5" />
          <p class="text-sheger-gray-400">30 Minutes</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon name="quill:paper" class="h-5 w-5" />
          <p class="text-sheger-gray-400">Food</p>
        </div>
      </div>
      <!-- Tags -->
      <div class="text-sheger-gray-400">
        <p>#Hotel #Restaurant #Bar #Pool #Gym #Spa #Sauna #Massage #Parking</p>
      </div>
      <!-- Description -->
      <div class="text-sm text-sheger-gray-100">
        Mauris ac id malesuada sed vulputate. Viverra in tristique fauci velit
        sem lacus ...
      </div>
      <div class="flex gap-3 w-full">
        <!-- Logo -->
        <div class="w-20 h-20 mr-1">
          <!-- Image -->
          <img
            src="/images/temporary/Hotel_Logo.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </div>
        <!-- Middle -->
        <div class="flex flex-col gap-2 w-full">
          <!-- Name -->
          <div class="flex justify-between">
            <h1 class="text-xl font-medium">Hilton Hotel</h1>
          </div>
          <!-- status -->
          <div class="flex gap-4">
            <div class="bg-sheger-green-100 px-2 py-1">
              <p class="text-sheger-green-600 font-medium">Active</p>
            </div>
            <div class="bg-primary-100 px-2 py-1">
              <p class="text-primary-600 font-medium">Hotel</p>
            </div>
            <div v-if="featured" class="bg-purple-100 px-2 py-1">
              <p class="text-purple-600 font-medium">Recommended</p>
            </div>
          </div>
        </div>
      </div>
      <!-- menu update -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="carbon:calendar" class="h-5 w-5" />
          <p class="text-sheger-gray-400">Last updated: 2 days ago</p>
        </div>
        <div class="cursor-pointer">
          <Icon name="lets-icons:video-light" class="h-8 w-8" />
        </div>
      </div>
    </div>
  </div>
</template>
