<script setup>
/**-------------------------Imports------------------------- */
import formatNumberToShow from "~/helpers/format-number-to-show";
import { formatRelative } from "date-fns";
import changeReviewStatus from "@/graphql/mutations/reviews/change-status.gql";
import useNotify from "@/use/notify";
import { onClickOutside } from "@vueuse/core";

/**-------------------------Globals------------------------- */
const { notify } = useNotify();
const props = defineProps({
  featured: {
    type: Boolean,
    default: false,
  },
  review: {
    type: Object,
    required: true,
  },
});

/**--------------------------Review updated at-------------------------- */
const formatDate = (date) => {
  return formatRelative(new Date(date), new Date());
};

function placeStatus(status) {
  if (status == "ACTIVE") {
    return {
      name: "Active",
      class: "bg-sheger-green-100 px-2 py-1",
    };
  } else if (status == "CLOSED") {
    return {
      name: "Closed",
      class: "bg-red-100 px-2 py-1",
    };
  } else if (status == "PENDING") {
    return {
      name: "Pending",
      class: "bg-yellow-100 px-2 py-1",
    };
  } else if (status == "SUSPENDED") {
    return {
      name: "Suspended",
      class: "bg-sheger-gray-100 px-2 py-1",
    };
  }
}

const reviewRefetch = inject("refetchReview");
const reviewAggregateRefetch = inject("refetchAggregate");
/**-------------------------update review status------------------------- */
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(changeReviewStatus);

const handleChangeReviewStatus = (newStatus) => {
  editMutate({
    id: props.review.id,
    input: {
      status: newStatus,
    },
  });
};

editDone(() => {
  notify({
    title: "Updated successfully",
    description: "Updated successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });

  reviewRefetch();
  reviewAggregateRefetch();
  toggleDraftModal.value = false;
  togglePublishModal.value = false;
  togglePendingModal.value = false;
  toggleRemoveModal.value = false;
  openActions.value = false;
});
const actionDropDown = ref(null);
onClickOutside(actionDropDown, () => {
  openActions.value = false;
});
/**-------------------------Modal and dropdown toggle Actions------------------------- */
const openActions = ref(false);

const togglePublishModal = ref(false);
const toggleDraftModal = ref(false);
const togglePendingModal = ref(false);
const toggleRemoveModal = ref(false);
</script>
<template>
  <!-------------------------Confirmation Modal  Actions------------------------->
  <ModalsConfirmation
    @confirm="handleChangeReviewStatus('PUBLISHED')"
    v-model="togglePublishModal"
    title="Publish Review"
    sure-question="Are you sure you want to publish the review?"
    description="Are you sure you want to publish this review? Once submitted, the content will be publicly available. Please review your comments for accuracy and appropriateness before confirming."
  ></ModalsConfirmation>
  <ModalsConfirmation
    @confirm="handleChangeReviewStatus('DRAFT')"
    v-model="toggleDraftModal"
    title="Save as Draft"
    sure-question="Are you sure you want to save the review as a draft?"
    description="By selecting 'Save as Draft,' your review progress will be saved for future completion. This allows you to revisit and edit your review before final submission. Are you sure you want to make the review a draft?"
  ></ModalsConfirmation>
  <ModalsConfirmation
    @confirm="handleChangeReviewStatus('PENDING')"
    v-model="togglePendingModal"
    title="Change to Pending"
    sure-question="Are you sure you want to save the review as a draft?"
    description="By selecting 'Save as Draft,' your review progress will be saved for future completion. This allows you to revisit and edit your review before final submission. Are you sure you want to make the review a draft?"
  ></ModalsConfirmation>
  <ModalsConfirmation
    @confirm="handleChangeReviewStatus('REMOVED')"
    v-model="toggleRemoveModal"
    title="Remove Review"
    sure-question="Confirm deletion of the review?"
    description="Deleting the review will permanently remove it from our system, and the content will be irretrievable. Please confirm your decision, as this action cannot be undone."
  ></ModalsConfirmation>

  <div
    @click="$router.push(`/app/sheger-reviews/${review.id}`)"
    class="flex cursor-pointer flex-col border w-[397px] p-[25px] rounded-xl m-4 text-sm"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <p class="">ETB 350</p>
        <p class="text-xl font-medium">{{ review.title }}</p>
      </div>
      <!-- Option Icon -->

      <div class="relative">
        <div
          @click.stop="openActions = !openActions"
          class="hover:cursor-pointer"
        >
          <Icon name="iwwa:option" class="w-8 h-8" />
        </div>

        <!-- -----------------------Extend date and Remove from feature --------------- -->
        <div
          ref="actionDropDown"
          v-if="openActions"
          class="absolute left-0 flex flex-col p-5 bg-white rounded-lg shadow-xl top-7 w-72 gap-y-4"
        >
          <button
            @click.stop="togglePublishModal = true"
            class="flex items-center gap-3"
          >
            <Icon
              name="material-symbols:publish-sharp"
              class="text-2xl shrink-0"
            />
            <p class="text-lg">Publish Review</p>
          </button>
          <button
            @click.stop="$router.push(`/app/sheger-reviews/edit/${review.id}`)"
            class="flex items-center gap-3"
          >
            <Icon name="ri:edit-2-line" class="text-2xl shrink-0" />
            <p class="text-lg">Update Review</p>
          </button>
          <button
            @click.stop="toggleDraftModal = true"
            class="flex items-center gap-3"
          >
            <Icon name="carbon:rule-draft" class="text-2xl shrink-0" />
            <p class="text-lg">Save as Draft</p>
          </button>
          <button
            @click.stop="togglePendingModal = true"
            class="flex items-center gap-3"
          >
            <Icon
              name="material-symbols:pending-actions-sharp"
              class="text-2xl shrink-0"
            />
            <p class="text-lg">Change to Pending</p>
          </button>
          <button
            @click.stop="toggleRemoveModal = true"
            class="flex items-center gap-3 text-primary-600"
          >
            <Icon name="ion:remove" class="text-2xl shrink-0" />
            <p class="text-lg">Remove Review</p>
          </button>
        </div>
      </div>
    </div>
    <!-- Body -->
    <div class="flex flex-col gap-4 my-2 text-sheger-gray-100">
      <!-- Rating and like -->

      <CommonReviewRatingLike
        :rating="review.review_aggregate_summary?.avgRating || 0"
        :like="review.review_aggregate_summary?.sumLikes || 0"
        :review="review.reviewAggregate?.aggregate?.count || 0"
      ></CommonReviewRatingLike>

      <div class="flex items-center gap-5">
        <!-- time to prepare  -->
        <div class="flex items-center gap-3">
          <Icon name="wi:time-3" class="w-5 h-5" />
          <p class="">{{ 10 }} Minutes</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon name="quill:paper" class="w-5 h-5" />
          <p class="">Food</p>
        </div>
      </div>
      <!-- Tags -->
      <div class="flex flex-wrap pb-4 secondary-text">
        <p
          v-for="reviewTag in review.review_tags"
          :key="reviewTag.tag.id"
          class="pr-2"
        >
          #{{ reviewTag.tag.title }}
        </p>
      </div>
      <!-- Description -->
      <div v-if="review.sides != null" class="text-sm">
        {{ review.sides }}
      </div>
      <div class="flex w-full gap-3">
        <!-- Logo -->
        <div class="h-20 mr-1 w-28">
          <!-- Image -->
          <img
            :src="review.place.light_logo?.url"
            alt=""
            class="object-cover object-center w-full h-full rounded-xl"
          />
        </div>
        <!-- Middle -->
        <div class="flex flex-col w-full gap-2">
          <!-- Name -->
          <div class="flex justify-between">
            <h1 class="text-xl font-medium">{{ review.place.name }}</h1>
          </div>
          <!-- status -->
          <div class="flex gap-4">
            <div
              class="px-2 py-1"
              :class="placeStatus(review.place.status).class"
            >
              <p class="font-medium text-sheger-green-600">
                {{ placeStatus(review.place.status).name }}
              </p>
            </div>
            <div class="px-2 py-1 bg-primary-100">
              <p class="font-medium capitalize text-primary-600">
                {{ review.place?.type }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- menu update -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="carbon:calendar" class="w-5 h-5" />
          <p class="">Last updated: {{ formatDate(review.updatedAt) }}</p>
        </div>
        <div class="cursor-pointer">
          <Icon name="lets-icons:video-light" class="w-8 h-8" />
        </div>
      </div>
    </div>
  </div>
</template>
