<script setup>
definePageMeta({
  title: "Dashboard",
  description: "Dashboard page description",
  keywords: "dashboard, page, description",
  layout: "home",
});

// Temp featured analytics
const featuredAnalytics = ref(
  new Array(3).fill({
    title: "Weekly Recommendation",
    value: "15",
    icon: "lucide:calendar-range",
    last_featured: "2 days ago",
  })
);

// temp analytics
const analytics = ref(
  new Array(4).fill({
    title: "Total",
    value: "65,498",
    icon: "lucide:users",
    subject: "Users",
    trend: "up",
    trendValue: "12%",
  })
);
</script>

<template>
  <div>
    <!-- Featured Analytics -->
    <div class="grid grid-cols-4">
      <div class="grid grid-cols-3 col-span-3 gap-5">
        <div
          v-for="(featuredAnalytic, index) in featuredAnalytics"
          :key="index"
          class="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-[10px] shadow-sm"
        >
          <div>
            <Icon :name="featuredAnalytic.icon" class="w-8 h-8" />
          </div>
          <div>
            <h3>{{ featuredAnalytic.title }}</h3>
            <p class="mt-3 text-xs text-sheger-gray-100">
              Last Featured: {{ featuredAnalytic.last_featured }}
            </p>
          </div>
          <div>
            <p class="text-2xl font-medium">
              {{ featuredAnalytic.value }}
            </p>
          </div>
        </div>
      </div>
      <!-- TODO Z: Add range date picker -->
      <div></div>
    </div>

    <!-- Analytics -->
    <div class="grid grid-cols-4 gap-5 mt-10">
      <div
        v-for="(analytic, index) in analytics"
        :key="index"
        class="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-[10px] shadow-sm"
      >
        <div class="flex items-center gap-x-5">
          <div
            class="box-content flex items-center justify-center w-12 h-12 rounded bg-primary-100"
          >
            <Icon :name="analytic.icon" class="w-6 h-6 text-primary-600" />
          </div>
          <div class="space-y-1">
            <h3 class="text-sm text-sheger-gray-400">{{ analytic.title }}</h3>
            <p class="text-3xl font-medium">{{ analytic.value }}</p>
            <p class="text-sm text-sheger-gray-100">
              {{ analytic.subject }}
            </p>
          </div>
        </div>

        <div
          v-if="analytic.trend === 'up'"
          class="flex items-center justify-center w-20 h-8 text-xs text-sheger-green-600 bg-sheger-green-50 rounded-[10px]"
        >
          <Icon :name="'eva:arrow-upward-outline'" class="w-4 h-4" />
          <span class="ml-1">{{ analytic.trendValue }}</span>
        </div>
        <div
          v-else-if="analytic.trend === 'down'"
          class="flex items-center justify-center w-20 h-8 text-xs text-white bg-red-500 rounded-[10px]"
        >
          <Icon :name="'eva:arrow-downward-outline'" class="w-4 h-4" />
          <span class="ml-1">{{ analytic.trendValue }}</span>
        </div>
        <div
          v-else
          class="flex items-center justify-center w-20 h-8 text-xs text-white bg-gray-500 rounded-[10px]"
        >
          <Icon :name="'eva:minus-outline'" class="w-4 h-4" />
          <span class="ml-1">{{ analytic.trendValue }}</span>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-2 gap-5">
      <div v-for="i in 4" :key="i">Chart</div>
    </div>
  </div>
</template>
