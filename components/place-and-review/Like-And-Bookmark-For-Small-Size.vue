<script setup>
import useNotify from "@/use/notify";

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
</script>

<template>
  <div class="flex items-center space-x-2">
    <button>
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
      <button>
        <Icon
          :class="positiveStyle"
          size="22"
          name="iconoir:bookmark-solid"
          class="text-primary-600"
        />
      </button>
    </div>
  </div>
</template>
