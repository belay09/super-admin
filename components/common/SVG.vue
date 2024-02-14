<script setup>
import axios from "axios";

const props = defineProps({
  url: {
    type: [String, null, undefined, Object],
    required: true,
  },
  defaultIcon: {
    type: String,
    default: "",
  },
  svgStyle: {
    type: String,
    default: "",
  },
});

const svgContent = ref(null);

function fetchSvg() {
  if (props.url) {
    axios
      .get(props.url)
      .then((response) => {
        svgContent.value = response.data;
        svgContent.value = response.data.replace(
          "<svg",
          '<svg style="width: 20px; height: 20px;"'
        );
      })
      .catch((error) => {});
  } else {
    svgContent.value = null;
  }
}
watch(
  () => props.url,
  (newValue) => {
    fetchSvg();
  }
);

onMounted(() => {
  fetchSvg();
});
</script>

<template>
  <div
    :class="svgStyle"
    v-if="svgContent"
    class="w-6 h-6"
    v-html="svgContent"
  />
  <Icon :class="svgStyle" v-else :name="defaultIcon" class="w-12" />
</template>

<style scoped>
svg path {
  @apply dark:fill-white fill-gray-700 w-6 h-6;
}
svg {
  @apply w-6 h-6;
}
</style>
