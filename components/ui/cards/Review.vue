<script setup>
/**-------------------------Imports------------------------- */
import formatNumberToShow from "~/helpers/format-number-to-show";
import { formatRelative } from "date-fns";

/**-------------------------Globals------------------------- */
defineProps({
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
</script>
<template>
  <NuxtLink
    :to="`/app/sheger-reviews/${review.id}`"
    class="flex flex-col border w-[397px] p-[25px] rounded-xl m-4 text-sm"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <p class="">ETB 350</p>
        <p class="text-xl font-medium">{{ review.title }}</p>
      </div>
      <!-- Option Icon -->
      <div class="hover:cursor-pointer">
        <Icon name="iwwa:option" class="w-8 h-8" />
      </div>
    </div>
    <!-- Body -->
    <div class="flex flex-col gap-4 my-2 text-sheger-gray-100">
      <!-- Rating and like -->
      <div class="flex items-center space-x-4">
        <!-- Rating -->
        <div class="flex items-center gap-2">
          <Icon name="iwwa:star" class="text-xl text-black" />
          <p class="">
            3/5
            <span class=""
              >({{
                formatNumberToShow(review.reviewAggregate?.aggregate?.count)
              }}
              reviews)</span
            >
          </p>
        </div>
        <!-- dash -->
        <div>
          <p class="">|</p>
        </div>
        <!-- Like -->
        <div class="flex items-center gap-2">
          <Icon name="heroicons:heart-solid" class="w-6 h-6" />

          <p class="">
            {{ formatNumberToShow(review.review_aggregate_summary?.sumLikes) }}
            <span class="">Likes</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-5">
        <!-- time to prepare  -->
        <div class="flex items-center gap-3">
          <Icon name="wi:time-3" class="h-5 w-5" />
          <p class="">{{ review.timeToPrepare }} Minutes</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon name="quill:paper" class="h-5 w-5" />
          <p class="">Food</p>
        </div>
      </div>
      <!-- Tags -->
      <div class="flex flex-wrap secondary-text pb-4">
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
      <div class="flex gap-3 w-full">
        <!-- Logo -->
        <div class="w-20 h-20 mr-1">
          <!-- Image -->
          <img
            src="/images/temporary/Hotel_Logo.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </div>
        <!-- Middle -->
        <div class="flex flex-col gap-2 w-full">
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
              <p class="text-sheger-green-600 font-medium">
                {{ placeStatus(review.place.status).name }}
              </p>
            </div>
            <div class="bg-primary-100 px-2 py-1">
              <p class="text-primary-600 font-medium capitalize">
                {{ review.place?.type }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- menu update -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Icon name="carbon:calendar" class="h-5 w-5" />
          <p class="">Last updated: {{ formatDate(review.updatedAt) }}</p>
        </div>
        <div class="cursor-pointer">
          <Icon name="lets-icons:video-light" class="h-8 w-8" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
