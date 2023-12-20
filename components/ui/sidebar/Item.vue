<script setup>
defineProps({
  name: String,
});
</script>
<template>
  <nuxt-link
    :to="`${name.toLowerCase()}`"
    class="group flex gap-x-4 rounded-md text-lg font-semibold leading-6 px-6 py-4"
    exact-active-class="bg-primary-600 text-white"
  >
    <!-- <Icon name="streamline:insert-side" size="24" color="" /> -->
    <div>
      <slot name="icon"></slot>
    </div>
    <div>
      <slot name="title"></slot>
    </div>
  </nuxt-link>
</template>
