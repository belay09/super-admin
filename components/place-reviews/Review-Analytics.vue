<script setup>
/**-----------------------Imports-------------------- */
import getPlaceStarCount from "@/graphql/query/count/place.gql";
import useNotify from "@/use/notify";

/**---------------Global variables--------------- */
const { notify } = useNotify();

/**---------------------Place Star Count Data fetch------------------- */
const starCount = ref([]);
const route = useRoute();
const filter = ref(route.params.id);
const averageRating = ref(0);
const { onResult, onError } = authListQuery(getPlaceStarCount, filter);
onResult((result) => {
  averageRating.value = result.data?.placeAggregateSummary[0].avgRating;
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
            {{ averageRating?.toFixed(2) }}
          </p>
        </div>
        <div class="my-5">
          <NuxtRating
            class="w-full flex justify-center"
            :rating-value="averageRating"
          ></NuxtRating>
        </div>

        <div class="mb-5">
          <h1 class="font-poppins font-medium text-md capitalize text-center">
            {{ starCount[0].barTotal }} reviews
          </h1>
        </div>
      </div>
      <div class="w-3/4 ml-5">
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
