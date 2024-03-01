<script setup>
import getMainLocation from "@/helpers/main-location";
/**-------------------------Globals---------------------- */
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const series = ref([
  {
    name: "Score",
    data: [],
  },
]);
const options = ref({
  chart: {
    type: "area",
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },

  colors: ["#D34553"],

  plotOptions: {
    bar: {
      borderRadius: 10,
      borderRadiusApplication: "around",
    },
  },
});
const updateChart = () => {
  //generate array of random numbers of length 10
  const data = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 100)
  );
  options.value = {
    ...options.value,
    xaxis: {
      categories: Array.from(
        { length: 10 },
        (_, i) => new Date().getFullYear() - i
      ), // array of last 10 years
    },
  };

  series.value = [
    {
      name: "Score",
      data: data,
    },
  ];
};

/***---------------------------Main location---------------------- */
const mainLocation = ref(getMainLocation(props.review?.place?.placeLocations));

onMounted(() => {
  updateChart();
});
</script>

<template>
  <div class="grid grid-cols-4">
    <div class="col-span-3 grid grid-cols-2">
      <!-- -----------------Review Info----------------- -->
      <div class="py-4 flex flex-col gap-3">
        <!-- top -->
        <div class="flex space-x-4">
          <!-- Description -->
          <div class="flex flex-col gap-4">
            <!-- Name and status -->
            <p class="secondary-text">ETB {{ review.price }}</p>
            <div class="flex gap-3">
              <!-- Name -->
              <h1 class="text-xl font-medium">{{ review.title }}</h1>
              <!-- status -->
              <div>
                <div class="bg-sheger-green-100 px-2 py-0.5 rounded-md">
                  <p class="text-sheger-green-600 font-medium">Published</p>
                </div>
              </div>
            </div>

            <!-- -----------------Review rating and like----------- -->
            <CommonReviewRatingLike
              :rating="review.review_aggregate_summary?.avgRating || 0"
              :like="review.review_aggregate_summary?.sumLikes || 0"
              :review="review.reviewReviewsAggregate?.aggregate?.count || 0"
            ></CommonReviewRatingLike>
            <!-- menu update -->
            <div class="flex items-center gap-3">
              <Icon name="carbon:calendar" class="h-5 w-5" />
              <p class="text-sheger-gray-100">Menu last updated: 2 days ago</p>
            </div>
          </div>
        </div>
        <!-- Tags -->
        <div class="flex flex-wrap pb-4 secondary-text">
          <p
            v-for="reviewTag in review.review_tags"
            :key="reviewTag.tag.id"
            class="pr-2"
          >
            #{{ reviewTag.tag.title }}
          </p>
        </div>
      </div>

      <!-- -----------------Place info-------------------- -->
      <div class="px-9 py-3 flex flex-col gap-4 border-x relative">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex gap-3 w-full">
            <!---------------------- Logo--------------------- -->
            <div class="w-20 h-20 self-start shrink-0 mr-1">
              <img
                :src="review?.place?.light_logo?.url"
                alt=""
                class="object-cover w-full h-full rounded-xl"
              />
            </div>
            <div class="flex flex-col gap-2 w-full">
              <h1 class="text-xl font-medium">{{ review?.place?.name }}</h1>
              <!-- ----------------Place status and type--------- -->
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                <div class="bg-sheger-green-100 px-2 py-1 rounded-md">
                  <p class="text-sheger-green-600 font-medium capitalize">
                    {{ review?.place?.status.toLowerCase() }}
                  </p>
                </div>
                <div class="bg-primary-100 px-2 py-1 rounded-md">
                  <p class="text-primary-600 font-medium capitalize">
                    {{ review?.place.type?.toLowerCase() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- -----------------Review rating and like----------- -->
        <CommonReviewRatingLike
          :rating="review?.place?.place_aggregate_summary?.avgRating || 0"
          :like="review?.place?.place_aggregate_summary?.sumLikes || 0"
          :review="review?.place?.placeReviewsAggregate?.aggregate?.count || 0"
        ></CommonReviewRatingLike>
        <!-------------------- Location------------------ -->

        <div v-if="mainLocation" class="flex items-center gap-3">
          <Icon name="carbon:map" class="h-5 w-5" />
          <span class="decoration-sheger_brown-200 underline leading"
            >{{ mainLocation.area?.name }}, {{ mainLocation.city?.name }}</span
          >
        </div>

        <!-- -----------Flag icon----------- -->
        <div
          class="absolute top-0 -left-4 rounded-full border bg-gray-300 w-7 h-7 flex justify-center items-center"
        >
          <Icon name="heroicons:flag-solid" class="" />
        </div>

        <!-- -----------Flag icon----------- -->
        <div
          class="absolute top-0 -right-4 rounded-full border bg-gray-300 w-7 h-7 flex justify-center items-center"
        >
          <Icon name="heroicons:eye-16-solid" class="" />
        </div>
      </div>
    </div>

    <!-- visits -->
    <div class="col-span-1 pl-2">
      <apexchart
        :key="series"
        height="176"
        width="100%"
        :options="options"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
}

.left,
.right {
  width: 150px;
  height: 150px;
  margin-top: 24px;
}

.divider {
  display: block;
  margin: 20px 0;
  background-color: red;

  text-align: center;
  min-height: 2px;
  position: relative;
}
</style>
