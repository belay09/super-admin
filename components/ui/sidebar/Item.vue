<script setup>
defineProps({
  name: String,
});
</script>
<template>
  <nuxt-link
    :to="`${name.toLowerCase()}`"
    class="flex px-6 py-4 text-lg font-medium leading-6 rounded-md group gap-x-4"
    exact-active-class="text-white bg-primary-600"
    :class="[
      name != '/app' && $route.path.includes(name)
        ? 'bg-primary-600 text-white'
        : '',
    ]"
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
