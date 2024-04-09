<script setup>
const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  imageClass: {
    type: String,
    required: false,
  },

  containerClass: {
    type: String,
    required: false,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const emit = defineEmits(["update:rating"]);
const ratedStars = computed(() => {
  let stars = [];
  for (let i = 0; i < Math.round(props.rating); i++) {
    stars.push(i);
  }
  return stars;
});

const updateRating = (newRating) => {
  if (props.readonly) return;

  emit("update:rating", newRating);
};
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center" :class="containerClass">
      <img
        v-for="i in ratedStars"
        :key="i"
        @click="updateRating(i + 1)"
        @mouseenter="updateRating(i + 1)"
        src="/images/static/rated-star.png"
        alt="rated star image"
        class="shrink-0"
        :class="[!readonly ? 'cursor-pointer' : '', imageClass]"
      />
      <img
        v-for="i in 5 - ratedStars.length"
        :key="i"
        @click="updateRating(ratedStars.length + i)"
        @mouseenter="updateRating(ratedStars.length + i)"
        src="/images/static/un-rated.png"
        alt="unrated star image"
        class="shrink-0"
        :class="[!readonly ? 'cursor-pointer' : '', imageClass]"
      />
    </div>
  </div>
</template>
