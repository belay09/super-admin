<script setup>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide } from "vue3-carousel";

const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  currentImageToShow: {
    type: String,
    default: "",
    required: false,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
});

const getCurrentSlideIndex = () => {
  const index = props.images.findIndex(
    (image) => image?.media.url == props.currentImageToShow
  );

  if (index < 0) {
    return 0;
  } else {
    return index;
  }
};

const currentSlide = ref(getCurrentSlideIndex());

console.log(currentSlide.value, "current slide");
const imageCarousel = ref(null);
const settings = {
  itemsToShow: 1,
  itemsToScroll: 1,
  // snapAlign: "left",
};

const breakpoints = {
  700: {
    itemsToShow: 1,
    snapAlign: "center",
  },
  1024: {
    itemsToShow: 1,
    // snapAlign: "end",
  },
};

function next() {
  imageCarousel.value.next();
}

function prev() {
  imageCarousel.value.prev();
}

/*-------------------------------Modal controll---------------------------------*/

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});

/*....................Window resize.............*/
const windowSize = ref(null);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
});
</script>
<template>
  <ClientOnly>
    <HeadlessTransitionRoot as="template" :show="open">
      <HeadlessDialog as="div" class="relative z-50">
        <HeadlessTransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed z-50 bottom-0 bg-gray-500 bg-opacity-20 transition-opacity"
          />
        </HeadlessTransitionChild>

        <div
          class="fixed h-screen inset-0 z-50 overflow-y-hidden flex flex-col justify-center"
        >
          <div
            class="flex h-screen xl:min-h-full xl:h-screen items-center justify-center text-center sm:p-0"
          >
            <HeadlessTransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialogPanel
                class="relative z-50 transform overflow-hidden rounded-lg bg-[#252525] text-left shadow-xl transition-all px-4 samsg:px-5 md:px-8 xl:px-12 2xl:px-[100px] xl:w-[96%]"
              >
                <div
                  class="flex items-start justify-between xl:justify-start space-x-16"
                >
                  <!-- --------------------Back to photos button---------------- -->
                  <div class="w-1/4 flex">
                    <div
                      class="flex justify-center py-2.5 px-4 space-x-4 rounded-md border border-white mt-10"
                    >
                      <Icon
                        name="heroicons:arrow-left-20-solid"
                        size="24"
                        color=""
                        class="text-white"
                      />
                      <button
                        @click="open = false"
                        class="whitespace-nowrap text-white"
                      >
                        Back to photos
                      </button>
                    </div>
                  </div>

                  <!-- ----------------------------Large screen Image show------------------- -->
                  <div
                    v-if="windowSize && windowSize > 1024"
                    class="w-1/2 relative pb-5 hidden lg:block"
                  >
                    <div class="w-full">
                      <Carousel
                        v-bind="settings"
                        :breakpoints="breakpoints"
                        :itemsToShow="1"
                        :itemsToScroll="1"
                        v-model="currentSlide"
                        :wrap-around="false"
                        ref="imageCarousel"
                        class=""
                      >
                        <Slide
                          v-for="image in images"
                          :key="image?.media?.url"
                          class="w-full"
                        >
                          <div class="w-full">
                            <img
                              class="w-full object-cover object-center max-h-[50rem] min-h-[40rem]"
                              :src="image?.media?.url"
                              :alt="`image`"
                            />
                          </div>
                        </Slide>
                      </Carousel>
                    </div>

                    <button
                      v-show="currentSlide < images.length - 1"
                      @click="next"
                      class="absolute duration-500 top-1/2 bottom-1/2 w-8 h-8 rounded-full justify-center flex flex-col items-center bg-white -right-24"
                    >
                      <Icon
                        name="heroicons:chevron-right-20-solid"
                        class="text-2xl shrink-0"
                      />
                    </button>
                    <button
                      v-show="currentSlide > 0"
                      @click="prev"
                      class="absolute duration-500 top-1/2 bottom-1/2 w-8 h-8 rounded-full justify-center flex flex-col items-center bg-white -left-24"
                    >
                      <Icon
                        name="heroicons:chevron-left-20-solid"
                        class="text-2xl shrink-0"
                      />
                    </button>
                  </div>

                  <!-- ---------------------------Share and flag buttons---------------- -->
                  <div class="flex justify-between items-center mt-10 w-1/4">
                    <Icon
                      @click="open = false"
                      name="heroicons:x-mark-20-solid"
                      size="28"
                      color=""
                      class="font-bold text-white cursor-pointer"
                    />
                  </div>
                </div>

                <!-- ------------------------Mobile screen gallery show---------------------- -->

                <div
                  v-if="windowSize && windowSize < 1024"
                  class="relative py-8 lg:hidden w-full"
                >
                  <div class="w-full">
                    <Carousel
                      v-bind="settings"
                      :breakpoints="breakpoints"
                      :itemsToShow="1"
                      :itemsToScroll="1"
                      v-model="currentSlide"
                      :wrap-around="false"
                      ref="imageCarousel"
                      class=""
                    >
                      <Slide
                        v-for="image in images"
                        :key="image?.media?.url"
                        class="w-full"
                      >
                        <div class="w-full">
                          <img
                            width="100%"
                            class="w-full min-h-[40rem] object-cover"
                            :src="image?.media?.url"
                            :alt="`image`"
                            loading="lazy"
                          />
                        </div>
                      </Slide>
                    </Carousel>
                  </div>

                  <button
                    v-show="currentSlide < images.length - 1"
                    @click="next"
                    class="absolute duration-500 top-1/2 bottom-1/2 right-0 w-8 h-8 rounded-full justify-center flex flex-col items-center bg-white"
                  >
                    <Icon
                      name="heroicons:chevron-right-20-solid"
                      class="text-2xl shrink-0"
                    />
                  </button>
                  <button
                    v-show="currentSlide > 0"
                    @click="prev"
                    class="absolute duration-500 top-1/2 bottom-1/2 left-0 w-8 h-8 rounded-full justify-center flex flex-col items-center bg-white"
                  >
                    <Icon
                      name="heroicons:chevron-left-20-solid"
                      class="text-2xl shrink-0"
                    />
                  </button>
                </div>
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </ClientOnly>
</template>
