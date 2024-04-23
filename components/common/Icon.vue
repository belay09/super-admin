<script setup>
const props = defineProps({
  url: {
    type: [String, null, undefined, Object],
    required: true,
  },
  iconStyle: {
    type: String,
    default: "",
  },
});

const iconUrl = computed(() => {
  const urlParts = props.url.split("/");
  const iconName =
    urlParts[urlParts.length - 2] + ":" + urlParts.pop().split(".")[0];
  return iconName;
});
</script>

<template>
  <Icon v-if="iconUrl" :class="iconStyle" :name="iconUrl" class="" />
</template>
