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

const serviceReview = ref(null);
onClickOutside(serviceReview, () => {
  showServiceReview.value = false;
});

const actionModal = ref(null);
onClickOutside(actionModal, () => {
  showActionLists.value = false;
});

const handleDelete = () => {
  emit("deleteReview", props.userReview.id);
  showRemoveReviewModal.value = false;
};

/**------------------------------Modal------------------------- */
const showRemoveReviewModal = ref(false);
const showRemoveReviewButton = ref(false);
const showServiceReview = ref(false);
const showActionLists = ref(false);
</script>

<template>
  <div>
    <!-- -----------------------Revoke Badge Modal---------------- -->
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
        <button @click="showActionLists = !showActionLists" class="">
          <Icon name="fontisto:more-v" class="text-xl" />
        </button>
      </div>
      <!-- ------------------Rating Average--------------- -->

      <ShegerReviewsRatingAverage
        class="pr-4"
        :rating="userReview.rating || 0"
        :show-all-stars="true"
        text-class=" pl-2 text-gray-500 font-medium"
        :rating-size="24"
      ></ShegerReviewsRatingAverage>

      <!-- ------------------Service Review--------------- -->
      <div
        ref="serviceReview"
        v-if="showServiceReview"
        class="flex flex-col gap-y-4 pt-6 pb-6 border-b transition-all duration-300"
      >
        <div
          v-for="service in userReview.place_review_by_services"
          class="flex justify-between w-full"
        >
          <!-- -----------_Service name----------- -->
          <div class="flex items-center space-x-4">
            <p
              class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
            >
              {{ service.review_category?.name }}
            </p>
          </div>
          <!-- -----------_Rating----------- -->

          <ShegerReviewsRatingAverage
            class="pr-4"
            :rating="service.rate"
            :show-all-stars="true"
            text-class=" pl-2 text-gray-500 font-medium"
            :rating-size="24"
          ></ShegerReviewsRatingAverage>
        </div>
      </div>

      <!-- ---------------------Comment----------------- -->
      <p class="dark:text-sheger_light_gray-400">
        {{ userReview.comment }}
      </p>

      <!-- ---------------------Actions lists--------------- -->

      <div
        ref="actionModal"
        v-if="showActionLists"
        class="absolute bg-white z-50 py-3 px-2 border rounded-md right-10 flex flex-col"
      >
        <!-- ---------------Report review-------------- -->
        <button
          @click="showRemoveReviewModal = !showRemoveReviewModal"
          class="flex items-center space-x-2 text-primary-600 border-b pb-3"
          :class="isPlaceReview ? 'pb-3 border-b' : ''"
        >
          <Icon name="uil:trash-alt" class="text-xl" />
          <p class="whitespace-nowrap">Remove Review</p>
        </button>

        <!-- ---------------View review lists-------------- -->

        <button
          @click="showServiceReview = !showServiceReview"
          class="flex items-center space-x-2 pt-3"
        >
          <Icon
            name="lucide:list-start"
            class="text-black text-xl dark:text-white"
          />

          <p class="whitespace-nowrap dark:text-white">View Review</p>
        </button>
      </div>
    </div>
  </div>
</template>
