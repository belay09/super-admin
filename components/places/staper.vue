<script setup>
const curStep = ref(5);


// ---------------------------- Go Back Handler ----------------------------
const goBack = () => {
  if (curStep.value > 0) {
    curStep.value -= 1;
  }
};

// ---------------------------- Go Next Handler ----------------------------
const goNext = () => {
  if (curStep.value < 6) {
    curStep.value += 1;
  }
};

</script>
<template>
  <div class="h-screen">
    <!-- Top -->
    <div class="flex items-center justify-between">
      <div class="text-lg">0% Completed</div>
      <!-- Save Draft -->
      <div
        class="flex items-center gap-3 text-lg border py-2 px-4 rounded-md cursor-pointer hover:bg-primary-600 hover:text-white transition-transform ease-in-out duration-150 active:scale-95"
      >
        <Icon name="uil:save" class="w-6 h-6" />
        Save as Draft
      </div>
    </div>

    <!-- Steper -->
    <div class="flex justify-between my-4 h-20">
      <div
        class="steper-button rounded-tl-lg"
        :class="
          curStep == 0
            ? '!bg-primary-200'
            : curStep > 0
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Basic Info
      </div>
      <div
        class="steper-button"
        :class="
          curStep == 1
            ? '!bg-primary-200'
            : curStep > 1
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Location
      </div>
      <div
        class="steper-button"
        :class="
          curStep == 2
            ? '!bg-primary-200'
            : curStep > 2
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Amenities
      </div>
      <div
        class="steper-button"
        :class="
          curStep == 3
            ? '!bg-primary-200'
            : curStep > 3
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Portfolio
      </div>
      <div
        class="steper-button"
        :class="
          curStep == 4
            ? '!bg-primary-200'
            : curStep > 4
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Menu
      </div>
      <div
        class="steper-button"
        :class="
          curStep == 5
            ? '!bg-primary-200'
            : curStep > 5
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Pictures
      </div>
      <div
        class="steper-button rounded-tr-lg"
        :class="
          curStep == 6
            ? '!bg-primary-200'
            : curStep > 6
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Pricing Plan
      </div>
    </div>
    <div class=" min-h-[70%] border flex flex-col justify-between px-5 py-2">
      <div class="h-full">
        <PlacesFormBasicInfo v-if="curStep == 0"/>
        <PlacesFormLocation v-if="curStep == 1" />
        <PlacesFormAmenities v-if="curStep == 2" />
        <PlacesFormPortfolio v-if="curStep == 3" />
        <PlacesFormMenu v-if="curStep == 4" />
        <PlacesFormPictures v-if="curStep == 5" />
        <PlacesFormPricing v-if="curStep == 6" />
      </div>

      <div class="flex items-center justify-between my-2">
        <div
          class="primary-button border flex items-center gap-4"
          @click="goBack"
        >
          <Icon name="uil:arrow-left" class="w-6 h-6" />
          Previous
        </div>

        <div
          class="primary-button border flex items-center gap-4 text-white bg-primary-600"
          @click="goNext"
          v-if="curStep < 6"
        >
          Save & Proceed
          <Icon name="uil:arrow-right" class="text" />
        </div>
        <div
          class="primary-button border flex items-center gap-4 text-white bg-primary-600"
          @click="goNext"
          v-else
        >
          Finish
          <Icon name="uil:arrow-right" class="text" />
        </div>
      </div>
    </div>
  </div>
</template>
