<script setup>
import updatePlaceLocationMutation from "~/graphql/mutations/place/updatePlaceLocations.gql";
import insertPlaceLocationMutation from "~/graphql/mutations/place/insertPlaceLocations.gql";
import deletePlaceLocationMutation from "~/graphql/mutations/place/deletePlaceLocation.gql";
import getPlaceLocationsQuery from "~/graphql/query/places/getPlaceLocations.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const { handleSubmit } = useForm({});

/**-----------------------Navigation----------------------------- */
const emit = defineEmits(["next", "prev"]);
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});
const next = () => {
  if (placeLocations.value.length == 0) {
    notify({
      title: "Location is required",
      description: "Please add at least one location",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
    return;
  }
  emit("next");
};
const prev = () => {
  emit("prev");
};

const mapModel = ref(false);
const item = ref({
  latitude: 0,
  longitude: 0,
});
const coordinates = computed(() => {
  return `${item.value.latitude}, ${item.value.longitude}`;
});
const city = ref(undefined);
const area = ref(undefined);
const isMainLocation = ref(false);

const placeLocations = ref([]);

const updateMapVal = (data) => {
  item.value.latitude = data.position.lat;
  item.value.longitude = data.position.lng;
};

// --------------------------- Place  Location Data Fetch --------------------------------
const locationFilter = computed(() => {
  let query = {
    placeId: {
      _eq: props.placeId,
    },
  };
  return query;
});

const {
  onResult: onResultLocation,
  onError: onErrorLocation,
  loading: loadingLocation,
  refetch: refetchLocation,
  fetchMore: fetchMoreLocation,
} = authListQuery(getPlaceLocationsQuery, locationFilter, "", 0, 5);

onResultLocation((result) => {
  if (result.data) {
    placeLocations.value = result.data?.placeLocations;
  }
});

/**-------------------------------Add location--------------------- */

/**-------------------------------Delete Place Location--------------------- */

const {
  mutate: deleteMutate,
  onDone: deleteDone,
  onError: deleteError,
  loading: deleteLoading,
} = authMutation(deletePlaceLocationMutation);
const handleDelete = (id) => {
  deleteMutate({ id });
};

deleteDone(() => {
  refetchLocation();
  notify({
    title: "Location deleted successfully",
    description: "Location deleted successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

deleteError((error) => {
  let message;
  if (error.message.includes("Foreign key violation")) {
    message = "Can't delete this item";
  } else {
    message = error.message;
  }
  notify({
    title: "Some thing went wrong",
    description: message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-------------------------------Handle insert place location---------------- */

const {
  mutate: insertPlaceLocation,
  loading: insertPlaceLocationLoading,
  onError: insertPlaceLocationError,
  onDone: insertPlaceLocationDone,
} = authMutation(insertPlaceLocationMutation);

insertPlaceLocationDone((result) => {
  refetchLocation();
});

insertPlaceLocationError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const handleAddLocation = handleSubmit(() => {
  insertPlaceLocation({
    placeLocationObject: [
      {
        placeId: props.placeId,
        cityId: city.value.id,
        areaId: area.value.id,
        isMainLocation: isMainLocation.value,
        description: "description",
        location: {
          type: "Point",
          coordinates: coordinates.value
            .split(",")
            .map((item) => parseFloat(item)),
        },
      },
    ],
  });
});
</script>
<template>
  <div>
    <ModalsModal body-class="!w-[40rem]" :auto-close="false" v-model="mapModel">
      <template #content>
        <HMapSelector
          @updateMapVal="updateMapVal"
          titleClass="text-xs"
          :lat="item.latitude"
          :long="item.longitude"
          @close="mapModel = false"
        />
      </template>
    </ModalsModal>
  </div>

  <div class="flex flex-col justify-center items-center mt-10 gap-5">
    <!-----------------------------Selected location list-------------------------------------->
    <div v-if="loadingLocation" class="flex gap-4">
      <!-- Skeleton loader for place locations -->
      <div v-for="index in 3" :key="index" class="skeleton-container">
        <!-- Place location skeleton -->
        <div class="skeleton w-48 h-16"></div>
      </div>
    </div>
    <div v-else class="flex gap-4">
      <div
        class="flex items-center gap-3 border w-fit px-5 py-1 rounded-lg"
        v-for="(location, index) in placeLocations"
        :key="index"
      >
        <Icon
          v-if="location.isMainLocation"
          name="teenyicons:location-outline"
          class="text-primary-600 w-6 h-6"
        />
        <Icon
          v-else
          name="material-symbols:edit-location-alt-outline-rounded"
          class="w-5 h-5"
        />
        <div class="text-gray-800 font-light">
          <p>{{ location?.city?.name }}</p>
          <p>{{ location?.area?.name }}</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon
            name="material-symbols:edit-location-alt-outline-rounded"
            class="w-5 h-5"
          />
          <div>|</div>
          <Icon
            name="uiw:delete"
            class="w-5 h-5 cursor-pointer"
            @click="handleDelete(location.id)"
          />
        </div>
      </div>
    </div>

    <form class="flex flex-col gap-3" @submit.prevent="handleAddLocation">
      <!-- ------------------------------------City---------------------------------- -->

      <SelectorsCity v-model="city"></SelectorsCity>

      <!--------------------------------------Area-------------------------------------- -->
      <SelectorsArea v-model="area" :cityId="city?.id"></SelectorsArea>

      <!---------------------------------------Coordinates--------------------------------------->
      <div class="flex">
        <HTextfield
          placeholder="8.984989, 16.904549"
          name="Coordinates"
          v-model="coordinates"
          rules="requiredN"
          type="text"
        >
          <template #label>
            <div class="iphone5:my-2 lg:my-2">
              <span
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >Coordinates</span
              >
            </div>
          </template>
        </HTextfield>
        <div class="flex items-end">
          <button
            @click="mapModel = true"
            class="items-center rounded border-gray-100 px-1 py-5 font-sans text-xs text-gray-400"
          >
            <Icon name="ion:locate" color="black" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- ----------------------------------------Set as main location-------------------------------- -->
      <div class="flex justify-between">
        <p class="">Set as main location</p>
        <HSwitch name="main_location" v-model="isMainLocation" />
      </div>

      <!----------------------------------------------Add Location------------------------------------>
      <button
        class="flex items-center gap-3 primary-button border"
        type="submit"
      >
        <Icon name="fluent:location-add-16-regular" class="w-5 h-5" />
        Add Location
      </button>
    </form>
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
</template>
