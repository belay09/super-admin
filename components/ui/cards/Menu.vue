<script setup>
import { format } from "date-fns";

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});

/*....................Window resize.............*/
const windowSize = ref(0);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
});
</script>

<template>
  <div class="w-full 2xl:max-w-4xl">
    <div
      class="grid grid-cols-8 gap-4 lg:gap-8 secondary-border rounded-lg w-full relative"
    >
      <div
        class="col-span-3 lg:col-span-3 bg-[image:var(--image-url)] bg-no-repeat bg-center bg-cover rounded-l-lg"
        :style="{ '--image-url': `url(${menu.media.url})` }"
      ></div>
      <div
        class="col-span-5 lg:col-span-5 flex flex-col space-y-2 lg:space-y-4 py-4 pr-2 lg:pr-6"
      >
        <div class="flex justify-between w-full">
          <p class="secondary-text iphone5:text-lg">ETB {{ menu.price }}</p>
        </div>
        <p class="lg:text-2xl dark:text-white">{{ menu.title }}</p>

        <div
          v-if="menu.menuTags.length > 0"
          class="flex flex-wrap secondary-text text-lg font-medium pb-4"
        >
          <p
            v-for="menuTag in menu.menuTags"
            :key="menuTag.tag.id"
            class="pr-2"
          >
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

        <p
          class="hidden text-sheger_brown-200 dark:text-sheger_light_gray-400 lg:block"
        >
          {{ menu.description }}
        </p>

        <div class="flex items-center space-x-4">
          <Icon
            name="uis:calender"
            class="text-sheger_dark_gray-100 dark:text-white"
          />
          <p
            class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
          >
            Updated:
            {{ format(new Date(), "dd MMM, yyyy") }}
          </p>
        </div>
      </div>

      <div
        class="absolute top-0 bg-green-500 py-2 px-3 text-white rounded-md text-xs lg:text-base"
      >
        Available
      </div>
    </div>
  </div>
</template>
