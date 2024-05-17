<script setup>
import useNotify from "@/use/notify";
import insertPlaceMediasMutation from "~/graphql/mutations/place/insertPlaceMedias.gql";
import getPlaceMediasQuery from "~/graphql/query/places/getPlaceMedias.gql";
import deletePlaceMediasMutation from "~/graphql/mutations/place/deletePlaceMedia.gql";
import editPlaceMutation from "@/graphql/mutations/place/editPlaceFieldOnly.gql";
import getPlaceQuery from "@/graphql/query/places/item.gql";

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

/************************** Place Medias Data Fetch ******************************/
const images = ref([]);
const offset = ref(0);
const limit = ref(12);
const length = ref(0);
const mediasSort = ref([{}]);
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
} = authListQuery(
  getPlaceMediasQuery,
  placeMediaFilters,
  mediasSort,
  offset,
  limit
);

onResultImages((result) => {
  if (result.data) {
    images.value = result?.data?.placeMedias;
    length.value = result?.data?.placeMediasAggregate?.aggregate?.count;
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

/**---------------------Fetch place to get featured media ---------------------- */
const place = ref(null);
const { onResult, onError, refetch } = authItemQuery(
  getPlaceQuery,
  props.placeId
);
onResult((result) => {
  if (result.data) {
    place.value = result.data.place;
  }
});

/**---------------------Insert Place Medias ---------------------- */
const selectedPlaceMedias = ref([]);
const {
  mutate: insertPlaceMediasMutate,
  loading: loadingInsertPlaceMedia,
  onDone: onDoneInsertPlaceMedia,
  onError: onErrorInsertPlaceMedia,
} = authMutation(insertPlaceMediasMutation);

onDoneInsertPlaceMedia((result) => {
  showSelectPortraitOrLandscape.value = false;
  if (result.data) {
    notify({
      title: "Pictures Added",
      description: "Pictures Added Successfully",
      type: "success",
      borderClass: "border-l-8 border-green-300",
    });
    selectedPlaceMedias.value = [];
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

function isImage(url) {
  if (url.includes("mp4")) {
    return false;
  } else {
    return true;
  }
}
const handleInsert = () => {
  insertPlaceMediasMutate({
    obj: selectedPlaceMedias.value.map((image) => {
      return {
        placeId: props.placeId,
        isImage: isImage(image),
        media: {
          data: {
            url: image,
            isPortrait: mediaType.value === "portrait",
          },
        },
      };
    }),
  });
};

/**---------------------Edit  Place Media ---------------------- */

const selectedPlaceMedia = ref(null);
const {
  mutate: editMutate,
  loading: editLoading,
  onError: editError,
  onDone: editDone,
} = authMutation(editPlaceMutation);

editDone(() => {
  notify({
    title: "Featured Media Updated",
    description: "Featured Media Updated",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  handleDelete(selectedPlaceMedia.value?.id);
});

editError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const handleEdit = (placeMedia) => {
  selectedPlaceMedia.value = placeMedia;
  editMutate({
    id: props.placeId,
    placeObject: {
      featuredMedia: placeMedia?.media?.id,
    },
  });
};

/**---------------------Delete Place Media ---------------------- */
const {
  mutate: deletePlaceMedia,
  loading: loadingDeletePlaceMedia,
  onDone: onDoneDeletePlaceMedia,
  onError: onErrorDeletePlaceMedia,
} = authMutation(deletePlaceMediasMutation);

onDoneDeletePlaceMedia((result) => {
  if (result.data) {
    refetchImages();
    refetch();
    selectedPlaceMedia.value = null;
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

const handleDelete = (id) => {
  deletePlaceMedia({
    id: id,
  });
};

const mediaType = ref("");
const openUploadFilesModal = ref(false);
const showSelectPortraitOrLandscape = ref(false);

const selectPortraitOrLandscape = (type) => {
  showSelectPortraitOrLandscape.value = false;
  mediaType.value = type;
  openUploadFilesModal.value = true;
};
</script>

<template>
  <!-- ----------------File Upload Modal---------------- -->
  <HFileUploadModalNew
    @uploadDone="handleInsert"
    v-model:openModal="openUploadFilesModal"
    v-model="selectedPlaceMedias"
    :fileLimit="10"
    :max-file-size="10485760"
    :media-type="mediaType"
    name="Pictures"
    description="upload file"
    placeholder="select multiple files"
  />
  <div>
    <div class="flex flex-col">
      <!-------------------------------------- image upload------------------------------------------------- -->

      <div class="p-8 border-2 border-gray-300 border-dashed rounded-lg">
        <!-- ----------------Select from landscape and portrait---- -->
        <div
          v-if="showSelectPortraitOrLandscape"
          class="flex flex-col items-center justify-center w-full gap-4 cursor-pointer"
        >
          <!-- ------------------Landscape---------------- -->

          <button
            @click="selectPortraitOrLandscape('landscape')"
            class="primary-button w-52 !px-8 border flex items-center gap-4 hover:bg-primary-600 hover:text-white"
          >
            <Icon name="ri:landscape-line" class="text-xl" />
            Landscape
          </button>

          <!-- -----------------Portrait---------------- -->
          <button
            @click="selectPortraitOrLandscape('portrait')"
            class="primary-button w-52 !px-8 border flex items-center gap-4 hover:bg-primary-600 hover:text-white"
          >
            <Icon name="ion:phone-portrait-outline" class="text-xl" />
            Portrait
          </button>
        </div>

        <!-- ------------------Browse medias------------ -->
        <div
          v-else
          @click="showSelectPortraitOrLandscape = true"
          class="flex flex-col items-center justify-center w-full gap-4 cursor-pointer"
        >
          <Icon name="uil:cloud-upload" class="w-20 h-20" />
          <div class="flex flex-col mx-auto text-center input_field w-max">
            <div>
              {{ placeholder }} <span class="text-primary-600">Browse</span>
            </div>

            <div class="">Select images and videos that are under 10MB</div>
          </div>
        </div>
      </div>

      <!-----------------------------Images------------------------------------------------>
      <div class="grid grid-cols-4 gap-4 my-6">
        <!-- -----------------Featured Image---------------- -->
        <div v-if="place.featured_medias?.url" class="relative group h-96">
          <img
            loading="lazy"
            :src="place.featured_medias?.url"
            class="w-full h-full object-cover object-center border-4 border-primary-600"
          />
        </div>

        <div v-for="(image, index) in images" :key="index" class="">
          <div v-if="image.isImage" class="relative group h-96">
            <!-- ----------------If type is image---------------- -->
            <img
              loading="lazy"
              :src="image.media.url"
              class="w-full h-full object-cover object-center"
            />
            <div
              class="absolute top-0 bg-black h-full w-full opacity-60 hidden group-hover:block"
            />
            <div
              class="flex flex-col items-center justify-center gap-2 absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-150"
            >
              <!-- ----------------If type is image---------------- -->
              <button @click="handleEdit(image)" class="pl-2">
                <Icon name="dashicons:cover-image" class="text-3xl" /> Thumbnail
              </button>
              <button @click="handleDelete(image.id)">
                <Icon name="uil:trash-alt" class="text-3xl" /> Remove
              </button>
            </div>
          </div>

          <!-- ----------------If type is video---------------- -->
          <div v-else class="relative group">
            <video
              class="h-96 w-full"
              autoplay
              controls
              :src="image.media?.url"
            ></video>

            <div
              class="absolute top-0 bg-black h-full w-full opacity-60 hidden group-hover:block"
            />
            <div
              class="flex flex-col items-center justify-center gap-2 absolute inset-0 text-white opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-150"
            >
              <!-- ----------------If type is video---------------- -->
              <button @click="handleDelete(image.id)">
                <Icon name="uil:trash-alt" class="text-3xl" /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <HPaginate
          v-model:offset="offset"
          :items-per-page="limit"
          :total-data="length"
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
