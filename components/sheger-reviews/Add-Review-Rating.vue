<script setup>
// import addPlaceReviewMutation from "@/graphql/mutations/place-reviews/add.gql";
import categoryListQuery from "@/graphql/query/reviews/get-place-service-categories.gql";

import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { handleSubmit } = useForm({});
const emit = defineEmits(["close"]);

const props = defineProps({
  placeType: {
    type: String,
    default: "HOTELS",
  },
  modelValue: {
    type: Array,
    default: () => [],
  },
  
});


const { notify } = useNotify();
/**--------------------------Report category data fetch---------------- */

const filter = ref({
  type: {
    _eq: props.placeType,
  },
});


const serviceCategories = ref([]);
const { onResult, onError, loading, refetch } = authListQuery(
  categoryListQuery,
  filter,
 
);


// if there is already entered data it will be added
onResult((result) => {
  if (result.data?.basicsReviewCategories) {
    serviceCategories.value = result.data.basicsReviewCategories.map(
      (serviceCategory) => {
        {
          return {
            id: serviceCategory.id,
            name: serviceCategory.name,
            description: serviceCategory.description,
            value: 0,
          };
        }
      }
    );
  }
});


const reviewValue = ref();

/**----------------------Handle add review-------------------------- */

const setServiceRatings = inject("setServiceRatings");

const handleAddReview = handleSubmit(() => {
  serviceCategories.value = serviceCategories.value.filter((service) => {
    if (service.value > 0) {
      return service;
    }
  });
  setServiceRatings({
    serviceCategories: serviceCategories.value,
    comment: reviewValue.value,
  });


  emit("close");



});
</script>

<template>
  <div
    class="iphone5:w-full iphone5:px-5 z-20 md:px-10 xl:max-w-4xl xl:min-w-[36rem] xl:pb-10 mx-auto iphone5:my-5 md:mt-20 xl:mt-0 xl:relative"
  >
    <div class="flex justify-between my-8 w-full">
      <div class="flex flex-col space-y-4">
        <p class="whitespace-nowrap xl:text-xl font-medium dark:text-white">
          Rate your experience with this place
        </p>
      </div>
      <button class="self-start">
        <Icon
          @click="emit('close')"
          name="heroicons:x-mark-20-solid"
          class="text-2xl cursor-pointer dark:text-white"
        />
      </button>
    </div>

    <form action="" @submit.prevent="handleAddReview">
      <!-- -----------------Service Rating---------------- -->

      <!-- --------------------Skeleton-------------------- -->
      <div v-if="loading">
        <div v-for="i in 3" class="flex flex-col gap-y-2">
        <div class="flex items-center justify-between w-full dark:text-white">
          <div class="flex items-center">
            <div class="skeleton w-6 h-6 mr-2"></div> <!-- Skeleton icon -->
            <div class="skeleton w-24 h-6"></div> <!-- Skeleton text -->
          </div>
          <div class="skeleton w-24 h-5"></div> <!-- Skeleton rating stars -->
        </div>
        <p class="max-w-xl dark:text-white">
          <div class="skeleton w-full h-4 mb-2"></div> <!-- Skeleton text -->
          <div class="skeleton w-full h-4"></div> <!-- Skeleton text -->
        </p>
    </div>
      </div>


    <div v-else>
      <div class="flex flex-col gap-y-4">
        <div
          v-for="service in serviceCategories"
          :key="service.id"
          class="flex flex-col gap-y-2"
        >
          <div class="flex items-center justify-between w-full dark:text-white">
            <p class="!text-xl">
              <Icon name="mdi:parking" class="" />
              {{ service.name }}
            </p>
            <div class="">
              <HRating
                v-model:rating="service.value"
                container-class="w-full"
                image-class="w-7 "
                :readonly="false"
              ></HRating>
            </div>
          </div>
          <p class="max-w-xl dark:text-white">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aut
            nulla ipsum incidunt commodi optio id, sapiente quod quas voluptas?
          </p>
        </div>
      </div>
    </div>
    
      <HTextarea
        v-model="reviewValue"
        class="sheger_brown-200"
        type="text"
        name="review"
        rules="required"
        :maxlength="200"
      >
        <template #label>
          <div class="flex items-center space-x-2 py-2">
            <Icon
              name="uil:align-right-justify"
              class="dark:text-sheger_light_gray-400"
            />
            <p
              class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400"
            >
              Review
            </p>
          </div>
          <div></div>
        </template>
      </HTextarea>

      <button
        
        class="bg-primary-600 py-3 px-6 text-center block w-full mt-8 rounded-md font-bold text-white"
      >
        Submit
      </button>
    </form>
  </div>
</template>
