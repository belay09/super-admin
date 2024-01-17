<script setup>
const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div class="flex gap-4 border border-sheger-gray-200 rounded-lg items-center">
    <!-------------------------------Image-------------------------------->
    <div>
      <img
        src="/images/temporary/default-food-image.png"
        class="w-[229px] h-[285px] object-cover rounded-l-lg"
      />
    </div>

    <!--  -->
    <div>
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
        <!-- Tags -->
        <div class="text-sheger-gray-400 text-sm font-light">
          <p>
            #Hotel #Restaurant #Bar #Pool #Gym #Spa #Sauna #Massage #Parking
          </p>
        </div>
        <div class="flex items-center gap-5">
          <!-- time to prepare  -->
          <div class="flex items-center gap-3">
            <Icon name="wi:time-3" class="h-5 w-5" />
            <p class="text-sheger-gray-400">
              Preparation Time : <span class="text-black">30 Minutes</span>
            </p>
          </div>
        </div>

        <!-- Description -->
        <div class="text-sm text-sheger-gray-100">
          Mauris ac id malesuada sed vulputate. Viverra in tristique fauci velit
          sem lacus ...
        </div>

        <!-- menu update -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <Icon name="uit:calender" class="h-5 w-5" />
            <p class="text-sheger-gray-400">Updated: 2d ago</p>
          </div>
          <div class="flex items-center gap-3">
            <Icon name="uit:calender" class="h-5 w-5" />
            <p class="text-sheger-gray-400">Created: 2d ago</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
