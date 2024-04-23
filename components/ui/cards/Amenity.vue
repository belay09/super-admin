<script setup>
import { Carousel, Slide } from "vue3-carousel";

const router = useRouter();
const props = defineProps({
  amenity: {
    type: Object,
    required: true,
  },
  showPlace: {
    type: Boolean,
    default: false,
    required: false,
  },
});
const emit = defineEmits(["editAmenity", "deleteAmenity"]);
/*-------------------------Image---------------------------*/
const imagesToShow = ref(props.amenity.placeAmenityResources.slice(0, 6));
// console.log("image to show",props.amenity.amenityMedias);

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
const editAmenity = () => {
  // Send a variable to the parent function
  emit("editAmenity", props.amenity);
};
const deleteAmenity = () => {
  // Send a variable to the parent function
  emit("deleteAmenity", props.amenity.id);
};
</script>

<template>
  <div class="border-[1px] rounded-md w-[20rem]">
    <div
      @mouseenter="startTimer"
      @mouseleave="cancelTimer"
      class="relative rounded-lg border-2 flex-col h-96 overflow-hidden block w-full lg:min-w-[20rem] max-w-[20rem] :border-none"
    >
      <p
        v-show="hovered && imagesToShow.length > 1"
        class="absolute w-16 text-center right-6 top-6 border rounded-full bg-black z-40 text-white bg-opacity-50"
      >
        {{ currentSlide + 1 }} / {{ imagesToShow.length }}
      </p>
      <div class="w-[320px] h-full">
        <div class="z-10 w-full">
          <Carousel :breakpoints="breakpoints" v-model="currentSlide" class="">
            <Slide v-if="amenity?.amenityMedias?.length === 0">
              <div
                class="h-[100px] overflow-hidden w-full bg-sheger_brown-200"
              ></div>
            </Slide>
            <Slide
              v-for="image in imagesToShow"
              :key="image.media?.url"
              class=""
            >
              <img
                :src="image?.media?.url"
                class="w-full h-96 object-cover object-center rounded-t-lg"
                alt="hotel image"
                loading="lazy"
              />
            </Slide>
          </Carousel>
        </div>
      </div>
      <div
        class="absolute inset-x-0 bottom-0 bg-gray-900/40 bg-opacity-75 flex h-28"
      >
        <!-- <pre>
        {{ props.amenity.amenity.icon.lightIconUrl }}
      </pre
        > -->
        <div class="text-white">
          <div class="flex items-center gap-2 px-4 my-2">
            <CommonIcon
              v-if="props.amenity.amenity.icon.lightIconUrl"
              :url="props.amenity.amenity.icon.lightIconUrl"
              iconStyle=""
            ></CommonIcon>
            <p class="text-white text-xl font-bold">
              {{ amenity.amenity?.title }}
            </p>
          </div>
          <p class="text-white text-sm description px-4">
            {{ props.amenity.description }}
          </p>
        </div>
      </div>
    </div>
    <div class="flex justify-between p-5 w-[20rem]">
      <button
        @click="editAmenity"
        class="bg-white-500 border-[1px] hover:bg-gray-200 text-black font-normal px-2 py-1 rounded"
      >
        <Icon name="material-symbols:edit" color="black" class="w-5 h-5" />
        Edit
      </button>
      <button
        @click="deleteAmenity"
        class="ml-2 bg-white-500 border-[1px] hover:bg-gray-100 text-black font-normal px-2 py-1 rounded"
      >
        <Icon name="ph:trash" color="black" class="w-5 h-5" />
        Delete
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-scroll::-webkit-scrollbar {
  display: none;
}
:root {
  /* Color */
  --vc-clr-primary-600: #00dcac00 !important;
  --vc-clr-secondary: #d34553 !important;
  --vc-clr-white: #ffffff !important;
  --vc-clr-hsecondary: #c7cacf !important;
  --vc-clr-pagprimary: #d34553 !important;

  /* Icon */
  --vc-icn-width: 1.2em;

  /* Navigation */
  --vc-nav-width: 100px;
  --vc-nav-color: #697280 !important;
  --vc-nav-background-color: #00dcac00 !important;
  --vc-pgn-background-color: #c7cacf !important;
  --vc-pgn-active-color: #d34553 !important;
}

.carousel__icon {
  z-index: 1000;
}

.carousel__pagination-button {
  width: 16px !important;
  height: 16px !important;
  background-color: #ff9f9f !important;
  border-radius: 100% !important;
}

.carousel__pagination-button--active {
  border-radius: 3rem !important;
  background-color: #d34553 !important;
  width: 60px !important;
  /* @apply rounded-sm; */
}

.carousel__pagination-button::after {
  display: none !important;
}

.carousel__pagination {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin-left: 2rem !important;
}
.carousel__pagination-item {
  margin: 0 0.5rem !important;
}

@media screen and (max-width: 768px) {
  .carousel__pagination-button {
    width: 12px !important;
    height: 12px !important;
    background-color: #ff9f9f !important;
    border-radius: 100% !important;
  }

  .carousel__pagination-button--active {
    border-radius: 3rem !important;
    background-color: #d34553 !important;
    width: 40px !important;
    /* @apply rounded-sm; */
  }

  .carousel__pagination-button::after {
    display: none !important;
  }

  .carousel__pagination {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    margin-left: 2rem !important;
  }
  .carousel__pagination-item {
    margin: 0 0.2rem !important;
  }
  .carousel__pagination {
    margin-left: 0 !important;
  }
}
.newsletter-bg {
  background-color: #fff;
  background-size: cover;
  background-position: center;
}
.wid {
  width: 320px;
}
.high {
  height: 150px;
}
.shad {
  box-shadow: 30px 40px 50px -20px rgb(0 0 0 / 0.25);
}
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

<!-- <script setup>
</script>
<template>
    <div class="w-64 mx-auto bg-white rounded overflow-hidden shadow-lg">
    Image with Text Overlay
    <div class="relative">
      <img class="w-full h-96 object-cover" src="https://res.cloudinary.com/dmr0drawd/image/upload/v1700147556/zht3qyu9ly6eqrc14a3o.png" alt="Card Image">
      <button @click="managefavorite(recipe.id, recipe.isfavorite)" class="absolute top-[150px] left-5 pr-3 w-8 h-8  rounded-full hover:shadow-transparent  " style="background-image: linear-gradient(21deg, rgba(0, 0, 0, 0.86) 10.77%, rgba(41, 36, 36, 0.00) 108.45%);">
            <Icon name="mingcute:left-fill" color="white" class="w-8 h-8" />
        </button>
      <button @click="managefavorite(recipe.id, recipe.isfavorite)" class="absolute top-2 right-2 px-2 w-20 h-5  rounded-full hover:shadow-transparent  " style="background-image: linear-gradient(21deg, rgba(0, 0, 0, 0.86) 10.77%, rgba(41, 36, 36, 0.00) 108.45%);">
        <h1 class="text-white text-xs capitalize">1/7 profiles</h1>
    </button>
      <div class="absolute inset-x-0 bottom-0 bg-gray-900/40 bg-opacity-75 flex  h-28">
        <div class="text-white ">
            <div class="flex items-center gap-4 px-4 my-2">
                <Icon name="bx:swim" color="white" width="20" height="20" class="item-center"/>

                <div class="font-poppins font-normal text-xl px-1 item-center capitalize">swimming pool</div>
                


            </div>
          <p class="text-white text-sm description px-4">
            Your text goes here. This is an example description for the card.
            Your text goes here. This is an example description for the card.
            Your text goes here. This is an example description for the card.

          </p>
        </div>
      </div>
    </div>

    Buttons
    <div class=" flex justify-between p-5">
      <button class="bg-white-500 border-[1px] hover:bg-gray-200 text-black font-normal  px-2 py-1 rounded">
        <Icon name="material-symbols:edit" color="black" class="w-5 h-5" />

        Edit
      </button>
      <button class="ml-2 bg-white-500 border-[1px] hover:bg-gray-100 text-black font-normal  px-2 py-1 rounded">
        <Icon name="ph:trash" color="black" class="w-5 h-5" />

        Delate
      </button>
    </div>
  </div>

</template>

<style scoped>
.newsletter-bg {
  background-color:  #fff ;
  background-size: cover;
  background-position: center;
}
.wid{
    width:320px;
    

}
.high{
    height:150px

}
.shad{
    box-shadow: 30px 40px 50px -20px rgb(0 0 0 / 0.25);
}
.description {
   display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
   overflow: hidden;
}
</style> -->
