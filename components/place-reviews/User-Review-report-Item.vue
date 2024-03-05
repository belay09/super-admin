<script setup>
import { format } from "date-fns";
import { onClickOutside } from "@vueuse/core";

const emit = defineEmits(["deleteReview"]);
const props = defineProps({
  userReview: {
    type: Object,
    required: true,
  },
});

const buttonModal = ref(null);
onClickOutside(buttonModal, () => {
  showRemoveReviewButton.value = false;
});

const handleDelete = () => {
  emit("deleteReview", props.userReview.place_review.id);
  showRemoveReviewModal.value = false;
};

/**------------------------------Modal------------------------- */
const showRemoveReviewModal = ref(false);
const showRemoveReviewButton = ref(false);
</script>

<template>
  <div>
    <ModalsConfirmation
      @confirm="handleDelete"
      v-model="showRemoveReviewModal"
      title="Remove Review"
      sure-question="Are you sure you want to remove this review ?"
      description="After confirming this action the review will be removed permanently, the places rating will be vary after this action.  The user will be notified of this action. "
    ></ModalsConfirmation>
    <div
      class="flex flex-col space-y-2 border-t dark:border-sheger_brown-100 pt-6 relative"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-5">
            <img
              v-if="userReview?.user?.photoUrl"
              class="w-14 h-14 border border-primary-600 rounded-full object-center"
              :src="userReview?.user?.photoUrl"
              alt="profile image"
            />
            <img
              v-else
              class="w-14 h-14 border border-primary-600 rounded-full object-center"
              src="/images/temporary/default-profile.png"
              alt="profile image"
            />
            <div>
              <p class="">{{ userReview.user?.fullName }}</p>
              <p class="text-sheger_brown-200 dark:text-sheger_light_gray-400">
                {{ format(new Date(userReview?.createdAt), " dd MMM, yyyy") }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex space-x-3">
          <div class="flex px-2 py-1 border-[1px] rounded-3xl  space-x-2"> 
            <Icon name="fontisto:flag" class="text-2xl text-red-600  rounded-full" />
            <p class="text-sheger_brown-200 dark:text-sheger_light_gray-400">
            {{ userReview.type.replace(/_/g, " ")}}
          </p></div>
          <button
            @click="showRemoveReviewButton = !showRemoveReviewButton"
            class=""
          >
            <Icon name="fontisto:more-v" class="text-xl" />
          </button>
        </div>
      </div>
      <div class="flex space-x-2 items-center">
        <HRating
          :rating="userReview.place_review.rating || 0"
          image-class="w-5"
          container-class=""
        ></HRating>
        <p class="font-medium">({{ userReview?.place_review?.rating }}/5)</p>
      </div>
      <p class="dark:text-sheger_light_gray-400">
        {{ userReview.place_review.comment }}
      </p>
      <button
        ref="buttonModal"
        v-if="showRemoveReviewButton"
        @click="showRemoveReviewModal = true"
        class="absolute z-50 py-3 px-2 text-red-600 border rounded-md right-2 hover:bg-primary-100 bottom-5  flex items-center space-x-2"
      >
        <Icon name="uil:trash-alt" class="text-xl" />
        <p class="whitespace-nowrap">Remove Review</p>
      </button>
    </div>
  </div>
</template>
