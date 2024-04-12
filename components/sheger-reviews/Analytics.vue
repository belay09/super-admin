<script setup>
import getMainLocation from "@/helpers/main-location";
import changeReviewStatus from "@/graphql/mutations/reviews/change-status.gql";
import useNotify from "@/use/notify";
import { onClickOutside } from "@vueuse/core";

/**-------------------------Globals------------------------- */
const { notify } = useNotify();
const route = useRoute();
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const series = ref([
  {
    name: "Score",
    data: [],
  },
]);
const options = ref({
  chart: {
    type: "area",
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },

  colors: ["#D34553"],

  plotOptions: {
    bar: {
      borderRadius: 10,
      borderRadiusApplication: "around",
    },
  },
});
const updateChart = () => {
  //generate array of random numbers of length 10
  const data = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 100)
  );
  options.value = {
    ...options.value,
    xaxis: {
      categories: Array.from(
        { length: 10 },
        (_, i) => new Date().getFullYear() - i
      ), // array of last 10 years
    },
  };

  series.value = [
    {
      name: "Score",
      data: data,
    },
  ];
};

/***---------------------------Main location---------------------- */
const mainLocation = ref(getMainLocation(props.review?.place?.placeLocations));

onMounted(() => {
  updateChart();
});

/**-------------------------update review status------------------------- */
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(changeReviewStatus);

const handleChangeReviewStatus = (newStatus) => {
  editMutate({
    id: route.params.id,
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

  // reviewRefetch();
  // reviewAggregateRefetch();
  toggleDraftModal.value = false;
  togglePublishModal.value = false;
  togglePendingModal.value = false;
  toggleRemoveModal.value = false;
  openActions.value = false;
});

/**-------------------------Modal and dropdown toggle Actions------------------------- */
const openActions = ref(false);

const actionDropDown = ref(null);
onClickOutside(actionDropDown, () => {
  openActions.value = false;
});

const togglePublishModal = ref(false);
const toggleDraftModal = ref(false);
const togglePendingModal = ref(false);
const toggleRemoveModal = ref(false);
</script>

<template>
  <!-------------------------Modal and dropdown toggle Actions------------------------->
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

  <div class="grid grid-cols-6">
    <div class="grid grid-cols-2 col-span-4">
      <!-- -----------------Review Info----------------- -->
      <div class="flex flex-col gap-3 py-4">
        <div class="flex space-x-4">
          <div class="flex flex-col gap-6">
            <!--------------------Place Name and status------------------- -->

            <div class="flex gap-3">
              <h1 class="text-xl font-medium">{{ review.title }}</h1>
              <div>
                <div class="bg-sheger-green-100 px-2 py-0.5 rounded-md">
                  <p class="font-medium text-sheger-green-600">Published</p>
                </div>
              </div>
            </div>

            <!-- -----------------Review rating and like----------- -->

            <ShegerReviewsRatingAndLike
              :rating="review.place_sheger_review?.rate || 0"
              :like="review.review_aggregate_summary?.sumLikes || 0"
            ></ShegerReviewsRatingAndLike>

            <!-- menu update -->
            <div class="flex items-center gap-3">
              <Icon name="carbon:calendar" class="w-5 h-5" />
              <p class="text-sheger-gray-100">Menu last updated: 2 days ago</p>
            </div>
          </div>
        </div>
        <!-- -----------------------ReviewTags ---------------------->
        <div class="flex flex-wrap pb-4 secondary-text">
          <p
            v-for="reviewTag in review.review_tags"
            :key="reviewTag.tag.id"
            class="pr-2"
          >
            #{{ reviewTag.tag.title }}
          </p>
        </div>
      </div>

      <!-- -----------------Place info-------------------- -->
      <div class="relative flex flex-col gap-4 py-3 px-9 border-x">
        <div class="flex items-start justify-between">
          <div class="flex w-full gap-3">
            <!---------------------- Logo--------------------- -->
            <div class="self-start w-20 h-20 mr-1 shrink-0">
              <img
                :src="review?.place?.light_logo?.url"
                alt=""
                class="object-cover w-full h-full rounded-xl"
              />
            </div>
            <div class="flex flex-col w-full gap-2">
              <h1 class="text-xl font-medium">{{ review?.place?.name }}</h1>
              <!-- ----------------Place status and type--------- -->
              <div class="flex flex-wrap gap-x-4 gap-y-2">
                <div class="px-2 py-1 rounded-md bg-sheger-green-100">
                  <p class="font-medium capitalize text-sheger-green-600">
                    {{ review?.place?.status.toLowerCase() }}
                  </p>
                </div>
                <div class="px-2 py-1 rounded-md bg-primary-100">
                  <p class="font-medium capitalize text-primary-600">
                    {{ review?.place.type?.toLowerCase() }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- -----------------Review rating and like----------- -->
        <CommonReviewRatingLike
          :rating="review?.place?.place_aggregate_summary?.avgRating || 0"
          :like="review?.place?.place_aggregate_summary?.sumLikes || 0"
          :review="review?.place?.placeReviewsAggregate?.aggregate?.count || 0"
        ></CommonReviewRatingLike>
        <!-------------------- Location------------------ -->

        <div v-if="mainLocation" class="flex items-center gap-3">
          <Icon name="carbon:map" class="w-5 h-5" />
          <span class="underline decoration-sheger_brown-200 leading"
            >{{ mainLocation.area?.name }}, {{ mainLocation.city?.name }}</span
          >
        </div>

        <!-- -----------Flag icon----------- -->
        <div
          class="absolute top-0 flex items-center justify-center bg-gray-300 border rounded-full -left-4 w-7 h-7"
        >
          <Icon name="heroicons:flag-solid" class="" />
        </div>

        <!-- -----------Flag icon----------- -->
        <div
          class="absolute top-0 flex items-center justify-center bg-gray-300 border rounded-full -right-4 w-7 h-7"
        >
          <Icon name="heroicons:eye-16-solid" class="" />
        </div>
      </div>
    </div>

    <!-- ------------------Visits---------------- -->
    <PlacesVisitors
      :place-id="review?.place.id"
      class="w-full"
    ></PlacesVisitors>
  </div>
</template>
