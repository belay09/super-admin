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
  <div class="relative block rounded-lg max-w-sm hover:cursor-pointer">
    <div
      class="relative w-full"
      @mouseenter="startTimer"
      @mouseleave="cancelTimer"
    >
      <p
        v-show="hovered && imagesToShow.length > 1"
        class="absolute right-6 top-6 px-2 border rounded-full bg-black z-40 text-white bg-opacity-70"
      >
        {{ currentSlide + 1 }} / {{ imagesToShow.length }} pictures
      </p>
      <div class="w-full mx-auto">
        <div class="z-10">
          <Carousel
            :breakpoints="breakpoints"
            v-model="currentSlide"
            ref="imageCarousel"
            class=""
          >
            <Slide
              v-for="(image, index) in imagesToShow"
              :key="index"
              class="w-full rounded-md"
            >
              <NuxtImg
                loading="lazy"
                :src="image?.media?.url"
                class="w-full h-96 object-cover rounded-md"
                alt="amenity image"
              />
            </Slide>
            <Slide v-if="imagesToShow.length == 0">
              <div class="w-full h-96 bg-gray-600 rounded-md"></div>
            </Slide>
          </Carousel>
        </div>
      </div>
      <div
        class="absolute bottom-0 z-30 rounded-lg px-4 py-2 w-full flex flex-col bg-no-repeat bg-center bg-cover space-y-4 bg-[url('/images/static/gray-shadow.png')]"
      >
        <div class="flex items-center space-x-2">
          <Icon name="uil:swimmer" class="text-white" size="24" />

          <p class="text-white text-xl font-bold">
            {{ amenity.amenity?.title }}
          </p>
        </div>
        <p class="text-white">
          {{ amenity.amenity?.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.place .carousel__icon {
  z-index: 1000;
  color: white !important;
}

.place .carousel__pagination-button {
  width: 16px !important;
  height: 16px !important;
  background-color: #ff9f9f !important;
  border-radius: 100% !important;
}

.place .carousel__pagination-button--active {
  border-radius: 3rem !important;
  background-color: #d34553 !important;
  width: 60px !important;
  /* @apply rounded-sm; */
}

.place .carousel__pagination-button::after {
  display: none !important;
}

.place .carousel__pagination {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-left: 2rem !important;
}
.place .carousel__pagination-item {
  margin: 0 0.5rem !important;
}

.place .carousel__next,
.place .carousel__prev {
  @apply bg-black bg-opacity-30 w-14 h-14 rounded-full duration-200 !important;
}

.place .carousel__prev {
  @apply -left-9 !important;
}
.place .carousel__next {
  @apply -right-9 !important;
}

.place .carousel__next--disabled,
.place .carousel__prev--disabled {
  @apply hidden !important;
}

@media screen and (max-width: 768px) {
  .place .carousel__pagination-button {
    width: 12px !important;
    height: 12px !important;
    background-color: #ff9f9f !important;
    border-radius: 100% !important;
  }

  .place .carousel__pagination-button--active {
    border-radius: 3rem !important;
    background-color: #d34553 !important;
    width: 40px !important;
    /* @apply rounded-sm; */
  }

  .place .carousel__pagination-button::after {
    display: none !important;
  }

  .place .carousel__pagination {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-left: 2rem !important;
  }
  .place .carousel__pagination-item {
    margin: 0 0place 0.2rem !important;
  }
  .place .carousel__pagination {
    margin-left: 0 !important;
  }

  .place .carousel__next,
  .place .carousel__prev {
    @apply bg-black bg-opacity-30 w-8 h-8 rounded-full duration-200 !important;
  }

  .place .carousel__prev {
    @apply -left-6 !important;
  }
  .place .carousel__next {
    @apply -right-6 !important;
  }
}
@media screen and (max-width: 360px) {
  .place .carousel__prev {
    @apply -left-6 !important;
  }
  .place .carousel__next {
    @apply -right-6 !important;
  }
}
</style>
