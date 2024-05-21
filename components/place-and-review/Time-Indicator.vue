<script setup>
const emit = defineEmits(["next"]);

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    default: 0,
  },
});

/**--------------------Variables---------------- */
const interval = ref(null);
const currentTime = ref(0);
function play() {
  clearInterval(interval.value);
  const indicator = document.getElementById(props.id);
  interval.value = setInterval(() => {
    currentTime.value += 0.5;
    if (indicator) {
      indicator.style.width = `${
        ((currentTime.value + 1) * 100) / props.duration
      }%`;
    }
    if (currentTime.value >= props.duration - 1) {
      emit("next");
      clearInterval(interval.value);
    }
  }, 500);
}
function pause() {
  clearInterval(interval.value);
  interval.value = null;
}

function next() {
  currentTime.value = props.duration;
  const indicator = document.getElementById(props.id);
  if (indicator) {
    indicator.style.width = `100%`;
  }
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
}

function prev() {
  clearInterval(interval.value);
  currentTime.value = 0;
  interval.value = null;
  const indicator = document.getElementById(props.id);
  if (indicator) {
    indicator.style.width = `0%`;
  }
  if (interval.value) {
    clearInterval(interval.value);
    interval.value = null;
  }
}

defineExpose({
  play: play,
  pause: pause,
  next: next,
  prev: prev,
});
</script>

<template>
  <div :id="id" class="w-0 h-1.5 text-white bg-primary-600 duration-500"></div>
</template>

<!-- -------------Review data fetch---------- -->
