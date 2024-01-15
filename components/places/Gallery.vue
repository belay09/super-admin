<script setup>
import deletePlaceMediaMutation from "@/graphql/mutations/medias/deletePlaceMedia.gql";
import deleteReviewMediaMutation from "@/graphql/mutations/medias/deleteReviewMedia.gql";

import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */
const emit = defineEmits(["onDeleted"]);
const props = defineProps({
  type: {
    type: String,
    default: "place",
  },
  media: {
    type: Object,
    required: true,
  },
});
const { notify } = useNotify();

/**------------------------Handle delete--------------------- */

const { mutate, onDone, onError, loading } = authMutation(
  props.type == "place" ? deletePlaceMediaMutation : deleteReviewMediaMutation
);

function handleDelete() {
  mutate({
    id: props.media.id,
  });
}
onDone((result) => {
  emit("onDeleted");
  notify({
    title: "Success",
    description: "Media deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  notify({
    title: "Error",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const hovered = ref(false);
const onHover = () => {
  hovered.value = !hovered.value;
};
function showDelete() {
  hovered.value = true;
}
function hideDelete() {
  hovered.value = false;
}
</script>

<template>
  <div class="relative">
    <img
      :src="media?.media?.url"
      class="w-full h-[22rem] hover:blur-sm"
      loading="lazy"
      :class="hovered ? 'blur-sm' : 'blur-0'"
      alt="Place  image"
      @mouseover="showDelete"
      @mouseleave="hideDelete"
    />
    <button
      @click="handleDelete"
      v-show="hovered"
      @mouseover="showDelete"
      @mouseleave="hideDelete"
      class="absolute inset-0 z-40 border border-white py-3 px-4 rounded-md w-32 h-12 mx-auto my-auto text-white"
    >
      Delete
    </button>
  </div>
</template>
