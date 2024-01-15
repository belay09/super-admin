<script setup>
import { useRegisterPlaceStore } from "~/stores/registerPlace";
import addPlaceLocationMutation from "~/graphql/mutations/place/addPlaceLocations.gql";
import getPlaceLocationsQuery from "~/graphql/query/places/getPlaceLocations.gql";
const registerPlaceStore = useRegisterPlaceStore();

const mapModel = ref(false);
const item = ref({
  latitude: 0,
  longitude: 0,
});
const coordinates = computed(() => {
  return `${item.value.latitude}, ${item.value.longitude}`;
});
const city = ref({});
const area = ref({});
const mainLocation = ref(false);

const selectedLocations = ref([]);
const locations = ref([]);

watch(
  area,
  (newVal) => {
    console.log(newVal, "dasd");
  },
  {
    deep: true,
  }
);

const updateMapVal = (data) => {
  // Find the index of the tag with the given TagId in the selectedTags array
  console.log("latitude", data.position.lat);
  console.log("longitude", data.position.lng);
  item.value.latitude = data.position.lat;
  item.value.longitude = data.position.lng;
};

/**--------------------------------------Query-------------------------------*/

// --------------------------- Location Qury --------------------------------

const locationFilter = computed(()=>{
  let query = {
    placeId: {
      _eq: registerPlaceStore.placeId,
    },
  };

  return query;
})

const {
  onResult: onResultLocation,
  onError: onErrorLocation,
  loading: loadingLocation,
  refetch: refetchLocation,
  fetchMore: fetchMoreLocation,
} = authListQuery(getPlaceLocationsQuery, locationFilter, "", 0, 5);

onResultLocation((result) => {
  if (result.data) {
    locations.value = result?.data?.placeLocations;
  }
});

/**-----------------------------------Mutations------------------------ */

const {
  mutate: addPlaceLocation,
  loading: addPlaceLocationLoading,
  error: addPlaceLocationError,
  onDone: addPlaceLocationDone,
} = authMutation(addPlaceLocationMutation);

addPlaceLocationDone(() => {
  refetchLocation();
});

const handleAddLocation = () => {
  selectedLocations.value.push({
    city: city.value,
    area: area.value,
    coordinates: coordinates.value,
    mainLocation: mainLocation.value,
  });

  city.value = {};
  area.value = {};
  mainLocation.value = false;

  console.log(selectedLocations.value, "selectedLocations");

  addPlaceLocation({
    data: selectedLocations.value.map((location) => {
      return {
        placeId: registerPlaceStore.placeId,
        cityId: location.city.id,
        areaId: location.area.id,
        isMainLocation: location.mainLocation,
        description: "da",
        location: {
          type: "Point",
          coordinates: location.coordinates
            .split(",")
            .map((item) => parseFloat(item)),
        },
      };
    }),
  });

  console.log(data, "data");
};

const handleDeleteLocation = (index) => {
  selectedLocations.value.splice(index, 1);
};
</script>
<template>
  <div>
    <ModalsModal :auto-close="false" v-model="mapModel">
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
    <!-----------------------------top-------------------------------------->
    <div class="flex gap-4">
      <div
        class="flex items-center gap-3 border w-fit px-5 py-1 rounded-lg"
        v-for="location in locations"
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
            @click="handleDeleteLocation"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <!-- ------------------------------------City---------------------------------- -->
      <div class="sm:col-span-2">
        <BasicCity v-model="city" name="city" rules="required"></BasicCity>
      </div>
      <!--------------------------------------Area-------------------------------------- -->
      <BasicSubcity
        v-model="area"
        :region_id="city.id"
        name="subcity"
        rules="required"
      ></BasicSubcity>

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
        <HSwitch v-model="mainLocation" />
      </div>

      <!----------------------------------------------Add Location------------------------------------>
      <div
        class="flex items-center gap-3 primary-button border"
        @click="handleAddLocation"
      >
        <Icon name="fluent:location-add-16-regular" class="w-5 h-5" />
        Add Location
      </div>
    </div>
  </div>
</template>
