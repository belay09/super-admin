<script setup>
import RadialProgressBar from "vue-radial-progress";
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});
const completedSteps = ref(); // Initial value, will be calculated based on start date
const remainingTime = (startDate) => {
  const now = new Date();
  const startTime = new Date(startDate);
  const timeDifference = startTime - now;
  if (timeDifference > 0) {
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    return days;
  } else {
    const expiredDays = Math.abs(
      Math.floor(timeDifference / (24 * 60 * 60 * 1000))
    );
    return expiredDays; // return negative value for expired days
  }
};

const totalSteps = (endDate, startDate) => {
  const now = new Date();

  const startTime = new Date(startDate);
  const endTime = new Date(endDate);
  const timeDifference = endTime - startTime;
  if (now > endTime) {
    return 0;
  }

  Math.floor(timeDifference / (24 * 60 * 60 * 1000)), "totalsteps";
  return Math.floor(timeDifference / (24 * 60 * 60 * 1000));
};
const getStartColor = (completed, duration) => {
  // ("hello",completed,duration)
  return completed <= duration ? "#22AB4F" : "#FF0000"; // Use different color for expired
};

const getInnerStrokeColor = (completed, duration) => {
  return completed <= duration ? "#ABE3C4" : "#FF0000"; // Use different color for expired
};
getInnerStrokeColor();
getStartColor();

// Function to calculate completed steps dynamically based on the start date
const calculateCompletedSteps = (startDate) => {
  const now = new Date();
  const startTime = new Date(startDate);
  const timeDifference = now - startTime;
  Math.floor(timeDifference / (24 * 60 * 60 * 1000)), "calculateCompletedSteps";
  return Math.floor(timeDifference / (24 * 60 * 60 * 1000));

  // Assuming 1 step is equivalent to 1 day for the example, you may adjust this based on your requirement
};

const getName = (type) => {
  switch (type) {
    case "SEASONAL_PLACE":
      return "SEASONAL PLACE ";
    case "WEEKLY_RECOMMENDED_PLACE":
      return "WEEKLY RECOMMENDED PLACE";
    case "RECENTLY_OPENED_PLACE":
      return "RECENTLY OPENED PLACE";
    // Add more cases as needed
    default:
      return "";
  }
};
</script>

<template>
  <!-- -----------------Icon and name---------------- -->

  <div
    class="flex items-center justify-between rounded-lg bg-white px-1 pb-1 pt-1 border border-gray-200 sm:px-2 sm:py-1"
  >
    <!-- --------------------------Progress And Name---------------- -->
    <div class="flex items-center gap-x-2">
      <!-- -----------------Progress bar---------------- -->
      <div class="px-2.5 py-1 my-auto text-sm font-medium md:mt-2 lg:mt-0">
        <radial-progress-bar
          :key="item.id"
          :diameter="50"
          :strokeWidth="4"
          :innerStrokeWidth="4"
          :completed-steps="calculateCompletedSteps(item.startDate)"
          :startColor="
            getStartColor(
              calculateCompletedSteps(item.startDate),
              totalSteps(item.endDate, item.startDate)
            )
          "
          :stopColor="
            getStartColor(
              calculateCompletedSteps(item.startDate),
              totalSteps(item.endDate, item.startDate)
            )
          "
          :innerStrokeColor="
            getInnerStrokeColor(
              calculateCompletedSteps(item.startDate),
              totalSteps(item.endDate, item.startDate)
            )
          "
          :total-steps="totalSteps(item.endDate, item.startDate)"
        >
          {{ calculateCompletedSteps(item.startDate) }}
        </radial-progress-bar>
      </div>

      <!-- --------------Name----------------- -->

      <div>
        <p class="truncate text-sm font-medium text-gray-900 mb-3">
          {{ getName(item.type) }}
        </p>
        <p
          class="mt-2 text-ellipsis overflow-hidden text-sm font-medium text-gray-500"
        >
          Featured: {{ remainingTime(item.startDate) }} days ago
        </p>
      </div>
    </div>
    <!-- -----------------------Action--------------------- -->

    <div v-if="false">
      <Icon
        name="system-uicons:scale-extend"
        class="text-2xl"
        aria-hidden="true"
      />
    </div>

    <div v-else>
      <Icon
        name="solar:map-point-remove-linear"
        class="text-2xl"
        aria-hidden="true"
      />
    </div>
  </div>
</template>
