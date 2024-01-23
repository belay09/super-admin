<script setup>
const url = ref(
  "https://upload.wikimedia.org/wikipedia/commons/0/02/SVG_logo.svg"
);
const showUploadImageModal = ref(false);
</script>

<template>
  <!-- <HFileUploadSingleImg name="upload" @upload="uploadImage" :loading="false" /> -->

  <CommonUploadSvg
    v-if="showUploadImageModal"
    folder=""
    v-model:model-value="url"
    v-model:showModal="showUploadImageModal"
  ></CommonUploadSvg>
  <CommonSVG :url="url" default="uil:trash"></CommonSVG>
  <button @click="showUploadImageModal = true" class="border p-6">click</button>
</template>

<style>
svg path {
  @apply dark:fill-white fill-gray-700;
}
</style>
