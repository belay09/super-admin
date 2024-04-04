<script setup>
import list from "@/composables/auth-list-query";
import getPlaceStarCount from "@/graphql/query/count/place.gql";
import useNotify from "@/use/notify";
const { notify } = useNotify();
const starCount = ref([]);
const route = useRoute();
const filter = ref(route.params.id);
const avg = ref(0);
const { onResult, onError } = list(getPlaceStarCount, filter);
onResult((result) => {
  avg.value = result.data?.placeAggregateSummary[0].avgRating;
  if (result.data?.place_review_star_counter) {
    starCount.value = Array.from({ length: 5 }, (_, index) => {
      const existingItem = result.data?.place_review_star_counter.find(
        (item) => item.star === index + 1
      ) || {
        count: 0,
        star: index + 1,
      };

      return {
        rating: existingItem.star,
        barValue: existingItem.count,
        barTotal: result.data?.place_review_star_counter.reduce(
          (total, currentItem) => total + currentItem.count,
          0
        ),
      };
    });
  }
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});
const dummyData = [
  { rating: 1, barValue: 1, barTotal: 10 },
  { rating: 2, barValue: 2, barTotal: 5 },
  { rating: 3, barValue: 3, barTotal: 5 },
  { rating: 4, barValue: 1, barTotal: 10 },
  { rating: 5, barValue: 1, barTotal: 10 },

  // Add more dummy data objects as needed
];

// const props = defineProps({
//   review: {
//     type: Object,
//     required: true,
//   },
// });
</script>
<template>
  <!-- {{ starCount }} -->
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
            {{ avg }}
          </p>
        </div>
        <div class="my-5">
          <Nuxt-Rating
            class="w-full flex justify-center"
            :rating-value="avg"
          ></Nuxt-Rating>
        </div>

        <div class="mb-5">
          <h1 class="font-poppins font-medium text-md capitalize text-center">
            {{ starCount[0].barTotal }} reviews
          </h1>
        </div>
      </div>
      <div class="w-3/4 ml-5">
        <!-- <HRatingBar :rate="1" /> -->
        <ShegerReviews-RatingBar :rate="starCount" />
      </div>
    </div>
    <div class="w-full flex my-5">
      <h1
        class="font-poppins font-medium text-2xl text-gray-700 justify-center-center capitalize mb-2"
      >
        Reviews- {{ starCount[0].barTotal }} reviews
      </h1>
    </div>
  </div>
</template>
