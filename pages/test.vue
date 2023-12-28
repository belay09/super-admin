<script setup>
const svgContent = ref(null);
import axios from "axios";
onMounted(() => {
  axios
    .get("https://upload.wikimedia.org/wikipedia/commons/0/02/SVG_logo.svg")
    .then((response) => {
      svgContent.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<template>
  <div class="w-12 fill-green-500" v-html="svgContent" />
</template>

<style>
svg path {
  @apply dark:fill-white fill-gray-700;
}
</style>
