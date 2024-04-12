<script setup>
import editReviewAdMutation from "@/graphql/mutations/review-ads/edit.gql";
import getReviewAdQuery from "@/graphql/query/review-ads/item.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const refetchAds = inject("refetchAds");
const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});

/***---------------------Tab--------------------- */
const { handleSubmit, isSubmitting } = useForm({});

/*...................Place detail data fetch.............*/
const reviewId = ref(0);
const startDate = ref("");
const endDate = ref("");
const images = ref([]);

const {
  onResult: reviewAdOnResult,
  onError: reviewAdOnError,
  loading: reviewAdLoading,
} = authItemQuery(getReviewAdQuery, props.id);

reviewAdOnResult((result) => {
  if (result.data?.reviewAdsByPk) {
    reviewId.value = result.data.reviewAdsByPk.review?.id;
    // startDate.value = reviewAdsByPk.startDate;
    // endDate.value = reviewAdsByPk.endDate;
    images.value = reviewAdsByPk.review_ad_medias?.map(
      (adMedia) => adMedia.media?.url
    );
  }
});

reviewAdOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const { mutate, onDone, onError, loading } = authMutation(editReviewAdMutation);
/**-----------------------Handle add --------------------------- */
const handleEdit = handleSubmit(() => {
  if (images.value.length == 0) {
    notify({
      title: "Images required",
      description: "Please add at least one images",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });

    return;
  }
  let input = {
    slogan: slogan.value,
    startDate: startDate.value,
    endDate: endDate.value,

    reviewId: reviewId.value,
  };

  let reviewAdMedias = images.value.map((image) => ({
    reviewAdId: props.id,
    media: {
      data: {
        url: image,
      },
    },
  }));
  mutate({ input, id: props.id, reviewAdMedias });
});

onDone(() => {
  notify({
    title: "Ad space updated",
    description: "Ad space updated successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });

  open.value = false;
  if (refetchAds) {
    refetchAds();
  }
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <ModalsModal body-class="max-w-[40rem] !p-12" v-model="open">
    <template #header>
      <h2 class="leading-6 text-xl text-gray-900 pb-6">Edit Ad Space</h2>
    </template>
    <template #content>
      {{ id }}
      <!-- Skeleton container for the form -->
      <div v-if="reviewAdLoading" class="flex flex-col space-y-4">
        <!-- Title skeleton -->
        <div class="flex flex-col space-y-4">
          <div class="skeleton w-1/3 h-8"></div>
          <div class="skeleton w-full h-12"></div>
        </div>

        <!-- Price skeleton -->
        <div class="flex flex-col space-y-4">
          <div class="skeleton w-1/3 h-8"></div>
          <div class="skeleton w-full h-12"></div>
        </div>
        <!-- Description skeleton -->
        <div class="flex flex-col space-y-4">
          <div class="skeleton w-1/3 h-8"></div>
          <div class="skeleton w-full h-36"></div>
        </div>
        <!-- Image Upload skeleton -->
        <div class="skeleton w-full h-36"></div>

        <!-- Submit button skeleton -->
        <div class="skeleton w-full h-12"></div>
        <div class="skeleton w-full h-12"></div>
      </div>
      <form
        v-else
        @submit.prevent="handleEdit"
        class="flex flex-col space-y-2"
        action=""
      >
        <!-- ------------------Review---------------- -->
        <Selectors-Review v-model="reviewId"> </Selectors-Review>

        <!-- -----------------Start and End Date -->
        <div class="flex items-center justify-between pt-6 gap-x-6">
          <HDatePicker
            id="start_date"
            name="start_date"
            label="Start Date"
            class="w-full"
            rules="required"
            trailing-icon="uil:calender"
            trailing-icon-class="lg:text-sheger-gray-100"
            v-model="startDate"
          ></HDatePicker>
          <HDatePicker
            id="end_date"
            name="end_date"
            rules="required"
            label="End Date"
            trailing-icon="uil:calender"
            trailing-icon-class="lg:text-sheger-gray-100"
            class="w-full"
            v-model="endDate"
          ></HDatePicker>
        </div>

        <!----------------------------------------upload images ---------------------------------------->

        <div class="flex flex-col gap-y-4 pt-4">
          <p class="mb-2 text-sheger-gray-100">Upload images</p>

          <HFileUploadWrapper
            name="adImages"
            :maxFileSize="1024 * 1024 * 10"
            :fileLimit="5"
            folder=""
            description="upload file"
            placeholder="select multiple files"
            v-model="images"
            :init="images"
            :disabled="false"
            :showStar="false"
          />
        </div>
        <!-- ----------------------Submit------------------- -->
        <button
          :disabled="loading"
          type="submit"
          class="primary-button text-white bg-primary-600 mt-4"
        >
          <span>Edit</span>
          <Icon name="uil:edit" class="text-2xl"></Icon>
          <Icon
            v-if="loading"
            name="eos-icons:bubble-loading"
            class="text-3xl text-white"
          />
        </button>
      </form>
    </template>
  </ModalsModal>
</template>
