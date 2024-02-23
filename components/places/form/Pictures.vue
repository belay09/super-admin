<script setup>
import useNotify from "@/use/notify";
import insertPlaceMediasMutation from "~/graphql/mutations/place/insertPlaceMedias.gql";
import getPlaceMediasQuery from "~/graphql/query/places/getPlaceMedias.gql";
import deletePlaceMediasMutation from "~/graphql/mutations/place/deletePlaceMedia.gql";

/**-----------------------Globals----------------------------- */
const { notify } = useNotify();
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});
/**-----------------------Navigation----------------------------- */
const emit = defineEmits(["next", "prev"]);
const route = useRoute();
const next = () => {
  emit("next");
};
const prev = () => {
  emit("prev");
};
/************************* Data ****************************/
const images = ref([]);
const image_url = ref("");
const offset = ref(0);
const limit = ref(100);

/************************** Place Medias Data Fetch ******************************/
const placeMediaFilters = computed(() => {
  let query = {
    placeId: {
      _eq: props.placeId,
    },
  };
  return query;
});

const {
  onResult: onResultImages,
  onError: onErrorImages,
  loading: loadingImages,
  refetch: refetchImages,
} = authListQuery(getPlaceMediasQuery, placeMediaFilters, "", offset, limit);

onResultImages((result) => {
  if (result.data) {
    images.value = result?.data?.placeMedias;
  }
});
onErrorImages((error) => {
  notify({
    title: "Error",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**---------------------Insert Place Media ---------------------- */
const {
  mutate: insertPlaceMedia,
  loading: loadingInsertPlaceMedia,
  onDone: onDoneInsertPlaceMedia,
  onError: onErrorInsertPlaceMedia,
} = authMutation(insertPlaceMediasMutation);

onDoneInsertPlaceMedia((result) => {
  if (result.data) {
    notify({
      title: "Picture Added",
      description: "Picture Added Successfully",
      type: "success",
      borderClass: "border-l-8 border-green-300",
    });
    refetchImages();
  }
});

onErrorInsertPlaceMedia((error) => {
  notify({
    title: "Error",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**---------------------Delete Place Media ---------------------- */
const {
  mutate: deletePlaceMedia,
  loading: loadingDeletePlaceMedia,
  onDone: onDoneDeletePlaceMedia,
  onError: onErrorDeletePlaceMedia,
} = authMutation(deletePlaceMediasMutation);

onDoneDeletePlaceMedia((result) => {
  if (result.data) {
    notify({
      title: "Picture Deleted",
      description: "Picture Deleted Successfully",
      type: "success",
      borderClass: "border-l-8 border-green-300",
    });
    refetchImages();
  }
});

onErrorDeletePlaceMedia((error) => {
  notify({
    title: "Error",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/************************* Methods ****************************/
watch(image_url, (newVal) => {
  insertPlaceMedia({
    obj: {
      placeId: registerPlaceStore.placeId,
      media: {
        data: {
          url: newVal,
        },
      },
    },
  });
});

const handleDelete = (id) => {
  deletePlaceMedia({
    id: id,
  });
};

/************************* Control Variables ****************************/
const showProfilePictureModal = ref(false);
</script>

<template>
  <div>
    <ModalsModal :auto-close="false" v-model="showProfilePictureModal">
      <template #content>
        <UiImageUploader
          title="Upload Place Picture"
          description="Upload a picture of the place"
          v-model="image_url"
          @close="showProfilePictureModal = false"
        ></UiImageUploader>
      </template>
    </ModalsModal>

    <div class="flex flex-col justify-between">
      <!-------------------------------------- image upload------------------------------------------------- -->
      <div
        class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg px-8 py-4"
      >
        <Icon name="uil:cloud-upload" class="w-20 h-20" />
        <div class="input_field flex flex-col w-max mx-auto text-center">
          <div>
            Drag and drop here or
            <span
              class="text-primary-600 cursor-pointer"
              @click="showProfilePictureModal = true"
              >Browse</span
            >
          </div>

          <div class="">Select images that are Square and 10MB</div>
        </div>
      </div>
      <!-----------------------------Image Galay-------------------------------->
      <div class="grid grid-cols-4 gap-4 my-6">
        <div v-for="image in images" class="relative group">
          <img :src="image.media.url" class="w-[390px]" />
          <div
            class="absolute top-0 bg-black h-full w-full opacity-60 hidden group-hover:block"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="54"
            height="54"
            viewBox="0 0 24 24"
            @click="handleDelete(image.id)"
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-150 cursor-pointer"
          >
            <path
              fill="white"
              d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
            />
          </svg>
          <!-- <div
          @click="handleDelete(image.id)"
          class="ml-2 bg-white-500 border-[1px] hover:bg-gray-100 text-black font-normal px-2 py-1 rounded cursor-pointer"
        >
          Delete
        </div> -->
        </div>
      </div>
      <div class="mt-5">
        <HPaginate
          v-model:offset="offset"
          :items-per-page="8"
          :total-data="79"
        />
      </div>
    </div>
    <!-- --------------------------------------navigation-------------------------------- -->
    <div class="flex items-center justify-between my-2">
      <button
        class="primary-button border flex items-center gap-4"
        @click="prev()"
      >
        <Icon name="uil:arrow-left" class="w-6 h-6" />
        Previous
      </button>

      <button
        class="primary-button border flex items-center gap-4 text-white bg-primary-600"
        @click="next()"
      >
        Save & Proceed
        <Icon name="uil:arrow-right" class="text" />
      </button>
    </div>
  </div>
</template>
