<script setup>
import { useAuthStore } from "@/stores/auth.js";
import getReviewReports from "@/graphql/query/reports/getReviewReports.gql";
import reportPlaceUserReview from "@/graphql/mutations/place-reviews/report-review.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["close"]);

const props = defineProps({
  userReviewId: {
    type: Number,
    required: true,
  },
});

/**-------------------------Fetch report types------------------------- */
const filter = ref({});
const limit = ref(0);
const offset = ref(0);
const sort = ref([{}]);
const basicsReviewReportTypes = ref([]);
const length = ref(0);

const { onResult, onError, loading } = anonymousListQuery(
  getReviewReports,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.basicsReviewReportTypes) {
    basicsReviewReportTypes.value = result.data?.basicsReviewReportTypes;
  }
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: "Some thing wrong or your reported the review before",
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-----------------------Report review------------------------ */
const reportValue = ref("");

// Report place user review
const {
  mutate: reportPlaceUserReviewMutate,
  onDone: reportPlaceUserReviewDone,
  onError: reportPlaceUserReviewError,
  loading: reportPlaceUserReviewLoading,
} = authMutation(reportPlaceUserReview);

reportPlaceUserReviewDone((result) => {
  notify({
    title: "Reported ",
    description: "Thank you for your report",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  emit("close");
});
reportPlaceUserReviewError((error) => {
  notify({
    title: "Some thing went wrong",
    description: "Some thing wrong or you reported the review before",
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
  emit("close");
});

function handleReportReview() {
  reportPlaceUserReviewMutate({
    input: {
      placeReviewId: props.userReviewId,
      type: reportValue.value,
    },
  });
}
</script>

<template>
  <div
    v-if="!loading"
    class="iphone5:w-full iphone5:px-5 z-20 md:px-10 xl:max-w-2xl xl:min-w-[36rem] xl:pb-10 mx-auto iphone5:my-5 md:mt-20 xl:mt-0 xl:relative"
  >
    <div class="flex justify-between my-8 w-full">
      <div class="flex flex-col space-y-4">
        <p class="whitespace-nowrap xl:text-xl font-medium dark:text-white">
          Report
        </p>
      </div>
      <button
        class="self-start focus:border-none focus:ring-0 focus:outline-none"
      >
        <Icon
          @click="emit('close')"
          name="heroicons:x-mark-20-solid"
          class="text-2xl cursor-pointer dark:text-white"
        />
      </button>
    </div>

    <form action="" @submit.prevent="handleReportReview">
      <div class="flex flex-wrap gap-x-2 gap-y-8">
        <button
          type="button"
          v-for="report in basicsReviewReportTypes"
          :key="report.value"
          @click="reportValue = report.value"
          :class="
            reportValue === report.value ? 'bg-primary-600 text-white' : ''
          "
          class="flex items-center space-x-2 bg-gray-100 rounded-full py-2 px-4 text-sheger_dark_gray-200 text-sm dark:text-white dark:bg-sheger_brown-300 dark:border duration-300"
        >
          <Icon
            name="grommet-icons:like"
            size="16"
            color=""
            class="dark:text-white"
          />
          <p class="whitespace-nowrap text-inherit">
            {{ report.value }}
          </p>
        </button>
      </div>
      <button
        :disabled="reportValue == ''"
        class="bg-primary-600 py-3 px-6 text-center block w-full mt-8 rounded-md font-bold text-white"
        :class="reportValue == '' ? 'bg-opacity-50' : ''"
      >
        {{
          reportPlaceUserReviewLoading || reportReviewUserReviewLoading
            ? "Loading..."
            : "Report Review"
        }}
      </button>
    </form>
  </div>
</template>
