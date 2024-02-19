<script setup>
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
  },
});

/**-----------------------------------Generate sort object------------------------------- */

function generateSortObject(objects, order) {
  if (objects.length < 1) {
    // Handle the case where the objects array is empty
    return [{}];
  }
  // Initialize the sort object with the last property and order
  let sortObject = { [objects[objects.length - 1]]: order };
  // Iterate over the remaining properties in reverse order
  for (let i = objects.length - 2; i >= 0; i--) {
    sortObject = { [objects[i]]: sortObject };
  }
  return [sortObject];
}

function selectSort(item) {
  const sort = generateSortObject(item.levels, item.order);
  emit("update:modelValue", sort);
}

/**-------------------------------Clear sort--------------------------------------- */
function clearSort() {
  emit("update:modelValue", [{}]);
}

/**-----------------------------------Show sorts----------------------------------------- */
const sortRef = ref(null);
const showSorts = ref(false);
onClickOutside(sortRef, (e) => {
  if (showSorts.value) {
    showSorts.value = false;
  }
});
function toggleShowSorts() {
  console.log("showSorts", showSorts.value);
  showSorts.value = !showSorts.value;
}
</script>
<template>
  <div class="relative">
    <div @click="toggleShowSorts" class="border rounded-md py-3 px-4">
      <Icon
        name="heroicons-outline:adjustments"
        class="text-2xl cursor-pointer z-30"
      />
    </div>
    <div
      ref="sortRef"
      v-if="showSorts"
      class="absolute top-14 right-0 flex flex-col z-50 bg-white border rounded-md"
    >
      <div
        class="cursor-pointer py-2 px-4 border-b"
        v-for="item in items"
        :key="item.name"
        @click="selectSort(item)"
      >
        {{ item.name }}
      </div>
      <!-- ----------------------------Clear sorts------------------ -->
      <p @click="clearSort" class="cursor-pointer py-2 px-4 border-b">
        Clear {{ showSorts }}
      </p>
    </div>
  </div>
</template>
