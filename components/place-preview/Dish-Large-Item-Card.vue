<script setup>
import { Carousel, Slide } from "vue3-carousel";
import { formatDistance, format } from "date-fns";

const router = useRouter();
const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
  showPlace: {
    type: Boolean,
    default: true,
    required: false,
  },
});

/*-------------------------Image---------------------------*/
const imagesToShow = ref(props.menu.menuMedias?.slice(0, 5));

/**---------------------Add featured media to imageToShow-------------- */
if (props.menu?.media) {
  imagesToShow.value.unshift({
    media: { url: props.menu?.media.url },
  });
}

/*---------------------Carousel---------------------- */

const currentSlide = ref(0);

const breakpoints = {
  360: {
    itemsToShow: 1,
    snapAlign: "center",
  },

  768: {
    itemsToShow: 1,
    snapAlign: "center",
  },
  1024: {
    itemsToShow: 1,
    snapAlign: "center",
  },
};

let timer = null;
const hovered = ref(false);

const startTimer = () => {
  hovered.value = true;
  timer = setInterval(() => {
    // Code to execute periodically
    if (currentSlide.value < imagesToShow.value.length - 1) {
      currentSlide.value++;
    }
  }, 1500);
};

const cancelTimer = () => {
  clearInterval(timer);
  hovered.value = false;
};

/*---------------------Go to place---------------------- */
const gotoPlace = (place) => {
  if (place) {
    router.push({
      name: place.type.toLowerCase(),
      params: { id: place.id },
    });
  }
};
</script>

<template>
  <div
    @mouseenter="startTimer"
    @mouseleave="cancelTimer"
    class="relative rounded-lg border block w-full min-w-[20rem] lg:min-w-[26rem] max-w-md dark:border-none hover:border-primary-600"
  >
    <p
      v-show="hovered && imagesToShow?.length > 1"
      class="absolute right-6 top-6 px-2 border rounded-full bg-black z-40 text-white bg-opacity-50"
    >
      {{ currentSlide + 1 }} / {{ imagesToShow?.length }}
    </p>
    <div class="w-full mx-auto">
      <div class="z-10 w-full">
        <Carousel :breakpoints="breakpoints" v-model="currentSlide" class="">
          <Slide v-if="menu?.menuMedias?.length === 0 && !menu.media">
            <div class="h-48 w-full bg-sheger_brown-200"></div>
          </Slide>
          <Slide
            v-for="image in imagesToShow"
            :key="image?.media?.url"
            class=""
          >
            <img
              :src="image?.media?.url"
              class="w-full max-w-[28rem] h-48 object-cover object-center rounded-t-lg"
              alt="hotel image"
              loading="lazy"
            />
          </Slide>
        </Carousel>
      </div>
    </div>

    <div class="flex flex-col space-y-2 p-5 dark:bg-sheger_brown-100">
      <div class="flex justify-between items-center">
        <p class="text-lg font-medium dark:text-white">ETB {{ menu.price }}</p>
      </div>
      <p class="text-2xl font-medium dark:text-white">{{ menu.title }}</p>

      <TagsPlaceReviewDishTags
        :tags="menu.menuTags"
        item-class="dark:iphone5:bg-sheger_brown-200"
      ></TagsPlaceReviewDishTags>
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

      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <Icon
            name="uis:calender"
            class="text-sheger_dark_gray-100 dark:text-white"
          />
          <p
            class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
          >
            Updated:
            {{ format(new Date(menu.updatedAt), " dd MMM, yyyy") }}
          </p>
        </div>

        <!-- ---------------------------Review link------------------- -->
        <NuxtLink
          v-if="menu.menu_reviews?.length > 0 && menu.menu_reviews[0]?.review"
          :to="`/reviews/${menu.menu_reviews[0].review.id}`"
        >
          <Icon name="pajamas:live-preview" class="text-primary-600 text-2xl" />
        </NuxtLink>
      </div>
      <button
        @click="gotoPlace(menu.place)"
        v-if="showPlace"
        class="flex items-center space-x-4"
      >
        <img
          class="w-8 h-8 object-contain object-center"
          src="/images/temporary/kuriftu.png"
          alt="place logo"
        />
        <p class="md:text-xl dark:text-white">{{ menu.place?.name }}</p>
      </button>
    </div>
    <!-- ------------------House special---------------- -->
    <div
      v-if="menu.isHouseSpecial"
      class="absolute top-0 bg-green-500 py-2 px-3 text-white rounded-md text-xs lg:text-base"
    >
      House Special
    </div>
  </div>
</template>

<style scoped>
.tag-scroll::-webkit-scrollbar {
  display: none;
}
</style>
