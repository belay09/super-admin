<script setup>
const props = defineProps({
  videoUrl: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    default: "Sheger review",
  },
});
</script>
<template>
  <div class="w-full">
    <iframe
      width="100%"
      height="400"
      :src="videoUrl"
      :title="title"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</template>
