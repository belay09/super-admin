<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const emit = defineEmits(["ratingSelected"]);
const props = defineProps({
  rating: {
    type: Number,
    required: true,
  },

  ratingSize: {
    type: Number,
    required: false,
    default: 20,
  },
  ratingCount: {
    type: Number,
    required: false,
    default: 5,
  },
  activeColor: {
    type: String,
    required: false,
    default: "#d34553",
  },
  inactiveColor: {
    type: String,
    required: false,
    default: "#BBC3CF",
  },
  ratingsContainerClass: {
    type: String,
    required: false,
    default: "",
  },
  textClass: {
    type: String,
    required: false,
    default: "text-sheger_brown-200 dark:text-white",
  },
  showAllStars: {
    type: Boolean,
    default: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex items-center space-x-2 relative">
    <div v-if="showAllStars" class="w-24" :class="ratingsContainerClass">
      <NuxtRating
        :active-color="activeColor"
        :inactive-color="inactiveColor"
        :rating-value="rating"
        :rating-size="`${ratingSize}px`"
        :read-only="!authStore.isLoggedIn || readonly"
        @rating-selected.stop="emit('ratingSelected')"
      ></NuxtRating>
    </div>

    <img
      v-else
      src="/images/static/rated-star.png"
      alt="rated star image"
      class="w-6 h-6 object-cover"
    />
    <p class="secondary-text whitespace-nowrap" :class="textClass">
      ( {{ rating.toFixed(1) }}/{{ ratingCount }})
    </p>
  </div>
</template>
