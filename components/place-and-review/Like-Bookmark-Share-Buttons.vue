<script setup>
import useNotify from "@/use/notify";
import insertBookmark from "@/composables/boomark/book.js";
import deleteBookmark from "@/composables/boomark/unbook.js";
import insertLike from "@/composables/like/like.js";
import deleteLike from "@/composables/like/unlike.js";
import { useAuthStore } from "@/stores/auth";

const emit = defineEmits(["share"]);
const props = defineProps({
  id: String,
  type: String,
  name: String,
  description: String,
});

const { notify } = useNotify();
const showShareModal = ref(false);
const authStore = useAuthStore();
const shareText = ref("");

const isLiked = inject("isLiked");
const isBookmarked = inject("isBookmarked");
const itemBookmarkCount = inject("itemBookmarkCount");
const itemLikeCount = inject("itemLikeCount");

/*...................Bookmark.....................*/

const handleBookmark = () => {
  if (!authStore.isLoggedIn) {
    notify({
      title: "You need to login first",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });

    return;
  }
  const { loading, onError, onDone } = insertBookmark(props.id, props.type);

  onDone(() => {
    // notify({
    //   title: "Bookmarked successfully",
    //   type: "success",
    //   borderClass: "border-l-8 border-green-300",
    // });
    itemBookmarkCount.value += 1;
    isBookmarked.value = !isBookmarked.value;
  });

  onError((error) => {
    notify({
      title: "Some thing went wrong",
      description: error.message,
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
  });
};

// /*...................UnBookmark.....................*/

const handleUnBookmark = () => {
  const { loading, onError, onDone } = deleteBookmark(
    props.id,
    authStore.hasuraUserId,
    props.type
  );

  onDone(() => {
    // notify({
    //   title: "UnBookmarked successfully",
    //   type: "success",
    //   borderClass: "border-l-8 border-green-300",
    // });
    itemBookmarkCount.value -= 1;
    isBookmarked.value = !isBookmarked.value;
  });

  onError((error) => {
    notify({
      title: "Some thing went wrong",
      description: error.message,
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
  });
};

/*.. ..................Like.......................*/

const handleLike = () => {
  if (!authStore.isLoggedIn) {
    notify({
      title: "You need to login first",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });

    navigateTo("/login");
    return;
  }
  const { loading, onError, onDone } = insertLike(props.id, props.type);

  onDone(() => {
    // notify({
    //   title: "Liked successfully",
    //   type: "success",
    //   borderClass: "border-l-8 border-green-300",
    // });
    isLiked.value = !isLiked.value;
    itemLikeCount.value = itemLikeCount.value + 1;
    emit("like", isLiked.value);
  });

  onError((error) => {
    notify({
      title: "Some thing went wrong",
      description: error.message,
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
  });
};

/*................... UnLike.....................*/
const handleUnLike = () => {
  const { loading, onError, onDone } = deleteLike(
    props.id,
    authStore.hasuraUserId,
    props.type
  );

  onDone(() => {
    // notify({
    //   title: "UnLiked successfully",
    //   type: "success",
    //   borderClass: "border-l-8 border-green-300",
    // });
    isLiked.value = !isLiked.value;
    itemLikeCount.value = itemLikeCount.value - 1;
    emit("like", isLiked.value);
  });

  onError((error) => {
    notify({
      title: "Some thing went wrong",
      description: error.message,
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
  });
};

// /*...................Share.....................*/
const handleShare = () => {
  shareText.value = encodeURIComponent(`
  Check out this ${props.type} on Sheger 
  ${props.name}
  `);
  showShareModal.value = true;
};
</script>

<template>
  <div class="flex space-x-4 xl:space-x-6 justify-end items-center my-10">
    <button v-if="!isLiked" @click="handleLike" class="box">
      <Icon name="uil:heart" class="" />
      <p class="whitespace-nowrap">{{ itemLikeCount || 0 }} Likes</p>
    </button>
    <button v-else @click="handleUnLike" class="box liked-bookmarked">
      <Icon name="uil:heart" class="" />
      <p class="whitespace-nowrap">{{ itemLikeCount }} Likes</p>
    </button>

    <button
      v-if="isBookmarked"
      @click="handleUnBookmark"
      class="box liked-bookmarked"
    >
      <Icon name="uil:bookmark" class="" />
      <p class="whitespace-nowrap">{{ itemBookmarkCount || 0 }} Bookmarks</p>
    </button>
    <button v-else @click="handleBookmark" class="box">
      <Icon name="uil:bookmark" class="" />
      <p class="whitespace-nowrap">{{ itemBookmarkCount }} Bookmarks</p>
    </button>

    <button class="box" @click="handleShare">
      <Icon name="uil:share-alt" class="" />
      <p class="whitespace-nowrap">Share</p>
    </button>
  </div>
  <div>
    <ModalsModal :auto-close="true" v-model="showShareModal">
      <template #content>
        <HShare
          :modelValue="showShareModal"
          @closeShareModal="showShareModal = false"
          :url="`/`"
          :text="shareText"
        />
      </template>
    </ModalsModal>
  </div>
</template>

<style scoped>
.box {
  @apply flex justify-center items-center py-2.5 px-2 xl:px-4 space-x-2 xl:space-x-4 rounded-md border text-sheger_brown-200 xl:text-xl dark:text-white hover:bg-primary-400 hover:text-white;
}

.liked-bookmarked {
  @apply bg-primary-600 text-white;
}
</style>
