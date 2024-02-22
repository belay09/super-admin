<script setup>
import getAmenitiesQuery from "~/graphql/query/basics/amenities.gql";
import insertPlaceAmenitiesMutation from "~/graphql/mutations/place/insertPlaceAmenities.gql";
import editPlaceAmenityMutation from "~/graphql/mutations/place/editPlaceAmenity.gql";

import getPlaceAmenitiesQuery from "~/graphql/query/places/getPlaceAmenities.gql";
import deletePlaceAmenitiesMutation from "~/graphql/mutations/place/deletePlaceAmenities.gql";

import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**-----------------------Globals----------------------------- */
const { notify } = useNotify();
const placeAmenityForm = ref(null);
const emit = defineEmits(["next", "prev"]);
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});

/**-----------------------Navigation----------------------------- */

const next = () => {
  emit("next");
};
const prev = () => {
  emit("prev");
};

/**---------------------Place Amenities Data Fetch---------------------- */
const placeAmenities = ref([]);
const placeAmenitySort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const placeAmenityFilter = computed(() => {
  let query = {
    placeId: {
      _eq: props.placeId,
    },
  };
  return query;
});

const {
  onResult: onResultPlaceAmenities,
  onError: onErrorPlaceAmenities,
  loading: loadingPlaceAmenities,
  refetch: refetchPlaceAmenities,
} = authListQuery(
  getPlaceAmenitiesQuery,
  placeAmenityFilter,
  placeAmenitySort,
  0,
  20
);

onResultPlaceAmenities((result) => {
  if (result.data) {
    placeAmenities.value = result.data?.placeAmenities;
  }
});

onErrorPlaceAmenities((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**************************Add and Edit Data ******************************/
const selectedAmenity = ref("");
const placeAmenityDescription = ref("");
const image_urls = ref([
  "https://cdn.hahu.jobs/public/sheger-gebeta/37a06044-d763-4b6b-adc7-a418235e5179.png",
  "https://cdn.hahu.jobs/public/sheger-gebeta/37a06044-d763-4b6b-adc7-a418235e5179.png",
]);
const image_url = ref("");
watch(image_url, (newVal) => {
  image_urls.value.push({
    media: {
      data: {
        url: newVal,
      },
    },
  });
});

/**--------------------------------Toggle between edit and add place amenity---------------- */
const isAddPlaceAmenity = ref(true);
function changeToAddPlaceAmenity() {
  isAddPlaceAmenity.value = true;
  image_urls.value = [];
  placeAmenityDescription.value = "";
  selectedPlaceAmenity.value = null;
  selectedAmenity.value = "";
}
// place amenity selected for edit
const selectedPlaceAmenity = ref(null);

/************************** insert place amenity ******************************/
// mutation
const {
  mutate: insertPlaceAmenityMutation,
  onDone: insertPlaceAmenityDone,
  onError: insertPlaceAmenityError,
  loading: insertPlaceAmenityLoading,
} = authMutation(insertPlaceAmenitiesMutation);

insertPlaceAmenityDone((result) => {
  refetchPlaceAmenities();
  notify({
    title: "Amenity Added",
    description: "Amenity Added Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  isAddPlaceAmenity.value = true;
  selectedAmenity.value = "";
  placeAmenityDescription.value = "";
  image_urls.value = [];
});

insertPlaceAmenityError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

// handler
const handleAddPlaceAmenity = () => {
  insertPlaceAmenityMutation({
    obj: {
      placeId: props.placeId,
      amenityId: selectedAmenity.value,
      description: placeAmenityDescription.value,
      placeAmenityResources: {
        data: image_urls.value.map((url) => {
          return {
            media: {
              data: {
                url,
              },
            },
          };
        }),
      },
    },
  });
};

/************************** edit place amenity ******************************/
// Set initial value for edit place amenity
const editAmenity = (amenity) => {
  isAddPlaceAmenity.value = false;
  selectedPlaceAmenity.value = amenity;
  selectedAmenity.value = amenity.amenityId;
  placeAmenityDescription.value = amenity.description;
  image_urls.value = amenity.placeAmenityResources.map(
    (item) => item.media.url
  );

  // scroll to edit form
  if (placeAmenityForm.value) {
    placeAmenityForm.value.scrollIntoView({
      behavior: "smooth",
    });
  }
};
// mutation
const {
  mutate: editPlaceAmenityMutate,
  onDone: editPlaceAmenityDone,
  onError: editPlaceAmenityError,
  loading: editPlaceAmenityLoading,
} = authMutation(editPlaceAmenityMutation);

editPlaceAmenityDone((result) => {
  refetchPlaceAmenities();
  notify({
    title: "Amenity Updated",
    description: "Amenity Updated Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});
editPlaceAmenityError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

// handler
const handleEditPlaceAmenity = () => {
  editPlaceAmenityMutate({
    id: selectedPlaceAmenity.value?.id,
    placeAmenityObject: {
      amenityId: selectedAmenity.value,
      description: placeAmenityDescription.value,
    },
    amenityResourceObject: image_urls.value.map((url) => {
      return {
        placeAmenityId: selectedPlaceAmenity.value?.id,
        media: {
          data: {
            url,
          },
        },
      };
    }),
  });
};

/************************** Delete Place Aminity ******************************/
const {
  mutate: deletePlaceAmenityMutation,
  onDone: deletePlaceAmenityDone,
  onError: deletePlaceAmenityError,
  loading: deletePlaceAmenityLoading,
} = authMutation(deletePlaceAmenitiesMutation);

deletePlaceAmenityDone((result) => {
  showDeletePlaceAmenityModal.value = false;
  refetchPlaceAmenities();
  notify({
    title: "Amenity Deleted",
    description: "Amenity Deleted Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

deletePlaceAmenityError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**---------------------------Handle delete  place amenity--------------- */
const placeAmenityToDelete = ref(null);
const setPlaceAmenityToDelete = (id) => {
  showDeletePlaceAmenityModal.value = true;
  placeAmenityToDelete.value = id;
};
const handleDeleteAmenity = () => {
  deletePlaceAmenityMutation({
    id: placeAmenityToDelete.value,
  });
};

/**----------------------------Call edit or add Amenity handler------------------------------ */
const callEditOrAddPlaceAmenity = handleSubmit(() => {
  if (isAddPlaceAmenity.value) {
    handleAddPlaceAmenity();
  } else {
    handleEditPlaceAmenity();
  }
});

/************************** Control Variables ******************************/
const showProfilePictureModal = ref(false);
const showDeletePlaceAmenityModal = ref(false);
const handelDeleteImage = (index) => {
  image_urls.value.splice(index, 1);
};
</script>
<template>
  <!-- -----------------------Delete Place Amenity Badge Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleDeleteAmenity"
    v-model="showDeletePlaceAmenityModal"
    title="Delete Place Amenity"
    sure-question="Are you sure you want to delete the amenity ?"
    description="This action is irreversible and will permanently delete the amenity and its associated resources."
  ></ModalsConfirmation>

  <!-- Modal for image upload -->
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
  <div>
    <div class="flex" ref="placeAmenityForm">
      <!------------------------------ Left ---------------------->
      <div class="flex-[50%] px-10">
        <form
          @submit.prevent="callEditOrAddPlaceAmenity"
          action=""
          class="flex flex-col gap-4"
        >
          <LazySelectorsAmenity
            v-model="selectedAmenity"
          ></LazySelectorsAmenity>
          <!-------------------------------Description----------------------------------->
          <H-Textarea
            name="place_amenity_description"
            id="place_amenity_description"
            label="Description"
            placeholder="Description"
            v-model="placeAmenityDescription"
          ></H-Textarea>

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

          <!-------------------------------Uploaded Files------------------------------- -->
          <div
            class="flex flex-col gap-4 border px-6 py-3 rounded-md"
            v-if="image_urls.length > 0"
          >
            <p class="font-medium">Uploaded Files</p>
            <div class="flex flex-col gap-4">
              <div
                v-for="(url, index) in image_urls"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img :src="url" class="w-[100px]" />
                  <div>
                    <p class="text-lg font-medium">IMG=99KJ0-.png</p>
                    <p class="text-sm font-light text-sheger-gray-100">
                      Feb 2, 2023. image
                    </p>
                  </div>
                </div>
                <!--progress -->
                <div class="bg-primary-600 h-[3px] w-[200px]" />

                <div @click="handelDeleteImage(index)" class="cursor-pointer">
                  <Icon name="uil:trash-alt" class="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <!------------------------------- Add btn --------------------------->

          <button type="submit" class="primary-button border">
            <span class="">Submit</span>

            <Icon
              v-if="insertPlaceAmenityLoading || editPlaceAmenityLoading"
              name="eos-icons:bubble-loading"
              class="text-3xl text-red-600"
            />
          </button>
          <button
            type="button"
            v-if="!isAddPlaceAmenity"
            class="primary-button bg-primary-600 text-white border"
            @click="changeToAddPlaceAmenity"
          >
            <Icon name="uil:plus" class="w-6 h-6" />
            <span class="">Add New</span>
          </button>
        </form>
      </div>

      <!-- -----------------------------Amenity List------------------- -->
      <div class="flex-[50%]">
        <div
          class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-6"
        >
          <div v-for="amenity in placeAmenities">
            <UiCardsAmenity
              :key="amenity"
              :amenity="amenity"
              @editAmenity="editAmenity"
              @deleteAmenity="setPlaceAmenityToDelete"
            ></UiCardsAmenity>
          </div>
        </div>
        <HPaginate
          v-if="placeAmenities.length > 0"
          v-model:offset="offset"
          :items-per-page="limit"
          :total-data="placeAmenities.length"
          class="w-full pt-16 hidden lg:block"
        ></HPaginate>
      </div>
    </div>
    <!-- --------------------------------------Navigation-------------------------------- -->
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
