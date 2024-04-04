<script setup>
import getPlaceVisitors from "@/graphql/query/places/visitors.gql";

import useNotify from "@/use/notify";
/**----------------------Globals-------------------------- */

const { notify } = useNotify();

const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});

function generateLastTenDays() {
  const today = new Date();
  const days = [];

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const formattedDate = `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;
    days.unshift(formattedDate); // Add to the beginning of the array to maintain order
  }

  return days;
}
/**-------------------Visit data fetch--------------- */

/*...................Place menus data fetch.............*/
// const filter = computed(() => {
//   let query = {
//     place_id: props.placeId,
//     start_date: "2022-01-01",
//     end_date: "2024-12-31",
//   };
//   return query;
// });

const filter = computed(() => {
  // Get the current date
  const currentDate = new Date();

  // Calculate the start date (10 days before the current date)
  const startDate = new Date(currentDate);
  startDate.setDate(startDate.getDate() - 10);
  const formattedStartDate = startDate.toISOString().split("T")[0];

  // Format the end date as today
  const formattedEndDate = currentDate.toISOString().split("T")[0];

  let query = {
    place_id: props.placeId,
    start_date: formattedStartDate,
    end_date: formattedEndDate,
  };

  return query;
});
const limit = ref(6);
const offset = ref(0);
const sort = ref([{}]);
const place_visitors = ref([]);

const { onResult, onError, loading, fetchMore, refetch } = authListQuery(
  getPlaceVisitors,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.place_visitors) {
    place_visitors.value = result.data?.place_visitors;

    //generate array of random numbers of length 10
    const data = Array.from(
      { length: 10 },
      (_, i) => place_visitors.value[i] || 0
    );

    const newData = place_visitors.value.map((item) => {
      return item.visitor;
    });

    options.value = {
      ...options.value,
      xaxis: {
        categories: generateLastTenDays(),
      },
    };

    series.value = [
      {
        name: "Score",
        data: data,
      },
    ];
  }
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
    toolbar: {
      show: false,
    },
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
</script>

<template>
  <!----------------- visits------------ -->
  <div class="flex w-full col-span-1">
    <apexchart
      :key="series"
      height="220"
      width="500"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
  <pre></pre>
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
