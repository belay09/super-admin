<script setup>
// const props = defineProps({
//   review: {
//     type: Object,
//     required: true,
//   },
// });

const review = ref({
  id: 1,
  description:
    "Mauris ac id malesuada sed vulputate. Viverra in tristique faucibus netus velit sem lacus enim eget. Ipsum at nisl eget posuere nisi nec. ",
  sides: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ",
  timeToPrepare: "10",
  review_drink: {
    drink: {
      title: "Negus",
      description: "No Alcoholic Drink",
      price: "50.00",
    },
  },
});
</script>

<template>
  <!-- -------------------------About review--------------------- -->
  <div class="flex flex-col space-y-6 pt-2">
    <!-- ---------------------Review description----------------- -->
    <p class="max-w-2xl secondary-text">
      {{ review.description }}
    </p>

    <!-- --------------------Review sides---------------------- -->
    <div v-if="review.sides">
      <p class="text-2xl py-2 dark:text-white font-medium">Sides</p>
      <p class="dark:text-sheger_light_gray-400">
        {{ review.sides }}
      </p>
    </div>

    <!-- -------------------------Review prepare time------------- -->
    <div v-if="review.timeToPrepare">
      <p class="text-2xl dark:text-white font-medium">Times to prepare</p>
      <p class="dark:text-sheger_light_gray-400">
        {{ review.timeToPrepare }} Minutes
      </p>
    </div>

    <!-- -------------------------Review Drink------------------- -->
    <div v-if="review.review_drink" class="w-full">
      <p class="text-2xl my-4 dark:text-white font-medium">Goes well with</p>
      <div class="flex space-x-4 xl:space-x-6 items-center">
        <img
          class="object-cover w-72"
          src="/images/temporary/default-drink-image.png"
          alt="Negus drink"
        />
        <div class="flex flex-col iphone5:space-y-2 xl:space-y-4">
          <h3 class="font-medium text-4xl dark:text-white">
            {{ review.review_drink?.drink?.title }}
          </h3>
          <p class="dark:text-sheger_light_gray-400">
            {{ review.review_drink?.drink?.description }}
          </p>
          <p class="dark:text-sheger_light_gray-400">
            ETB {{ review.review_drink?.drink?.price }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
