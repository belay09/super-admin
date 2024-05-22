<script setup>
const props = defineProps({
  ambiances: {
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
        v-for="ambiance in ambiances"
        :key="ambiance.ambiance.id"
        class="flex items-center px-3 secondary-text space-x-2 py-2 bg-gray-700/60 text-white rounded-full"
        :class="itemClass"
      >
        <CommonIcon
          v-if="ambiance?.ambiance?.icon?.lightIconUrl"
          :url="ambiance?.ambiance?.icon?.lightIconUrl"
          :iconStyle="'text-white text-xl font-bold'"
        ></CommonIcon>

        <p class="whitespace-nowrap text-white font-medium">
          {{ ambiance.ambiance?.title }}
        </p>
      </button>
    </div>
  </div>
</template>
