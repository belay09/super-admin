<script setup>
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
      <!-- Pace Info -->
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
            <!-- review and like -->
            <div class="flex items-center space-x-2 justify-between">
              <!-- Rating -->
              <div class="flex items-center gap-2">
                <Icon name="uil:star" class="w-6 h-6" />
                <p class="">
                  3/5 <span class="text-sheger-gray-100">(1,234 reviews)</span>
                </p>
              </div>
              <!-- dash -->
              <div>
                <p class="text-sheger-gray-300">|</p>
              </div>
              <!-- Like -->
              <div class="flex items-center gap-2">
                <Icon name="uil:heart" class="w-6 h-6" />
                <p class="">
                  2.5K <span class="text-sheger-gray-100">Likes</span>
                </p>
              </div>
            </div>
            <!-- menu update -->

            <div class="flex items-center gap-3">
              <Icon name="carbon:calendar" class="h-5 w-5" />
              <p class="text-sheger-gray-100">Menu last updated: 2 days ago</p>
            </div>
          </div>
        </div>
        <!-- Tags -->
        <div class="text-sheger-gray-100">
          <p class="text-sm">
            #Hotel #Restaurant #Bar #Pool #Gym #Spa #Sauna #Massage #Parking
          </p>
        </div>
      </div>

      <!-- Featured on -->
      <div class="px-9 py-3 flex flex-col gap-4 border-x relative">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex gap-3 w-full">
            <!-- Logo -->
            <div class="w-20 h-20 self-start shrink-0 mr-1">
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
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                <div class="bg-sheger-green-100 px-2 py-1 rounded-md">
                  <p class="text-sheger-green-600 font-medium">Active</p>
                </div>
                <div class="bg-primary-100 px-2 py-1 rounded-md">
                  <p class="text-primary-600 font-medium">Restaurant</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Rating and like -->
        <div class="flex items-center gap-x-4 text-sheger-gray-100">
          <!-- Rating -->
          <div class="flex items-center gap-2">
            <Icon name="iwwa:star" class="w-6 h-6" />
            <p class="">3/5 <span class="">(1,234 reviews)</span></p>
          </div>
          <!-- dash -->
          <div>
            <p class="">|</p>
          </div>
          <!-- Like -->
          <div class="flex items-center gap-2">
            <Icon name="tdesign:heart-filled" class="w-6 h-6" />
            <p class="">2.5K <span class="">Likes</span></p>
          </div>
        </div>
        <!-- Location -->
        <div class="flex items-center gap-3">
          <Icon name="carbon:map" class="h-5 w-5" />
          <p class="text-sheger-gray-100">22 Mazoriya, Addis Ababa</p>
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
