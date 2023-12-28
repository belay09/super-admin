<script setup>
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
</script>

<template>
  <div class="max-w-6xl">
    <H-Tab :tabs="tabs" tab-class="text-xl " tab-container-class="gap-x-12">
      <template #all>
        <div class="h-screen overflow-scroll scroll">
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
        </div>
      </template>

      <template #reported>
        <div class="">
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
          <ShegerReviews-UserReview></ShegerReviews-UserReview>
        </div>
      </template>
    </H-Tab>
  </div>
</template>
