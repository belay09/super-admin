<script setup>
import getAmenitiesQuery from "~/graphql/query/basics/amenities.gql";
import insertPlaceAmenitiesMutation from "~/graphql/mutations/place/insertPlaceAmenities.gql";
import getPlaceAmenitiesQuery from "~/graphql/query/places/getPlaceAmenities.gql";
import deletePlaceAmenitiesMutation from "~/graphql/mutations/place/deletePlaceAmenities.gql";
import { useRegisterPlaceStore } from "~/stores/registerPlace";
import useNotify from "@/use/notify";

/************************** Datas ******************************/
const amenities = ref([]);
const selectedPlaceAmenity = ref("");
const searchTerm = ref("");
const placeAmenityDescription = ref("");
const image_urls = ref([]);
const image_url = ref("");
const { notify } = useNotify();

watch(image_url, (newVal) => {
  image_urls.value.push({
    media: {
      data: {
        url: newVal,
      },
    },
  });
});

watch(
  image_urls,
  (newVal) => {
    console.log(newVal, "image_urls");
  },
  { deep: true }
);

/************************** Control Variables ******************************/
const showProfilePictureModal = ref(false);
const registerPlaceStore = useRegisterPlaceStore();

/************************** Query ******************************/

/**------------------------Basic Amenity ---------------------- */
const basicAmenityfilters = computed(() => {
  let query = {};
  if (searchTerm.value) {
    query.title = {
      _ilike: `%${searchTerm.value}%`,
    };
  }
  return query;
});

const {
  onResult: onResultAmenities,
  onError: onErrorAmenities,
  loading: loadingAmenities,
  refetch: refetchAmenities,
  fetchMore: fetchMoreAmenities,
} = authListQuery(getAmenitiesQuery, basicAmenityfilters, "", 0, 50);

onResultAmenities((result) => {
  if (result.data) {
    amenities.value = result.data.basicsAmenities;
  }
});

/**---------------------Place Amenities ---------------------- */

const placeAmenityfilters = computed(() => {
  let query = {};
  if (registerPlaceStore.placeId) {
    query.placeId = {
      _eq: registerPlaceStore.placeId,
    };
  }
  return query;
});

const {
  onResult: onResultPlaceAmenities,
  onError: onErrorPlaceAmenities,
  loading: loadingPlaceAmenities,
  refetch: refetchPlaceAmenities,
  fetchMore: fetchMorePlaceAmenities,
} = authListQuery(getPlaceAmenitiesQuery, placeAmenityfilters, "", 0, 1);

onResultPlaceAmenities((result) => {
  console.log(result.data, "result.data");
  if (result.data) {
    placeAmenities.value = result.data?.placeAmenities;
  }
});

/************************** Methods ******************************/
const onSearch = (term) => {
  searchTerm.value = term;
};


/************************** Mutations ******************************/
const {
  mutate: insertPlaceAmenityMutation,
  onDone: insertPlaceAmenityDone,
  onError: insertPlaceAmenityError,
  loading: insertPlaceAmenityLoading,
} = authMutation(insertPlaceAmenitiesMutation);

insertPlaceAmenityDone((result) => {
  refetchPlaceAmenities();

  selectedPlaceAmenity.value = "";
  placeAmenityDescription.value = "";
  image_urls.value = [];
});

/************************** Delete Aminity ******************************/
const {
  mutate: deletePlaceAmenityMutation,
  onDone: deletePlaceAmenityDone,
  onError: deletePlaceAmenityError,
  loading: deletePlaceAmenityLoading,
} = authMutation(deletePlaceAmenitiesMutation);

deletePlaceAmenityDone((result) => {
  refetchPlaceAmenities();
  notify({
    title: "Amenity Deleted",
    description: "Amenity Deleted Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

/************************** Handler ******************************/

const handleAddPlaceAmenity = () => {
  insertPlaceAmenityMutation({
    obj: {
      placeId: registerPlaceStore.placeId,
      amenityId: selectedPlaceAmenity.value,
      description: placeAmenityDescription.value,
      placeAmenityResources: {
        data: image_urls.value,
      },
    },
  });
};

const handleChildEvent = (amenity) => {
  selectedPlaceAmenity.value = amenity.amenityId;
  placeAmenityDescription.value = amenity.description;
  image_urls.value = amenity.placeAmenityResources;
};

const handelDelate = (id) => {
  deletePlaceAmenityMutation({
    id: id,
  });
};

const handelDeleteImage = (index) => {
  image_urls.value.splice(index, 1);
};

const placeAmenities = ref([]);
</script>
<template>
  <div class="flex">
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

    <!-- Left -->

    <div class="flex flex-col gap-4 flex-[50%] px-10">
      <H-SingleSelectWithSearch
        v-model="selectedPlaceAmenity"
        name="place_amenity"
        id="place_amenity"
        label="Amenity"
        :items="amenities"
        @search="onSearch"
      >
        <template v-slot:header="{ item }">
          <div class="flex items-center gap-x-5">
            <div class="border-r pr-4">
              <img :src="item.icon.darkIconUrl" class="w-7 h-7" />
            </div>
            <p>{{ item.name }}</p>
          </div>
        </template>
      </H-SingleSelectWithSearch>
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
            v-for="(image, index) in image_urls"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <img :src="image?.media?.data?.url" class="w-[100px]" />
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

      <div class="primary-button border" @click="handleAddPlaceAmenity">
        <Icon name="uil:plus" class="w-6 h-6" />
        <span class="">Add</span>
      </div>
    </div>
    <!-- right -->
    <div class="flex-[50%]">
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-6"
      >
        <div v-for="amenity in placeAmenities">
          <UiCardsAmenities
            :key="amenity"
            :menu="amenity"
            @childEvent="handleChildEvent"
            @delateEvent="handelDelate"
          ></UiCardsAmenities>
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
</template>
