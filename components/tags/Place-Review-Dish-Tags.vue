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
        :key="tag.tag.id"
        class="flex items-center px-4 space-x-2 py-2 back rounded-full"
        :class="itemClass"
      >
        <CommonSVG
          v-if="tag?.tag?.icon?.lightIconUrl"
          :url="tag?.tag?.icon?.lightIconUrl"
        ></CommonSVG>

        <p class="whitespace-nowrap text-inherit">{{ tag.tag?.title }}</p>
      </button>
    </div>
  </div>
</template>
