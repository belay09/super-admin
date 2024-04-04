<script setup>
const placeType = ref("");

definePageMeta({
  layout: "engagement",
});
</script>
<template>
  <div>
    <!-- Top -->

    <!-- stepper -->
    {{ placeType }} place type

    <div class="flex justify-between h-20 my-4">
      <div class="stepper-button rounded-tl-lg !bg-primary-300">Basic Info</div>
      <div
        class="stepper-button"
        :class="
          currentStep == 1
            ? '!bg-primary-300'
            : currentStep > 1
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Location
      </div>

      <div
        class="stepper-button"
        :class="
          currentStep == 2
            ? '!bg-primary-300'
            : currentStep > 2
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Menu
      </div>
      <div
        class="stepper-button"
        :class="
          currentStep == 3
            ? '!bg-primary-300'
            : currentStep > 3
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Pictures
      </div>

      <!-- -------------If place type is HOTELS-------------- -->
      <div
        v-if="placeType == 'Hotels'"
        class="stepper-button"
        :class="
          currentStep == 4
            ? '!bg-primary-300'
            : currentStep > 4
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Amenities
      </div>

      <!-- -------------If place type is CATERINGS-------------- -->

      <div
        v-if="placeType == 'Caterings'"
        class="stepper-button"
        :class="
          currentStep == 5
            ? '!bg-primary-300'
            : currentStep > 5
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Portfolio
      </div>
      <div
        class="rounded-tr-lg stepper-button"
        :class="
          currentStep == 6
            ? '!bg-primary-300'
            : currentStep > 6
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Pricing Plan
      </div>
    </div>
    <div class="min-h-[70%] border flex flex-col justify-between px-5 py-2">
      <div class="h-full">
        <PlacesFormBasicInfo v-model="placeType" />
      </div>
    </div>
  </div>
</template>
