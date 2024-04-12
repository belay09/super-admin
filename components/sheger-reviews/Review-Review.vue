<script setup>
const openAddReviewModal = ref(false);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  placeType: {
    type: String,
    default: "HOTELS",
  },
  averageRating: {
    type: Number,
    default: 0,
  },
});

const showAverageRating = ref(true);
watch(
  () => props.averageRating,
  (newVal) => {
    showAverageRating.value = false;
    setTimeout(() => {
      showAverageRating.value = true;
    }, 10);
  }
);
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
        :modelValue="modelValue"
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
      <NuxtRating
        v-if="showAverageRating"
        class="w-6 h-6"
        :rating-value="averageRating"
        :active-color="'#d34553'"
        :inactive-color="'#BBC3CF'"
      ></NuxtRating>

      <button type="button">
        <Icon name="fluent:open-12-filled" class="text-2xl text-primary-600" />
      </button>
    </button>
  </div>
</template>
