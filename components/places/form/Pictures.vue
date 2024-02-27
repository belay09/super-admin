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

/**---------------------Insert Place Medias ---------------------- */
const selectedPlaceMedias = ref([]);
const {
  mutate: insertPlaceMediasMutate,
  loading: loadingInsertPlaceMedia,
  onDone: onDoneInsertPlaceMedia,
  onError: onErrorInsertPlaceMedia,
} = authMutation(insertPlaceMediasMutation);

onDoneInsertPlaceMedia((result) => {
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

const handleInsert = () => {
  insertPlaceMediasMutate({
    obj: selectedPlaceMedias.value.map((image) => {
      return {
        placeId: props.placeId,
        media: {
          data: {
            url: image,
          },
        },
      };
    }),
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

const handleDelete = (id) => {
  deletePlaceMedia({
    id: id,
  });
};
</script>

<template>
  <div>
    <div class="flex flex-col">
      <!-------------------------------------- image upload------------------------------------------------- -->
      <HFileUploadWrapper
        name="file"
        :maxFileSize="1024 * 1024 * 10"
        :fileLimit="20"
        folder="applications_form"
        description="upload file"
        placeholder="select multiple files"
        v-model="selectedPlaceMedias"
        :init="selectedPlaceMedias"
        :disabled="false"
        :showStar="false"
        :emit-submit="true"
        @submitToDatabase="handleInsert"
      />

      <!-----------------------------Images------------------------------------------------>
      <div class="grid grid-cols-4 gap-4 my-6">
        <div v-for="image in images" class="relative group h-96">
          <img
            loading="lazy"
            :src="image.media.url"
            class="w-full h-full object-cover object-center"
          />
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
