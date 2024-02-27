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

  const [year, month, day] = dateString
    .split("-")
    .map((part) => parseInt(part, 10));
  const monthName = months[month - 1];
  return `${monthName} ${day}, ${year}`;
}

// Area chart option
var options = {
  series: [
    {
      name: "Views",
      data: rawData ? rawData.map((data) => data.views) : [],
    },
    {
      name: "Engaged",
      data: rawData ? rawData.map((data) => data.engages) : [],
    },
  ],
  chartOptions: {
    chart: {
      id: "realtime",
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    markers: {
      size: 0,
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
  },
};
</script>
<template>
  <div class="box-content p-5 shadow rounded-xl">
    <h2 class="text-xl font-medium text-justify">User Engagement</h2>
    <VueApexCharts
      :options="options.chartOptions"
      :series="options.series"
      type="line"
    />
  </div>
</template>
