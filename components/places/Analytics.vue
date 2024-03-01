<script setup>
/**-------------------------Imports------------------------- */
import formatNumberToShow from "~/helpers/format-number-to-show";
import { formatRelative } from "date-fns";

/**----------------------Globals-------------------------- */
const router = useRouter();
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/**----------------------Place status---------------------- */
function placeStatus(status) {
  if (status == "ACTIVE") {
    return {
      name: "Active",
      class: "bg-sheger-green-100 px-2 py-1",
    };
  } else if (status == "CLOSED") {
    return {
      name: "Closed",
      class: "bg-red-100 px-2 py-1",
    };
  } else if (status == "PENDING") {
    return {
      name: "Pending",
      class: "bg-yellow-100 px-2 py-1",
    };
  } else if (status == "SUSPENDED") {
    return {
      name: "Suspended",
      class: "bg-sheger-gray-100 px-2 py-1",
    };
  }
}

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

onMounted(() => {
  updateChart();
});
</script>

<template>
  <div class="grid grid-cols-4">
    <div class="col-span-3 grid grid-cols-2">
      <!-- ----------------Place Info-------------------- -->
      <div class="py-4 flex flex-col gap-3">
        <div class="flex space-x-4">
          <!---------------------- Logo--------------------- -->
          <div class="w-20 h-20 self-start shrink-0 mr-1">
            <img
              :src="place?.light_logo?.url"
              alt=""
              class="object-cover w-full h-full rounded-xl"
            />
          </div>

          <div class="flex flex-col gap-6">
            <!--------------------Place Name and status------------------- -->
            <div class="flex gap-3">
              <h1 class="text-xl font-medium">{{ place.name }}</h1>
              <div class="px-2 py-1" :class="placeStatus(place.status).class">
                <p class="text-sheger-green-600 font-medium">
                  {{ placeStatus(place.status).name }}
                </p>
              </div>
            </div>

            <!-- -----------------Review rating and like----------- -->
            <CommonReviewRatingLike
              :rating="place?.place_aggregate_summary?.avgRating || 0"
              :like="place?.place_aggregate_summary?.sumLikes || 0"
              :review="place?.placeReviewsAggregate?.aggregate?.count || 0"
            ></CommonReviewRatingLike>

            <!-------------------- Menu update---------------------- -->
            <div class="flex items-center gap-3">
              <Icon name="carbon:calendar" class="h-5 w-5" />
              <p class="text-sheger-gray-100">Menu last updated: 2 days ago</p>
            </div>
          </div>
        </div>
        <!-- ----------------Tags --------------------->
        <div class="flex flex-wrap secondary-text pb-4">
          <p
            v-for="placeTag in place.placeTags"
            :key="placeTag.tag?.id"
            class="pr-2"
          >
            #{{ placeTag.tag?.title }}
          </p>
        </div>
      </div>

      <!-- ----------------------------Featured on------------------- -->
      <div class="px-9 py-3 flex flex-col gap-4 border-x relative">
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

        <div class="flex items-center justify-between">
          <p class="text-sm text-sheger-gray-100">Featured on</p>
          <NuxtLink
            to="/app/featured-places"
            class="text-primary-600 cursor-pointer underline font-medium"
          >
            Configure
          </NuxtLink>
        </div>

        <!------------------------ Featured on cards -------------->
        <Places-FeaturedPlace-Card
          v-for="item in place.featured_places"
          :key="item.id"
          :item="item"
        ></Places-FeaturedPlace-Card>
      </div>
    </div>

    <!----------------- visits------------ -->
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
