<script setup>
const hovered = ref(false);

const onHover = () => {
  hovered.value = !hovered.value;
};
</script>

<template>
  <div class="relative">
    <img
      src="@/images/temporary/default-place.png"
      class="w-full h-[22rem] hover:blur-sm"
      alt="Place  image"
      @mouseover="onHover"
    />
    <button
      v-show="hovered"
      class="absolute inset-0 z-40 border border-white py-3 px-4 rounded-md w-32 h-12 mx-auto my-auto text-white"
    >
      Delete
    </button>
  </div>
</template>
