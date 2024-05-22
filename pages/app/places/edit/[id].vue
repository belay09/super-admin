<script setup>
import getPlaceQuery from "@/graphql/query/places/item.gql";
import useNotify from "@/use/notify";

/**-----------------------Globals----------------------------- */
const route = useRoute();
const router = useRouter();
const { notify } = useNotify();

/**------------------Place data fetch------------------- */
const placeType = ref("");
const place = ref();
const {
  onResult: placeOnResult,
  onError: placeOnError,
  loading: placeLoading,
} = authItemQuery(getPlaceQuery, route.params.id || -1);

placeOnResult((result) => {
  if (result.data?.place) {
    place.value = result.data.place;
    placeType.value = result.data.place?.type;
  }
});

placeOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

const currentStep = ref(0);
const placeId = route.params.id || -1;

// ---------------------------- Go Back Handler ----------------------------
const goPrev = () => {
  currentStep.value -= 1;
  router.push({ query: { step: currentStep.value } });
};

const openFinishModal = ref(false);

// ---------------------------- Go Next Handler ----------------------------
const goNext = () => {
  if (
    ((placeType.value == "RESTAURANTS" || placeType.value == "CAFES") &&
      currentStep.value == 3) ||
    ((placeType.value == "HOTELS" || placeType.value == "CATERINGS") &&
      currentStep.value == 4)
  ) {
    openFinishModal.value = true;
    return;
  }

  currentStep.value += 1;

  router.push({ query: { step: currentStep.value } });
};

onMounted(() => {
  if (route.query?.step) {
    currentStep.value = parseInt(route.query.step);
  }
});
watchEffect(() => {
  if (route.query?.step) {
    currentStep.value = parseInt(route.query.step);
  }
});

definePageMeta({
  layout: "engagement",
});
</script>
<template>
  <ModalsPlacePreview
    v-if="openFinishModal"
    :type="placeType"
    v-model="openFinishModal"
  />
  <div>
    <div class="flex justify-between h-20 my-4">
      <div
        class="rounded-tl-lg stepper-button"
        :class="
          currentStep == 0
            ? '!bg-primary-300'
            : currentStep > 0
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Basic Info
      </div>
      <div
        class="stepper-button"
        :class="
          currentStep == 1
            ? '!bg-primary-300'
            : currentStep > 1
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Location
      </div>

      <div
        class="stepper-button"
        :class="
          currentStep == 2
            ? '!bg-primary-300'
            : currentStep > 2
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Menu
      </div>
      <div
        class="stepper-button"
        :class="
          currentStep == 3
            ? '!bg-primary-300'
            : currentStep > 3
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Pictures
      </div>

      <!-- ------------------------If place type is Hotels---------------- -->

      <div
        v-if="placeType == 'HOTELS'"
        class="stepper-button"
        :class="
          currentStep == 4
            ? '!bg-primary-300'
            : currentStep > 4
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Amenities
      </div>
      <!-- ------------------------If place type is Caterings---------------- -->

      <div
        v-if="placeType == 'CATERINGS'"
        class="stepper-button"
        :class="
          currentStep == 4
            ? '!bg-primary-300'
            : currentStep > 4
            ? '!bg-primary-600 text-white'
            : ''
        "
      >
        Portfolio
      </div>
    </div>
    <div class="min-h-[70%] border flex flex-col justify-between px-5 py-2">
      <div class="h-full">
        <PlacesEditBasicInfo
          @next="goNext"
          @prev="goPrev"
          v-if="currentStep == 0"
          :placeId="placeId"
        />
        <PlacesFormLocation
          @next="goNext"
          @prev="goPrev"
          v-if="currentStep == 1"
          :placeId="placeId"
          :entityId="place.entitiyId"
        />

        <PlacesFormMenu
          @next="goNext"
          @prev="goPrev"
          v-if="currentStep == 2"
          :placeId="placeId"
        />
        <PlacesFormPictures
          @next="goNext"
          @prev="goPrev"
          v-if="currentStep == 3"
          :placeId="placeId"
        />

        <PlacesFormAmenities
          @next="goNext"
          @prev="goPrev"
          v-if="currentStep == 4 && placeType == 'HOTELS'"
          :placeId="placeId"
        />
        <PlacesFormPortfolio
          @next="goNext"
          @prev="goPrev"
          v-if="currentStep == 4 && placeType == 'CATERINGS'"
          :placeId="placeId"
        />
      </div>
    </div>
  </div>
</template>
