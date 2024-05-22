<script setup>
const props = defineProps({
  reviewTags: {
    type: Array,
    default: () => [],
    required: true,
  },
});
</script>

<template>
  <div class="overflow-x-scroll scroll w-full">
    <div class="flex items-center space-x-4">
      <button
        v-for="reviewTag in reviewTags"
        :key="reviewTag.tag.id"
        class="flex items-center px-4 secondary-text space-x-2 py-2 secondary-background rounded-full"
      >
        <Icon name="uil:location-point" class="text-inherit lg:text-xl" />
        <p class="whitespace-nowrap text-inherit">{{ reviewTag.tag?.title }}</p>
      </button>
    </div>
  </div>
</template>
