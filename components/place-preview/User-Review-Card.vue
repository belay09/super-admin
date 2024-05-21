<script setup>
import { format, parse } from "date-fns";
import deletePlaceReviewMutation from "@/graphql/mutations/place-reviews/delete.gql";
import { useAuthStore } from "@/stores/auth.js";
import { onClickOutside } from "@vueuse/core";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["refetch"]);
const authStore = useAuthStore();
const props = defineProps({
  isMyReview: {
    type: Boolean,
    default: false,
    required: false,
  },
  review: {
    type: Object,
    required: true,
  },
});

const featuredMedia = computed(() => {
  return (
    props.review.place.featured_medias?.url ||
    props.review.placeMedias[0]?.media.url ||
    ""
  );
});

const showReportReviewButton = ref(false);
const showReportReviewModal = ref(false);
const showUpdateAndDeleteButtons = ref(false);
const showUpdateReviewModal = ref(false);
const showDeleteReviewModal = ref(false);
const topMoreIcon = ref(true);

const buttonModal = ref(null);
const updateAndDeleteModal = ref(null);
onClickOutside(buttonModal, () => {
  showReportReviewButton.value = false;
});
onClickOutside(updateAndDeleteModal, () => {
  showUpdateAndDeleteButtons.value = false;
});

/**----------------------Handle delete review-------------------------- */

const {
  mutate: deleteReviewMutate,
  onDone: deleteReviewDone,
  onError: deleteReviewError,
  loading: deleteReviewLoading,
} = authMutation(deletePlaceReviewMutation);

deleteReviewDone((result) => {
  showDeleteReviewModal.value = false;
  notify({
    title: "Deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  emit("refetch");
});
deleteReviewError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

function deleteReview() {
  deleteReviewMutate({
    id: props.review.id,
  });
}

const handleMoreIconClick = (isTop) => {
  topMoreIcon.value = isTop;
  if (props.isMyReview) {
    showUpdateAndDeleteButtons.value = !showUpdateAndDeleteButtons.value;
  } else {
    showReportReviewButton.value = !showReportReviewButton.value;
  }
};
</script>

<template>
  <div class="relative border rounded-lg w-full dark:border-darkBorder">
    <ModalsModal
      v-if="authStore.isLoggedIn"
      :auto-close="true"
      v-model="showReportReviewModal"
    >
      <template #content>
        <Place-ReportPlaceReview
          @close="showReportReviewModal = false"
          :userReviewId="review.id"
          reviewedType="placeUserReview"
        ></Place-ReportPlaceReview>
      </template>
    </ModalsModal>

    <!-- ------------------Edit review modal---------------- -->

    <ModalsModal :auto-close="true" v-model="showUpdateReviewModal">
      <template #content>
        <Place-EditPlaceReview
          @close="showUpdateReviewModal = false"
          @onDone="emit('refetch')"
          :user-review="review"
        ></Place-EditPlaceReview>
      </template>
    </ModalsModal>

    <ModalsModal :auto-close="true" v-model="showDeleteReviewModal">
      <template #content>
        <Place-DeletePlaceReview
          @close="showDeleteReviewModal = false"
          @deleteReview="deleteReview"
        />
      </template>
    </ModalsModal>
    <div class="flex md:space-x-5 w-full iphone5:p-4 samsg:p-5">
      <div class="w-[10rem] hidden md:block">
        <img
          :src="featuredMedia"
          alt="place logo"
          class="w-full h-full min-h-[163px]"
        />
      </div>
      <div class="flex flex-col space-2-4 w-full md:w-2/3">
        <div class="flex justify-between items-center">
          <p class="dark:text-white">{{ review.place?.name }}</p>
          <button class="md:hidden" @click="handleMoreIconClick(true)">
            <Icon
              name="fontisto:more-v"
              class="text-black text-sm dark:text-white"
            />
          </button>
        </div>

        <ReviewsRatingsAndLikesRatingAverage
          class="pr-4"
          :rating="review.rating || 0"
          :show-all-stars="true"
          text-class=" pl-2 text-gray-500 font-medium"
          :rating-size="23"
        ></ReviewsRatingsAndLikesRatingAverage>

        <p
          class="text-sheger_brown-200 text-left dark:text-sheger_light_gray-400 line-clamp-5"
        >
          {{ review.comment }}
        </p>
      </div>
    </div>
    <div class="flex justify-between items-center px-5 pb-5">
      <div class="flex items-center space-x-4">
        <div v-if="!isMyReview" class="flex items-center space-x-5">
          <img
            v-if="!review.user?.photoUrl"
            class="w-16 h-16 rounded-full object-center"
            src="/images/temporary/default-profile.png"
            alt="profile image"
          />
          <img
            v-else
            class="w-16 h-16 rounded-full object-center"
            :src="review.user?.photoUrl"
            alt="profile image"
          />

          <div>
            <p class="dark:text-white">{{ review.user?.fullName }}</p>
            <p class="dark:text-white">
              {{ format(new Date(review.createdAt), " dd MMM, yyyy") }}
            </p>
          </div>
        </div>
        <p v-else class="dark:text-white">
          {{ format(new Date(review.createdAt), " dd MMM, yyyy") }}
        </p>
      </div>
      <button @click="handleMoreIconClick(false)" class="hidden md:block">
        <Icon
          name="fontisto:more-v"
          class="text-black text-xl dark:text-white"
        />
      </button>
    </div>
    <button
      ref="buttonModal"
      @click="
        showReportReviewModal = true;
        showReportReviewButton = false;
      "
      v-if="showReportReviewButton"
      class="absolute z-50 py-3 border rounded-md right-10 flex items-center"
      :class="topMoreIcon ? 'top-2 px-1 space-x-2' : 'bottom-5 px-4 space-x-4'"
    >
      <Icon
        name="uil:exclamation-circle"
        class="text-black text-xl dark:text-white"
      />

      <p class="whitespace-nowrap dark:text-white">Report Review</p>
    </button>

    <!-- -----------------Update and Delete buttons---------------- -->
    <div
      ref="updateAndDeleteModal"
      v-if="showUpdateAndDeleteButtons"
      class="absolute z-50 py-2 border rounded-md px-2 bg-white flex flex-col space-y-2 dark:bg-sheger_brown-300 dark:border-sheger_brown-100 dark:text-white"
      :class="topMoreIcon ? 'right-12 top-5' : 'right-12 bottom-0'"
    >
      <button
        class="flex items-center border-b dark:border-gray-500 py-2"
        :class="topMoreIcon ? ' px-1 space-x-2' : ' px-4 space-x-4'"
        @click="
          showUpdateReviewModal = true;
          showUpdateAndDeleteButtons = false;
        "
      >
        <Icon
          name="uil:edit-alt"
          class="text-black font-medium text-xl dark:text-white"
        />

        <p class="whitespace-nowrap">Update Review</p>
      </button>

      <button
        @click="
          showDeleteReviewModal = true;
          showUpdateAndDeleteButtons = false;
        "
        class="flex items-center pb-2"
        :class="topMoreIcon ? ' px-1 space-x-2' : ' px-4 space-x-4'"
      >
        <Icon
          name="heroicons:trash"
          class="text-black font-medium text-xl dark:text-white"
        />

        <p class="whitespace-nowrap">Delete Review</p>
      </button>
    </div>
  </div>
</template>
