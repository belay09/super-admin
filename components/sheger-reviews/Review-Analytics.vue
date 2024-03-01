<script setup>
const dummyData = [
  { rating: 1, barValue: 1, barTotal: 10 },
  { rating: 2, barValue: 2, barTotal: 5 },
  { rating: 3, barValue: 5, barTotal: 5 },
  { rating: 4, barValue: 1, barTotal: 10 },
  { rating: 5, barValue: 1, barTotal: 10 },

  // Add more dummy data objects as needed
];

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});
</script>
<template>
  <div>
    <div class="w-3/4 flex">
      <div
        class="w-1/4 flex-col rounded-lg border-[1px] justify-center items-center"
      >
        <div
          class="font-poppins font-medium text-xl capitalize mb-5 items-center"
        >
          <p
            class="font-poppins font-medium text-gray-700 text-8xl capitalize text-center"
          >
            3
          </p>
        </div>
        <div class="my-5">
          <Nuxt-Rating
            class="w-full flex justify-center"
            :rating-value="3"
          ></Nuxt-Rating>
        </div>

        <div class="mb-5">
          <h1 class="font-poppins font-medium text-md capitalize text-center">
            123 reviews
          </h1>
        </div>
      </div>
      <div class="w-3/4 ml-5">
        <HRatingBar :rate="dummyData" />

        <ShegerReviews-RatingBar :rate="dummyData" />
      </div>
    </div>
    <div class="w-full flex my-5">
      <h1
        class="font-poppins font-medium text-2xl text-gray-700 justify-center-center capitalize mb-2"
      >
        Reviews- 123 reviews
      </h1>
    </div>
  </div>
</template>
