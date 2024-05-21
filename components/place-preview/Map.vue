<script setup>
/*-----------------------------------Imports---------------------------- */

import getCurrentLocation from "~/helpers/get-current-geo-location";

const props = defineProps({
  placeLocations: {
    type: Object,
    required: true,
  },
  zoom: {
    type: Number,
    default: 12,
    required: false,
  },
  center: {
    type: Array,
    default: () => [9.010631945576197, 38.76055205651439],
    required: false,
  },
});

/*-----------------------------------Map data---------------------------- */

const map = ref(null);

const openDirectionOnMap = async (coordinates) => {
  let currentUserLocation;
  if (window.localStorage.getItem("currentLocation")) {
    currentUserLocation = JSON.parse(
      window.localStorage.getItem("currentLocation")
    );
  } else {
    currentUserLocation = await getCurrentLocation();
    window.localStorage.setItem(
      "currentLocation",
      JSON.stringify(currentUserLocation)
    );
  }
  const url = `https://maps.apple.com/?saddr=${currentUserLocation.latitude},${currentUserLocation.longitude}&daddr=${coordinates[0]},${coordinates[1]}`;
  // alert(url);
  window.open(url, "_blank");
};
</script>

<template>
  <div class="w-full h-[42vh] z-0">
    <LMap
      ref="map"
      :use-global-leaflet="true"
      :zoom="zoom"
      :min-zoom="5"
      :max-zoom="24"
      :center="center"
      :options="{ zoomControl: true }"
      class="z-0"
    >
      <!-- --------------------Layers---------------------- -->
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type="base"
        name="OpenStreetMap"
      />

      <!-- --------------------Markers---------------------- -->
      <LMarker
        v-for="placeLocation in placeLocations"
        :key="placeLocation.area?.name"
        :lat-lng="placeLocation.location?.coordinates"
        :name="placeLocation.area?.name"
      >
        <!-- -------------------------Icon Image---------------- -->

        <LIcon
          :name="placeLocation.area?.name"
          :class="'custom-div-icon'"
          :icon-size="[40, 40]"
          icon-url="/images/static/small-size-logo.png"
        ></LIcon>

        <!-- -------------------------Tooltip---------------- -->
        <LTooltip :permanent="true" :direction="'top'" :offset="[0, -50]">
          <div class="text-primary-600">{{ placeLocation.area?.name }}</div>
        </LTooltip>
        <!-- -------------------------Popup---------------- -->
        <LPopup :offset="[0, -50]">
          <div class="flex flex-col w-full">
            <p class="text-primary-600">{{ placeLocation.area?.name }}</p>

            <button
              @click="openDirectionOnMap(placeLocation.location?.coordinates)"
              class="flex justify-between w-full text-blue-700"
            >
              Direction
            </button>
          </div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<style>
.custom-div-icon {
  background-color: blue;
}

.leaflet-popup-content-wrapper {
  width: 150px !important;
}

.leaflet-popup-content {
  width: 80% !important;
}
</style>
