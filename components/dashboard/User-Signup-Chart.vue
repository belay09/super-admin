<script setup>
import VueApexCharts from "vue3-apexcharts";

const { rawData } = defineProps({
  rawData: { type: Array, required: true },
});

function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  console.log("dateString", dateString);

  const [year, month, day] = dateString
    .split("-")
    .map((part) => parseInt(part, 10));
  const monthName = months[month - 1];
  return `${monthName} ${day}, ${year}`;
}

// Area chart option

var options = {
  chart: {
    height: 280,
    type: "area",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  series: [
    {
      name: "Signup",
      data: rawData ? rawData.map((data) => data.count) : [],
    },
  ],
  stroke: {
    show: false,
  },
  fill: {
    colors: ["#D34553"],
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 1,
      stops: [100, 100, 100],
    },
  },
  xaxis: {
    type: "category",
    categories: rawData ? rawData.map((data) => formatDate(data.date)) : [],
  },
  yaxis: {
    show: false,
  },
  tooltip: {
    enabled: true,
    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      console.log(w);
      return (
        '<div class="tooltip-container">' +
        "<div class='tooltip-value'>" +
        series[seriesIndex][dataPointIndex] +
        " " +
        w.globals.seriesNames[seriesIndex] +
        "</div>" +
        "<div class='tooltip-date'>" +
        w.globals.categoryLabels[dataPointIndex] +
        "</div>" +
        "</div>"
      );
    },
  },
};
</script>
<template>
  <div class="box-content p-5 shadow rounded-xl">
    <h2 class="text-xl font-medium text-justify">User Signups</h2>
    <VueApexCharts :key="rawData" :options="options" :series="options.series" />
  </div>
</template>

<style>
.tooltip-container {
  padding: 10px 20px;
  background-color: #fff;
}
.tooltip-value {
  color: #d34553;
  font-size: 16px;
  font-weight: 500;
}
</style>
