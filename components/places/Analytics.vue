<script setup>
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

  colors: ['#D34553'], 

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
  <div class="flex items-center">
    <!-- Pace Info -->
    <div class="py-4 px-8 flex-[30%] flex flex-col gap-3">
      <!-- top -->
      <div class="flex">
        <!-- Logo -->
        <div class="w-20 h-20 mr-1">
          <!-- Image -->
          <img
            src="/images/temporary/Hotel_Logo.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </div>
        <!-- Description -->
        <div class="flex flex-col gap-4">
          <!-- Name and status -->
          <div class="flex gap-3">
            <!-- Name -->
            <h1 class="text-xl">Addis Coffee House</h1>
            <!-- status -->
            <div>
              <div class="bg-sheger-green-100 px-2 py-1">
                <p class="text-sheger-green-600 font-medium">Active</p>
              </div>
            </div>
          </div>
          <!-- review and like -->
          <div class="flex items-center justify-between">
            <!-- Rating -->
            <div class="flex items-center gap-2">
              <Icon name="uil:star" class="w-6 h-6" />
              <p class="">
                3/5 <span class="text-sheger-gray-400">(1,234 reviews)</span>
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
                2.5K <span class="text-sheger-gray-400">Likes</span>
              </p>
            </div>
          </div>
          <!-- menu update -->

          <div class="flex items-center gap-3">
            <Icon name="carbon:calendar" class="h-5 w-5" />
            <p class="text-sheger-gray-400">Menu last updated: 2 days ago</p>
          </div>
        </div>
      </div>
      <!-- Tags -->
      <div class="text-sheger-gray-400">
        <p class="text-sm font-light">
          #Hotel #Restaurant #Bar #Pool #Gym #Spa #Sauna #Massage #Parking
        </p>
      </div>
    </div>

    <!-- Featured on -->
    <div class="flex-[30%] px-9 py-3 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <p class="text-sm text-sheger-gray-100">Featured on</p>
        <p class="text-primary-600 cursor-pointer underline font-medium">
          Configure
        </p>
      </div>
      <div class="flex items-center justify-between border p-3 rounded-lg">
        <div class="flex gap-3">
          <div
            class="w-8 h-8 p-6 border-4 border-green-600 flex items-center rounded-full justify-center"
          >
            5
          </div>
          <div>
            <p class="text-lg font-medium">Weekly Recommendation</p>
            <p class="text-sheger-gray-100">Featured : 2 days ago</p>
          </div>
        </div>
        <div>
          <Icon name="fluent:location-16-regular" class="w-8 h-8" />
        </div>
      </div>
      <div class="flex items-center justify-between border p-3 rounded-lg">
        <div class="flex gap-3">
          <div
            class="w-8 h-8 p-6 border-4 border-primary-500 text-primary-500 flex items-center rounded-full justify-center"
          >
            -27
          </div>
          <div>
            <p class="text-lg font-medium">Seasonal Places</p>
            <p class="text-sheger-gray-100">Featured : 32 days ago</p>
          </div>
        </div>
        <div>
          <Icon name="lets-icons:return" class="w-8 h-8" />
        </div>
      </div>
    </div>
    <!-- visits -->
    <div class="flex-[30%]">
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
  display:flex;
}

.left, .right {
  width: 150px;
  height: 150px;
  margin-top: 24px;
}

.divider {
   display: block;
   margin: 20px 0;
   background-color:red;

   text-align: center;
   min-height: 2px;
   position: relative;
}


</style>
