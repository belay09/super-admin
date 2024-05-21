<script setup>
import editPlaceReviewMutation from "@/graphql/mutations/place-reviews/edit.gql";
import categoryListQuery from "@/graphql/query/reviews/get-place-service-categories.gql";

import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { handleSubmit } = useForm({});
const emit = defineEmits(["close", "onDone"]);
const props = defineProps({
  userReview: {
    type: Object,
    required: true,
  },
});

const { notify } = useNotify();

/**--------------------------Report category data fetch---------------- */

const filter = ref({
  type: {
    _eq: props.userReview?.place?.type,
  },
});
const serviceCategories = ref([]);

const { onResult, onError, loading, refetch } = anonymousListQuery(
  categoryListQuery,
  filter,
  ref([{}]  ),
  0,
  4,
  true
);

function findRateValue(categoryId) {
  const category = props.userReview?.place_review_by_services.find(
    (service) => {
      if (service.reviewCategoryId === categoryId) {
        return service;
      }
    }
  );

  if (category) {
    return category.rate;
  }

  return 0;
}

onResult((result) => {
  if (result.data?.basicsReviewCategories) {
    serviceCategories.value = result.data.basicsReviewCategories.map(
      (serviceCategory) => {
        {
          return {
            id: serviceCategory.id,
            name: serviceCategory.name,
            description: serviceCategory.description,
            value: findRateValue(serviceCategory.id),
            icon: serviceCategory.icon,
          };
        }
      }
    );
  }
});

const reviewValue = ref(props.userReview?.comment);

/**----------------------Handle add review-------------------------- */

const {
  mutate: editReviewMutate,
  onDone: editReviewDone,
  onError: editReviewError,
  loading: editReviewLoading,
} = authMutation(editPlaceReviewMutation);

editReviewDone((result) => {
  emit("onDone");
  emit("close");
  notify({
    title: "Place reviewed",
    description: "Thank you for your feedback",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});
editReviewError((error) => {
  notify({
    title: "Some thing went wrong",
    description: `Some thing went wrong or you can't update the review`,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
  emit("close");
});

const handleEditReview = handleSubmit(() => {
  editReviewMutate({
    id: props.userReview.id,
    editInput: {
      comment: reviewValue.value,
    },
    serviceCategory: serviceCategories.value.map((serviceCategories) => {
      return {
        placeReviewId: props.userReview.id,
        reviewCategoryId: serviceCategories.id,
        rate: serviceCategories.value,
      };
    }),
  });
});
</script>

<template>
  <div
    class="iphone5:w-full iphone5:px-5 z-20 md:px-10 xl:max-w-4xl xl:min-w-[36rem] xl:pb-10 mx-auto iphone5:my-5 md:mt-20 xl:mt-0 xl:relative"
  >
    <div class="flex justify-between my-8 w-full">
      <div class="flex flex-col space-y-4">
        <p class="whitespace-nowrap xl:text-xl font-medium dark:text-white">
          Rate your experience with {{ userReview?.place.type }}
        </p>
        {{ userReview.type }}
      </div>
      <button class="self-start">
        <Icon
          @click="emit('close')"
          name="heroicons:x-mark-20-solid"
          class="text-2xl cursor-pointer dark:text-white"
        />
      </button>
    </div>

    <form action="" @submit.prevent="handleEditReview">
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
      <div v-else class="flex flex-col gap-y-4">
        <div
          v-for="service in serviceCategories"
          :key="service.id"
          class="flex flex-col gap-y-2"
        >
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center space-x-4">
              <img
                v-if="service?.icon?.lightIconUrl"
                :src="service?.icon?.lightIconUrl"
                class="w-8 h-8 object-cover object-center"
                alt=" icon image"
              />
              <p class="!text-xl">
                {{ service.name }}
              </p>
            </div>
            <div class="">
              <HRating
                v-model:rating="service.value"
                container-class="w-full"
                image-class="w-7 "
                :readonly="false"
              ></HRating>
            </div>
          </div>
          <p class="max-w-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde aut
            nulla ipsum incidunt commodi optio id, sapiente quod quas voluptas?
          </p>
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
        :disabled="editReviewLoading"
        class="bg-primary-600 py-3 px-6 text-center block w-full mt-8 rounded-md font-bold text-white"
        :class="props.disabled ? 'bg-opacity-40' : ''"
      >
        Edit Review
      </button>
    </form>
  </div>
</template>
