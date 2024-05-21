<script setup>
/*------------------------Globals -----------------------*/

const emit = defineEmits(["showGalleryModal"]);
const props = defineProps({
  images: {
    type: Array,
    required: true,
  },
});

/*------------------------Reconstruct images array -----------------------*/
const imagesData = ref([]);
props.images.forEach((image, index) => {
  if (index % 3 == 0) {
    imagesData.value.push([image]);
  } else {
    if (index % 2 == 0) {
      imagesData.value[imagesData.value.length - 1].push(image);
    } else {
      imagesData.value.push([image]);
    }
  }
});

/*------------------------Emits showGalleryModal -----------------------*/

const showGallery = (imageUrl) => {
  emit("showGalleryModal", imageUrl);
};
</script>

<template>
  <div class="flex flex-col gap-y-2 py-4">
    <div v-for="(rowData, index) in imagesData" :key="index">
      <!-- ---------------------One column Image---------------------- -->

      <div v-if="rowData.length == 1">
        <!-- ------------------If image----------- -->
        <img
          v-if="rowData[0].isImage"
          loading="lazy"
          :src="rowData[0].media?.url"
          alt="galley image"
          class="h-64 object-cover w-full"
          @click="showGallery(rowData[0])"
        />

        <!-- ------------------If video----------- -->
        <video
          v-else
          :src="rowData[0].media?.url"
          alt=" Video"
          autoplay
          loop
          class="h-64 object-cover w-full"
        />
      </div>

      <!-- ---------------------Two column Image---------------------- -->

      <div v-else class="grid grid-cols-2 gap-x-2">
        <!-- left -->
        <div>
          <img
            v-if="rowData[0]?.isImage"
            loading="lazy"
            :src="rowData[0]?.media?.url"
            alt="galley image"
            class="h-32 w-full object-cover"
            @click="showGallery(rowData[0])"
          />
          <!-- ------------------If video----------- -->
          <video
            v-else
            :src="rowData[0].media?.url"
            alt=" Video"
            autoplay
            loop
            class="h-32 object-cover w-full"
          />
        </div>
        <!-- right -->
        <div>
          <img
            v-if="rowData[1]?.isImage"
            loading="lazy"
            :src="rowData[1]?.media?.url"
            alt="galley image"
            class="h-32 w-full object-cover"
            @click="showGallery(rowData[0])"
          />
          <!-- ------------------If video----------- -->
          <video
            v-else
            :src="rowData[1].media?.url"
            alt=" Video"
            autoplay
            loop
            class="h-32 object-cover w-full"
          />
        </div>
      </div>
    </div>
  </div>
</template>
