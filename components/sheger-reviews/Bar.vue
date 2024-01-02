<script setup>
const props = defineProps({
  total: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});
function percentage() {
  return (props.value / props.total) * 100;
}
percentage();
</script>

<template>
  <div class="bar-container">
    <div class="rounded-xl text-xs bg-primary-50 w-full">
      <div
        class="rounded-xl bg-primary-600 h-5"
        :style="{
          width: `${percentage()}%`,
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.bar-container {
  width: 100%;
  height: 20px;
  margin-bottom: 0px;
  position: relative;
}

.bar {
  height: 100%;
  background-color: red;
}
</style>
