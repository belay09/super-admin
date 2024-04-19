<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import { icon } from "leaflet";
import { computed } from "@vue/reactivity";
import marker_icon_2x from "leaflet/dist/images/marker-icon-2x.png";
import marker_icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
// import { InformationCircleIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  titleClass: String,
  zoom: Number,
  mapClass: String,
});
const mapping = ref(null);
const userLocation = ref({});
const zoom = ref(14);
const loading = ref(false);
const position = ref({ lat: props.lat, lng: props.long });
const address = ref("");
const dragging = ref(false);
// console.log("lat and long", position.value);
const defaultLocation = ref({
  lat: props.lat || 8.993194,
  lng: props.long || 38.774942,
});

// console.log("and other lat and long", defaultLocation.value);

const emit = defineEmits(["updateMapVal", "close"]);
const icons = ref(
  icon({
    iconRetinaUrl: marker_icon_2x,
    iconUrl: marker_icon,
    shadowUrl: shadow,
    // iconSize: [38, 75],
    iconAnchor: [30, 60],
  })
);

const tileProvider = ref({
  attribution:
    '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
});

// console.log("tile provider", tileProvider.value);
const getUserPosition = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      userLocation.value = {
        lat: props.lat || pos.coords.latitude,
        lng: props.long || pos.coords.longitude,
      };
      position.value = {
        lat: props.lat || pos.coords.latitude,
        lng: props.long || pos.coords.longitude,
      };
    });
  }
};

onMounted(async () => {
  getUserPosition();
});

const getAddress = async () => {
  loading.value = true;
  let address = "unresolved address";
  try {
    const { lat, lng } = await position.value;
    const result = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
    );
    if (result.status === 200) {
      const body = await result.json();
      address = body.display_name;
    }
  } catch (e) {
    // console.log("Reserve Geocode Error->", e);
  }
  loading.value = false;
  return address;
};

watch(
  position,
  async (value) => {
    // console.log("Watcher", value);
    address.value = await getAddress();
    emit("updateMapVal", {
      position: value || defaultLocation.value,
      address: address.value,
    });
    // console.log("WatcdefaultLocationher", defaultLocation);

    // console.log("position in wathcer", position.value);
  },
  { deep: true }
);

const doSomethingOnReady = () => {};

const onMapClick = async (value) => {
  console.log(value);
  if (value.latlng) {
    position.value = value.latlng;
  }
  emit("updateMapVal", {
    position: value || defaultLocation.value,
  });
};

const tooltipContent = computed(() => {
  if (dragging.value) return "...";
  if (loading.value) return "Loading...";
  if (!address.value)
    return `<strong>Unknown Location</strong> <hr/><strong>lat:</strong> ${position.value.lat}<br/> <strong>lng:</strong> ${position.value.lng}`;
  return `<strong>${address.value.replace(
    ",",
    "<br/>"
  )}</strong> <hr/><strong>lat:</strong> ${
    position.value.lat
  }<br/> <strong>lng:</strong> ${position.value.lng}`;
});
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <div class="h-[500px]" :class="mapClass">
      <l-map
        ref="map"
        class="h-full"
        @dblclick="onMapClick"
        :zoom="zoom"
        :maxZoom="18"
        :center="[
          position.lat || userLocation.lat || defaultLocation.lat,
          position.lng || userLocation.lng || defaultLocation.lng,
        ]"
      >
        <l-tile-layer
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
        />

        <l-marker
          v-if="position.lat && position.lng"
          visible
          :lat-lng="position"
          :icon="icons"
          @dragstart="dragging = true"
          @dragend="dragging = false"
        >
          <l-tooltip :content="tooltipContent" :options="{ permanent: true }" />
        </l-marker>
      </l-map>
    </div>

    <div
      type="button"
      class="primary-button bg-primary-600 text-white w-fit px-3 my-3"
      @click="emit('close')"
    >
      Confirm & Add
    </div>
  </div>
</template>
