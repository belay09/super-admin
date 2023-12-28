<script setup>
/*----------------------Globals--------------------------*/
const emit = defineEmits(["flyTo"]);
const props = defineProps({
  placeLocations: {
    type: Array,
    required: true,
    default: () => [],
  },
});

/*----------------------fly to--------------------------*/
const currentShowedLocationIndex = ref(0);
const flyTo = (coordinates, index) => {
  currentShowedLocationIndex.value = index;
  emit("flyTo", coordinates);
};
</script>

<template>
  <div
    v-for="(placeLocation, index) in placeLocations"
    :key="placeLocation.id"
    @click="flyTo(placeLocation.location?.coordinates, index)"
    class="flex items-center py-1 px-4 text-sheger_dark_gray-200 space-x-2 bg-sheger-gray-700 rounded-full cursor-pointer duration-300"
    :class="{
      ' iphone5:bg-primary-600 ': index === currentShowedLocationIndex,
    }"
  >
    <Icon name="uil:location-point" color="" class="" />
    <p class="whitespace-nowrap">{{ placeLocation.area?.name }}</p>
  </div>
</template>
