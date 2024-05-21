<script setup>
import { formatDistance, format } from "date-fns";

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div
    class="relative rounded-lg border my-6 w-full flex items-stretch space-x-4 min-w-[20rem] dark:border-darkBorder"
  >
    <img
      src="/images/temporary/default-dish-image.png"
      class="w-[40%] h-full object-cover rounded-l-lg"
      alt="hotel image"
    />
    <div class="flex flex-col space-y-2 pr-2 py-2 w-2/3 overflow-hidden">
      <div class="flex justify-between items-center pt-2">
        <p class="font-medium secondary-text">ETB {{ menu.price }}</p>
      </div>
      <p class="font-medium dark:text-white">{{ menu.title }}</p>

      <div
        v-if="menu.menuTags?.length > 0"
        class="flex flex-wrap text-lg secondary-text font-medium pb-4"
      >
        <p v-for="menuTag in menu.menuTags" :key="menuTag.tag.id" class="pr-2">
          #{{ menuTag.tag.title }}
        </p>
      </div>

      <div class="flex space-x-4 items-start">
        <Icon
          name="uil:stopwatch"
          class="text-black text-xl lg:text-3xl dark:text-white"
        />
        <div>
          <p class="primary-text lg:text-base">Preparation Time</p>
          <p class="primary-text lg:text-base">
            {{}} {{ menu.timeToPrepare }} Minutes
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <Icon
          name="uis:calender"
          class="text-sheger_dark_gray-100 dark:text-white"
        />
        <p
          class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
        >
          Updated: {{ format(new Date(), "dd MMM, yyyy") }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tag-scroll::-webkit-scrollbar {
  display: none;
}
</style>
