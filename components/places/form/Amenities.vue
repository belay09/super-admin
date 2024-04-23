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
const placeAmenitiesLength = ref(0);
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
    placeAmenitiesLength.value =
      result.data?.placeAmenitiesAggregate?.aggregate?.count;
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

const image_urls = ref([]);

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

  <div>
    <div class="flex py-2" ref="placeAmenityForm">
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

          <!----------------------------------------images Upload---------------------------------------->
          <p class="mb-2 text-sheger-gray-100">Upload images</p>

          <HFileUploadWrapper
            name="file"
            :maxFileSize="1024 * 1024 * 10"
            :fileLimit="6"
            folder="applications_form"
            description="upload file"
            placeholder="select multiple files"
            v-model="image_urls"
            :init="image_urls"
            :disabled="false"
            :showStar="false"
            rules="required"
          />

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
        <p v-if="loadingPlaceAmenities" class="skeleton w-36 h-6 mb-6"></p>
        <p v-else class="secondary-text !text-xl font-medium m-6">
          {{ placeAmenitiesLength }} Amenities Added
        </p>
        <!-- -------------------Loading Place Amenities---------------- -->
        <div v-if="loadingPlaceAmenities" class="grid grid-cols-2 gap-6">
          <div v-for="i in 4" class="rounded-lg border skeleton-container">
            <!-- Skeleton loader for the card body -->
            <div class="skeleton w-full h-64 rounded-t-lg"></div>

            <!-- Skeleton loader for the card body -->
            <div class="flex flex-col space-y-4 py-4 px-5">
              <!-- Place name and logo skeleton -->
              <div class="secondary-flex-row items-center space-x-4">
                <!-- Place logo skeleton -->
                <div class="skeleton w-8 h-8 rounded-full"></div>
                <!-- Place name skeleton -->
                <div class="skeleton w-1/2 h-6"></div>
              </div>

              <!-- Description skeleton -->
              <div class="skeleton w-full h-20"></div>
            </div>

            <!-- Skeleton loader for the card footer -->
            <div
              class="flex justify-between items-center px-10 py-4 gap-x-4 border-t"
            >
              <!-- Edit button skeleton -->
              <div class="skeleton w-2/3 h-10"></div>
              <!-- Delete button skeleton -->
              <div class="skeleton w-2/3 h-10"></div>
            </div>
          </div>
        </div>
        <div
          v-else
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
