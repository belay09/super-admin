<script setup>
const openAddReviewModal = ref(false);
const props = defineProps({
  placeType: {
    type: String,
    default: "HOTELS",
  },
});
</script>

<template>
  <ModalsModal
    body-class="!w-[42rem] "
    :auto-close="true"
    v-model="openAddReviewModal"
  >
    <template #content>
      <ShegerReviewsAddReviewRating
        :placeType="placeType"
        @close="openAddReviewModal = false"
      ></ShegerReviewsAddReviewRating>
    </template>
  </ModalsModal>

  <div class="flex flex-col gap-y-3">
    <p class="text-sheger-gray-100">Rating</p>
    <button
      type="button"
      @click="openAddReviewModal = true"
      class="w-full flex justify-between items-center border py-3 rounded-md px-2 hover:border-primary-600"
    >
      <ShegerReviewsRatingAverage
        class="pr-4"
        :rating="3"
        :show-all-stars="true"
        text-class=" pl-2 text-gray-500 font-medium"
        :rating-size="24"
      ></ShegerReviewsRatingAverage>

      <button type="button">
        <Icon name="fluent:open-12-filled" class="text-2xl text-primary-600" />
      </button>
    </button>
  </div>
</template>
