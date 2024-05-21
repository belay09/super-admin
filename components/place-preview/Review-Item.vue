<script setup>
import { format, parse, formatDistance, subDays } from "date-fns";
import { useAuthStore } from "@/stores/auth.js";
import { onClickOutside } from "@vueuse/core";

const authStore = useAuthStore();
const props = defineProps({
  userReview: {
    type: Object,
    required: true,
  },
  isPlaceReview: {
    type: Boolean,
    default: false,
  },
});

const buttonModal = ref(null);
const serviceReview = ref(null);
onClickOutside(buttonModal, () => {
  showActionLists.value = false;
});

onClickOutside(serviceReview, () => {
  showServiceReview.value = false;
});

/**------------------------------Modal------------------------- */
const showReportReviewModal = ref(false);
const showServiceReview = ref(false);

const showActionLists = ref(false);
</script>

<template>
  <div>
    <ModalsModal :auto-close="true" v-model="showReportReviewModal">
      <template #content>
        <Place-ReportPlaceReview
          @close="showReportReviewModal = false"
          :userReviewId="userReview.id"
        ></Place-ReportPlaceReview>
      </template>
    </ModalsModal>
    <div
      class="flex flex-col space-y-2 border-t dark:border-sheger_brown-100 pt-6 relative"
    >
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-5">
            <img
              class="w-14 h-14 border border-primary-600 rounded-full object-center"
              src="/images/temporary/default-profile.png"
              alt="profile image"
            />
            <div>
              <p class="dark:text-white">{{ userReview.user?.fullName }}</p>
              <p class="text-sheger_brown-200 dark:text-sheger_light_gray-400">
                {{ format(new Date(userReview.createdAt), " dd MMM, yyyy") }}
              </p>
            </div>
          </div>
        </div>
        <button
          v-if="authStore.isLoggedIn"
          @click="showActionLists = !showActionLists"
          class=""
        >
          <Icon name="fontisto:more-v" class="text-xl dark:text-white" />
        </button>
      </div>
      <div class="flex space-x-2 items-center">
        <ReviewsRatingsAndLikesRatingAverage
          class="pr-4"
          :rating="userReview.rating || 0"
          :show-all-stars="true"
          text-class=" pl-2 text-gray-500 font-medium"
          :rating-size="24"
          readonly
        ></ReviewsRatingsAndLikesRatingAverage>
      </div>

      <!-- ------------------Service Review--------------- -->
      <div
        ref="serviceReview"
        v-if="showServiceReview"
        class="flex flex-col gap-y-4 pt-2 pb-6 border-b transition-all duration-300"
      >
        <div
          v-for="service in userReview.place_review_by_services"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full"
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

          <ReviewsRatingsAndLikesRatingAverage
            class="pr-4"
            :rating="service.rate"
            :show-all-stars="true"
            text-class=" pl-2 text-gray-500 font-medium"
            :rating-size="24"
          ></ReviewsRatingsAndLikesRatingAverage>
        </div>
      </div>

      <!-- ------------------Comment-------------- -->
      <p class="dark:text-sheger_light_gray-400">
        {{ userReview.comment }}
      </p>

      <!-- ---------------------Actions lists--------------- -->

      <div
        v-if="showActionLists"
        class="absolute bg-white z-50 py-3 px-2 border rounded-md right-10 flex flex-col"
      >
        <!-- ---------------Report review-------------- -->
        <button
          ref="buttonModal"
          @click="showReportReviewModal = !showReportReviewModal"
          class="flex items-center space-x-2"
          :class="isPlaceReview ? 'pb-3 border-b' : ''"
        >
          <Icon
            name="uil:exclamation-circle"
            class="text-black text-xl dark:text-white"
          />

          <p class="whitespace-nowrap dark:text-white">Report Review</p>
        </button>
        <!-- ---------------View review lists-------------- -->

        <button
          v-if="isPlaceReview"
          ref="buttonModal"
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
