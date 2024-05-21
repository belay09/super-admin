<script setup>
const emit = defineEmits(["showGalleryModal"]);
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
  showNavigation: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const imagesToShow = ref(props.images.slice(0, 5));
</script>

<template>
  <div class="py-6">
    <div class="grid grid-cols-2 gap-4">
      <NuxtImg
        v-for="(image, index) in imagesToShow"
        class="h-96 w-full object-cover object-center"
        :src="image.media?.url"
        alt="pasta image"
      />

      <button
        v-if="images.length > 5"
        @click="emit('showGalleryModal')"
        class="relative block"
      >
        <NuxtImg
          class="w-full blur-sm h-96 object-cover object-center"
          :src="
            imagesToShow.length > 5
              ? imagesToShow[5]?.media?.url
              : imagesToShow[0]?.media?.url
          "
          alt="pasta image"
        />
        <p
          class="absolute left-[40%] top-[45%] text-primary-600 text-3xl font-medium"
        >
          + {{ images.length - 5 }} More
        </p>
      </button>
    </div>
  </div>
  <div></div>
</template>
