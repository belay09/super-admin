<script setup>
const emit = defineEmits(["like", "bookmark", "share"]);
const props = defineProps({
  liked: Boolean,
  bookmarked: Boolean,
  
});
/*.. ..................Like.......................*/
const isLiked = ref(props.liked);
const like = () => {
  isLiked.value = !isLiked.value;
  emit("like", isLiked.value);
};

/*................... Bookmark.....................*/

const isBookmarked = ref(props.bookmarked);
const bookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  emit("bookmark", isBookmarked.value);
};
</script>

<template>
  <div class="flex space-x-4 xl:space-x-6 justify-end items-center my-10">
    <button @click="like" class="box" :class="{ 'liked-bookmarked': isLiked }">
      <Icon name="uil:heart" class="" />
      <p class="whitespace-nowrap">2.3K Likes</p>
    </button>
    <button
      @click="bookmark"
      class="box"
      :class="{ 'liked-bookmarked': isBookmarked }"
    >
      <Icon name="uil:bookmark" class="" />
      <p class="whitespace-nowrap">Bookmark</p>
    </button>
    <button class="box">
      <Icon name="uil:share-alt" class="" />
      <p class="whitespace-nowrap">Share</p>
    </button>
  </div>
</template>

<style scoped>
.box {
  @apply flex justify-center items-center py-2.5 px-2 xl:px-4 space-x-2 xl:space-x-4 rounded-md border text-sheger_brown-200 xl:text-xl dark:text-white;
}

.liked-bookmarked {
  @apply bg-primary-600 text-white;
}
</style>
