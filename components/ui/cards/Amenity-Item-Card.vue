<script setup>
import { Carousel, Slide } from "vue3-carousel";

const props = defineProps({
  amenity: {
    type: Object,
    required: true,
  },
});

/*-------------------------Image---------------------------*/
const imagesToShow = ref(props.amenity.placeAmenityResources.slice(0, 6));

/*--------------------------Carsoul------------------------ */
const currentSlide = ref(0);
const imageCarousel = ref(null);
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

/*---------------------------------------------Timer-------------------------- */
let timer = null;
const hovered = ref(false);
const startTimer = () => {
  hovered.value = true;
  timer = setInterval(() => {
    imageCarousel.value.next();
  }, 1500);
};

const cancelTimer = () => {
  clearInterval(timer);
  hovered.value = false;
};
</script>

<template>
  <div
    class="relative block rounded-t-lg w-full max-w-2xl min-h-[24rem] hover:cursor-pointer"
  >
    <div
      class="relative w-full"
      @mouseenter="startTimer"
      @mouseleave="cancelTimer"
    >
      <p
        v-show="hovered && imagesToShow.length > 1"
        class="absolute right-6 top-6 px-2 border rounded-t-full bg-black z-40 bg-opacity-70 text-red-400"
      >
        {{ currentSlide + 1 }} / {{ imagesToShow.length }} pictures
      </p>
      <div class="w-full mx-auto">
        <div class="z-10">
          <Carousel
            
            v-model="currentSlide"
            ref="imageCarousel"
            class=""
          >
            <Slide
              v-for="(image, index) in imagesToShow"
              :key="index"
              class="w-full rounded-t-md"
            >
              <NuxtImg
                loading="lazy"
                :src="image?.media?.url"
                class="w-full h-96 object-cover rounded-t-md"
                alt="amenity image"
              />
            </Slide>
            <Slide v-if="imagesToShow.length == 0">
              <div class="w-full h-96 bg-gray-600 rounded-t-md"></div>
            </Slide>
          </Carousel>
        </div>
      </div>
      <div
        class="absolute bottom-0 z-30 rounded-t-lg px-4 py-2 w-full flex flex-col bg-no-repeat bg-center bg-cover space-y-4 bg-[url('/images/static/gray-shadow.png')]"
      >
        <div class="flex items-center space-x-2">
          <Icon name="uil:swimmer" class="text-white" size="24" />

          <p class="text-white text-xl font-bold">
            {{ amenity.amenity?.title }}
          </p>
        </div>
        <p class="text-white">
          Augue est ultricies non ullamcorper tincidunt tempus quis lectus
          viverra. Ac maecenas suspendisse magna praesent
        </p>
      </div>
    </div>
    <div class="flex items-center justify-between px-3 border rounded-b-lg py-3">
      <div class="primary-button border">
        <Icon  name="uil:edit-alt"/>
        Edit
      </div>
      <div class="primary-button border">
        <Icon name="uil:trash-alt"/>
        Delete
      </div>
    </div>
  </div>
</template>
