<script setup>
import ApexCharts from "apexcharts";

const series = [40];
const chartOptions = {
  chart: {
    type: "radialBar",
    foreColor: "#00ff00",
    width: 380,
    height: 380,
    toolbar: {
      show: false,
    },

    sparkline: {
      enabled: true,
    },
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "70%",
      },
    },
    bar: {
      borderRadius: 10,
      borderRadiusApplication: "around",
    },
  },
  fill: {
    type: "solid",
    colors: ["#00ff00"],
  },
  stroke: {
    lineCap: "round",
  },
  labels: ["40"],
};

const tabs = [
  {
    name: "Overview",
    value: "overview",
  },

  {
    name: "Reviews",
    value: "reviews",
  },
];

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div>
    <!-- Top -->
    <Reviews-Analytics />
    <!-- Tab -->
    <div class="py-8">
      <H-Tab :tabs="tabs" tab-class="text-xl " tab-container-class="gap-x-12">
        <template #overview>
          <div class="py-8"><Reviews-Overview /></div>
        </template>

        <template #reviews>
          <div class="py-6">
            <ShegerReviews-ReviewAnalytics></ShegerReviews-ReviewAnalytics>
            <ShegerReviews-UserReviewList></ShegerReviews-UserReviewList>
          </div>
        </template>
      </H-Tab>
    </div>
  </div>
</template>
<style>
.dp__input {
  line-height: 57px;
  font-size: 14px;
  border-radius: 10px;
}
.dp__theme_light {
  --dp-hover-color: #f0e4e5;
  --dp-primary-color: #d34553;
  --dp-icon-color: #070707;
}
</style>
