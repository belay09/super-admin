<script setup>
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
    <button class="box">
      <Icon name="uil:heart" class="" />
      <p class="whitespace-nowrap">0 Likes</p>
    </button>

    <button class="box liked-bookmarked">
      <Icon name="uil:bookmark" class="" />
      <p class="whitespace-nowrap">6 Bookmarks</p>
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
  @apply flex justify-center items-center py-2.5 px-2 xl:px-4 space-x-2 xl:space-x-4 rounded-md border  xl:text-xl dark:text-white hover:bg-primary-400 hover:text-white;
}

.liked-bookmarked {
  @apply bg-primary-600 text-white;
}
</style>
