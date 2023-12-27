<script setup>
const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
    required: true,
  },
  itemsContainerClass: {
    type: String,
    default: "",
    required: false,
  },
  itemClass: {
    type: String,
    default: "",
    required: false,
  },
});
</script>

<template>
  <div class="overflow-x-scroll scroll w-full">
    <div class="flex items-center space-x-4" :class="itemsContainerClass">
      <button
        v-for="tag in tags"
        :key="tag"
        class="flex items-center px-4 secondary-text space-x-2 py-2 secondary-background rounded-full bg-sheger-gray-500"
        :class="itemClass"
      >
        <Icon name="uil:location-point" class="text-inherit lg:text-xl" />
        <p class="whitespace-nowrap text-inherit">{{ tag }}</p>
      </button>
    </div>
  </div>
</template>
