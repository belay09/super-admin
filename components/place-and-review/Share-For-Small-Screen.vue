<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
});

const shareText = ref("");
const showShareModal = ref(false);

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
  <button @click="handleShare">
    <Icon name="uil:share-alt" size="22" class="primary-text" />
  </button>
</template>
