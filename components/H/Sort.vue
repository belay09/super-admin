<script setup>
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["update:modelValue", "update:selected"]);
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: Array,
  },
  selected: {
    type: String,
  },
});

/**-----------------------------------Generate sort object------------------------------- */
const isAscendingOrder = ref(false);
const sortIcon = computed(() => {
  return isAscendingOrder.value ? "uil:arrow-down" : "uil:arrow-up";
});
function generateSortObject(objects) {
  if (objects.length < 1) {
    // Handle the case where the objects array is empty
    return [{}];
  }
  // Initialize the sort object with the last property and order

  let order = isAscendingOrder.value ? "ASC_NULLS_FIRST" : "DESC_NULLS_LAST";
  let sortObject = { [objects[objects.length - 1]]: order };
  // Iterate over the remaining properties in reverse order
  for (let i = objects.length - 2; i >= 0; i--) {
    sortObject = { [objects[i]]: sortObject };
  }
  return [sortObject];
}

function selectSort(item) {
  const sort = generateSortObject(item.levels);
  isAscendingOrder.value = !isAscendingOrder.value;
  emit("update:modelValue", sort);
  emit("update:selected", item.name);
}

/**-------------------------------Clear sort--------------------------------------- */
function clearSort() {
  showSorts.value = false;
  emit("update:modelValue", [{}]);
  emit("update:selected", "");
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
  showSorts.value = !showSorts.value;
}
</script>
<template>
  <div ref="sortRef" class="relative">
    <div @click="toggleShowSorts" class="border rounded-md py-3 px-4">
      <Icon
        name="iconoir:sort"
        class="text-2xl cursor-pointer z-30 self-start"
      />
    </div>

    <div
      v-if="showSorts"
      class="absolute top-14 right-0 flex flex-col z-50 bg-white border rounded-md"
    >
      <div
        @click="selectSort(item)"
        class="cursor-pointer py-2 px-4 border-b min-w-[10rem] flex justify-between"
        v-for="(item, index) in items"
        :key="item"
      >
        <p>
          {{ item?.name }}
        </p>

        <Icon
          v-show="selected == item.name"
          :name="sortIcon"
          class="text-2xl text-primary-600"
        />
      </div>

      <!-- ----------------------------Clear sorts------------------ -->
      <div
        @click="clearSort"
        class="cursor-pointer py-2 px-4 border-b text-primary-600"
      >
        Clear
      </div>
    </div>
  </div>
</template>
