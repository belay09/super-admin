<script setup>
import getReviewReviewsQuery from "@/graphql/query/reviews/get-review-reviews.gql";
import useNotify from "@/use/notify";
import deleteMutation from "@/graphql/mutations/review-reviews/delete.gql";

const { notify } = useNotify();
const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
});

const tabs = [
  {
    name: "All",
    value: "all",
  },

  {
    name: "Reported",
    value: "reported",
  },
];

/*...................Review reviews data fetch.............*/
const filter = ref({
  reviewId: {
    _eq: props.review.id,
  },
});
const limit = ref(50);
const offset = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const reviewReviews = ref([]);
const length = ref(0);

const { onResult, onError, loading, refetch, fetchMore } = authListQuery(
  getReviewReviewsQuery,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.reviewReviews) {
    reviewReviews.value = result.data?.reviewReviews;
    length.value = result.data?.reviewAggregate?.aggregate?.count;
  }
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

/*----------------------------Fetch more for small screen--------------------------------------*/

const lastFetched = ref(new Date().getTime());
/**
 * Calls the fetchMore function to retrieve more data if the user scrolls.
 *
 * @return {undefined} No return value.
 */
const callFetchMore = () => {
  if (loading.value || new Date().getTime() - lastFetched.value < 1000) return;
  lastFetched.value = new Date().getTime();

  let newOffset = offset.value + reviewReviews.value.length;
  fetchMore({
    variables: {
      offset: newOffset,
    },
    /**
     * Updates the query result with the new data obtained from a fetchMore operation.
     *
     * @param {object} previousResult - The previous result of the query.
     * @param {object} fetchMoreResult - The new result obtained from the fetchMore operation.
     * @return {object} The updated query result with the merged placeReviews.
     */
    updateQuery: (previousResult, { fetchMoreResult }) => {
      if (!fetchMoreResult) return previousResult;

      const mergedReviewReviews = fetchMoreResult.reviewReviews
        ? [...previousResult.reviewReviews, ...fetchMoreResult.reviewReviews]
        : previousResult.reviewReviews;

      return {
        ...fetchMoreResult,
        reviewReviews: mergedReviewReviews,
      };
    },
  });
};

/**---------------------delete review review---------------- */
const {
  mutate: deleteMutate,
  onDone: deleteDone,
  onError: deleteError,
  loading: deleteLoading,
} = authMutation(deleteMutation);

deleteDone(() => {
  refetch();
  notify({
    title: "Review Deleted",
    description: "Review Deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

deleteError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const handleDelete = (id) => {
  deleteMutate({ id });
};
</script>

<template>
  <div class="max-w-[57rem]">
    <H-Tab :tabs="tabs" tab-class="text-xl " tab-container-class="gap-x-12">
    </H-Tab>

    <div class="h-screen overflow-scroll scroll">
      <ShegerReviews-UserReviewItem
        v-for="userReview in reviewReviews"
        :key="userReview.id"
        :userReview="userReview"
        @delete-review="handleDelete"
      ></ShegerReviews-UserReviewItem>
    </div>
  </div>
</template>
