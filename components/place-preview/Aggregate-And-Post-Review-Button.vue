<script setup>
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const emit = defineEmits(["post-review"]);
const props = defineProps({
  totalReviews: {
    type: Number,
    required: false,
    default: 0,
  },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
});

function handlePostReview() {
  if (!authStore.isLoggedIn) {
    router.push("/login");
    return;
  }
  emit("post-review");
}
/*....................Window resize.............*/
const windowSize = ref(null);
onMounted(() => {
  windowSize.value = window.innerWidth;
  window.onresize = () => {
    windowSize.value = window.innerWidth;
  };
});
</script>
<template>
  <div class="flex justify-between py-6 items-start space-x-6 w-full">
    <div class="flex flex-col space-y-4">
      <ReviewsRatingsAndLikesRatingAverage
        class="pr-4"
        :rating="rating"
        :show-all-stars="windowSize < 1024 ? false : true"
        text-class=" pl-2 text-gray-500 font-medium"
        :rating-size="24"
        @rating-selected="emit('post-review')"
      ></ReviewsRatingsAndLikesRatingAverage>
      <ReviewsRatingsAndLikesTotalReviews
        class=":"
        :total-reviews="totalReviews"
        text-class="iphone5:text-black dark:text-white"
      >
      </ReviewsRatingsAndLikesTotalReviews>
    </div>

    <div
      class="flex justify-center py-2.5 px-2 space-x-4 rounded-md bg-primary-600 hover:bg-primary-400 cursor-pointer"
    >
      <Icon name="heroicons:star-20-solid" size="20" color="white" class="" />
      <button
        @click="handlePostReview"
        class="text-white block whitespace-nowrap"
      >
        Post Review
      </button>
    </div>
  </div>
</template>
