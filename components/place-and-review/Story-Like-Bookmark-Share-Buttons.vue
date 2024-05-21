<script setup>
import { useAuthStore } from "@/stores/auth";
import insertBookmark from "@/composables/boomark/book.js";
import deleteBookmark from "@/composables/boomark/unbook.js";
import insertLike from "@/composables/like/like.js";
import deleteLike from "@/composables/like/unlike.js";

import formatNumberToShow from "~/helpers/format-number-to-show";

/*----------------------------Global Variables---------------------------*/

const router = useRouter();
const authStore = useAuthStore();

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    default: "place",
  },
  isItemBookmarked: {
    type: Boolean,
    default: false,
  },
  isItemLiked: {
    type: Boolean,

    default: false,
  },
  totalLikes: {
    type: Number,
    default: 0,
  },
});

const isLiked = ref(props.isItemLiked);
const isBookmarked = ref(props.isItemBookmarked);

/**------------------------- bookmark--------------------- */
const handleBookmark = () => {
  const { loading, onError, onDone } = insertBookmark(props.id, props.type);
  onDone((result) => {
    isBookmarked.value = true;
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
    isBookmarked.value = false;
  });
};

function handleBookmarkAndUnBookmark() {
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
    isLiked.value = !isLiked.value;
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
    isLiked.value = !isLiked.value;
  });
};

function handleLikeAndUnLike() {
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

/**-----------------------Share---------------- */

const showShareModal = ref(false);
</script>
<template>
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
  <!-- ------------------Like, Bookmark and Share---------------- -->
  <div
    class="absolute flex flex-col space-y-4 right-4 samsg:right-5 md:right-8 bottom-[35%]"
  >
    <div>
      <button
        @click.stop="handleLikeAndUnLike"
        class="bg-gray-900 bg-opacity-40 w-11 h-11 flex flex-col justify-center items-center rounded-full"
      >
        <Icon
          name="zondicons:heart"
          class="text-3xl hidden md:block"
          :class="isLiked ? 'text-primary-600' : 'text-white '"
        />
      </button>
      <p class="text-white text-center">{{ formatNumberToShow(totalLikes) }}</p>
    </div>
    <button
      @click.stop="handleBookmarkAndUnBookmark"
      class="bg-gray-900 bg-opacity-40 w-11 h-11 flex flex-col justify-center items-center rounded-full"
    >
      <Icon
        name="clarity:bookmark-solid"
        class="text-primary-600 text-3xl hidden md:block"
        :class="isBookmarked ? 'text-primary-600' : 'text-white '"
      />
    </button>
    <button
      @click.stop="showShareModal = true"
      class="bg-gray-900 bg-opacity-40 w-11 h-11 flex flex-col justify-center items-center rounded-full"
    >
      <Icon name="uil:share-alt" class="text-white text-3xl hidden md:block" />
    </button>
  </div>
</template>
