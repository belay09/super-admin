<script setup>
import VueApexCharts from "vue3-apexcharts";

const { rawData } = defineProps({
  rawData: { type: Array, required: true },
});

console.log(rawData, "places");
// Area chart option
var options = {
  series: [
    {
      name: "Cafe",
      data: rawData
        ? rawData.map((data) => data?.cafe_visitor_count || 10)
        : [],
      fillColor: "#EB8C87",
      strokeColor: "#C23829",
    },
    {
      name: "Catering",
      data: rawData
        ? rawData.map((data) => data?.catering_visitor_count || 10)
        : [],
      fillColor: "#EB8C87",
      strokeColor: "#C23829",
    },
    {
      name: "Hotel",
      data: rawData
        ? rawData.map((data) => data?.hotel_visitor_count || 10)
        : [],
      fillColor: "#EB8C87",
      strokeColor: "#C23829",
    },
    {
      name: "Restaurant",
      data: rawData
        ? rawData.map((data) => data?.restuarant_visitor_count || 10)
        : [],
      fillColor: "#EB8C87",
      strokeColor: "#C23829",
    },
  ],
  chartOptions: {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    // colors: ["##D5492A", "#DDBD27", "#EF7E4B", "##67AC89"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "40%",
        distributed: false,

        dataLabels: {
          total: {
            enabled: false,
          },
        },
      },
    },
    xaxis: {
      type: "category",
      categories: rawData ? rawData.map((data) => data?.date) : [],
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
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
          w.globals.labels[dataPointIndex] +
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
    <h2 class="text-xl font-medium text-justify">Place Views by place type</h2>
    <VueApexCharts
      :options="options.chartOptions"
      :series="options.series"
      type="bar"
    />
  </div>
</template>
