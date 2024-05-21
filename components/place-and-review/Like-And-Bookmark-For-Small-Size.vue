<script setup>
import useNotify from "@/use/notify";
import insertBookmark from "@/composables/boomark/book.js";
import deleteBookmark from "@/composables/boomark/unbook.js";
import insertLike from "@/composables/like/like.js";
import deleteLike from "@/composables/like/unlike.js";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const { notify } = useNotify();
const authStore = useAuthStore();
const emit = defineEmits(["like", "unLike", "book", "unBook", "share"]);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: "place",
  },
  style: {
    type: String,
    default: "",
  },
  // liked or bookmarked style
  positiveStyle: {
    type: String,
    default: "",
  },
  // not liked and booked  style

  negativeStyle: {
    type: String,
    default: "",
  },
  showBookmarkCount: Boolean,
  bookmarkCountStyle: String,
});

const isLiked = inject("isLiked");
const isBookmarked = inject("isBookmarked");
const itemBookmarkCount = inject("itemBookmarkCount");
const itemLikeCount = inject("itemLikeCount");

/**-------------------------Place bookmark--------------------- */

const handleBookmark = () => {
  const { loading, onError, onDone } = insertBookmark(props.id, props.type);

  onDone((result) => {
    // notify({
    //   title: "Bookmarked successfully",
    //   type: "success",
    //   borderClass: "border-l-8 border-green-300",
    // });
    isBookmarked.value = true;
    itemBookmarkCount.value += 1;
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

/*...................UnBookmark.....................*/

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
    isBookmarked.value = false;
    itemBookmarkCount.value -= 1;
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

function handleBookmarkAndUnBookmark(event) {
  event.stopPropagation();
  event.preventDefault();
  if (authStore.isLoggedIn) {
    if (isBookmarked.value) {
      handleUnBookmark();
    } else {
      handleBookmark();
    }
  } else {
    router.push("/login");
  }
}

/**-------------------------Like--------------------- */

const handleLike = () => {
  const { loading, onError, onDone } = insertLike(props.id, props.type);

  onDone(() => {
    // notify({
    //   title: "Liked successfully",
    //   type: "success",
    //   borderClass: "border-l-8 border-green-300",
    // });
    itemLikeCount.value += 1;
    isLiked.value = !isLiked.value;
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

/**-------------------------Unlike--------------------- */

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
    itemLikeCount.value -= 1;
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

function handleLikeAndUnLike(event) {
  event.stopPropagation();
  event.preventDefault();
  if (authStore.isLoggedIn) {
    if (isLiked.value) {
      handleUnLike();
    } else {
      handleLike();
    }
  } else {
    router.push("/login");
  }
}
</script>

<template>
  <div class="flex items-center space-x-2">
    <button @click="handleLikeAndUnLike">
      <Icon
        v-if="isLiked"
        :class="positiveStyle"
        name="teenyicons:heart-solid"
        class="text-primary-600 text-xl"
      />
      <Icon
        v-else
        :class="negativeStyle"
        name="teenyicons:heart-outline"
        class="dark:text-white iphone5:text-xl"
      />
    </button>
    <div class="flex gap-x-1 items-center">
      <button @click="handleBookmarkAndUnBookmark">
        <Icon
          v-if="isBookmarked"
          :class="positiveStyle"
          size="22"
          name="iconoir:bookmark-solid"
          class="text-primary-600"
        />
        <Icon
          :class="negativeStyle"
          v-else
          size="22"
          name="iconoir:bookmark"
          class="dark:text-white"
        />
      </button>
      <p v-if="showBookmarkCount" :class="bookmarkCountStyle || ''" class="">
        {{ itemBookmarkCount || 0 }}
      </p>
    </div>
  </div>
</template>
