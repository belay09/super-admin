<script setup>
/*----------------------------Imports---------------------------*/

import getPlaceQuery from "@/graphql/query/places/item.gql";
import placesQuery from "@/graphql/query/places/list.gql";

import getPlacesMediasQuery from "@/graphql/query/medias/placeMedias.gql";

import useNotify from "@/use/notify";

/*----------------------------Global Variables---------------------------*/
const { notify } = useNotify();

const emits = defineEmits(["update:modelValue"]);
const route = useRoute();
const router = useRouter();

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  type: {
    type: String,
    required: true,
  },
});

/*............Tabs............*/

const currentTabIndex = ref(0);

const largeScreenTabs = ref([
  {
    name: "Overview",
    value: "overview",
  },

  {
    name: "Gallery",
    value: "gallery",
  },
  {
    name: "Menu",
    value: "menu",
  },
]);

watchEffect(() => {
  if (props.type == "CATERINGS") {
    largeScreenTabs.value = [
      ...largeScreenTabs.value,
      {
        name: "Portfolios",
        value: "portfolios",
      },
    ];
  }

  if (props.type == "HOTELS") {
    largeScreenTabs.value = [
      ...largeScreenTabs.value,
      {
        name: "Amenities",
        value: "amenities",
      },
    ];
  }
});

/*...................Place detail data fetch.............*/

const place = ref(null);

const {
  onResult: placeOnResult,
  onError: placeOnError,
  loading: placeLoading,
  refetch: placeItemRefetch,
} = authItemQuery(getPlaceQuery, route.params.id);

placeOnResult((result) => {
  if (result.data?.place) {
    place.value = result.data.place;
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

/*...................Place medias data fetch.............*/
const mediasFilter = ref({
  placeId: {
    _eq: route.params.id,
  },
});
const mediasLimit = ref(10);
const mediasOffset = ref(0);
const mediasSort = ref([{}]);
const medias = ref([]);
const {
  onResult: mediasOnResult,
  onError: mediasOnError,
  loading: mediasLoading,
} = authListQuery(
  getPlacesMediasQuery,
  mediasFilter,
  mediasSort,
  mediasOffset,
  mediasLimit
);

mediasOnResult((result) => {
  medias.value = result.data?.placeMedias;
});

/*---------------------------------Image gallery------------------------*/
const showGalleryModal = ref(false);
const galleryModalCurrentImage = ref("");
const openGalleryModal = (currentImageToShow) => {
  galleryModalCurrentImage.value = currentImageToShow;
  showGalleryModal.value = true;
};

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
</script>

<template>
  <ModalsModal body-class="h-screen w-screen !p-2 " v-model="open">
    <template #content>
      
      <div
        class="w-full h-[900px] overflow-y-auto relative first-letter:bg-white"
      >
        <!-- --------------------------------------Cancel and confirm-------------------------------- -->
        <div
          class="flex items-center justify-between my-2 xl:px-12 2xl:px-[100px]"
        >
          <button
            class="primary-button border flex items-center gap-4"
            @click="open = false"
          >
            <Icon name="uil:arrow-left" class="w-6 h-6" />
            Back
          </button>

          <button
            class="primary-button border flex items-center gap-4 text-white bg-primary-600"
            @click="router.push(`/app/places/${route.params.id}`)"
          >
            Publish
          </button>
        </div>

        <div v-if="place">
          <div class="pt-8">
            <PlacePreviewLargeScreenMultiImagesView
              @showGalleryModal="showGalleryModal = true"
              :images="medias"
              :place="place"
              v-if="!mediasLoading && medias.length > 0"
            ></PlacePreviewLargeScreenMultiImagesView>

            <div
              class="lg:pt-6 px-4 samsg:px-5 md:px-8 xl:px-12 2xl:px-[100px] flex iphone5:flex-col lg:flex-row justify-between w-full"
            >
              <!-- -------------------left side----------------------- -->
              <div
                class="flex flex-col space-y-4 lg:w-[65.5%] lg:pr-8 xl:pr-12"
              >
                <div class="hidden lg:block pt-8 w-full">
                  <H-Tab
                    :tabs="largeScreenTabs"
                    v-model:current-tab-index="currentTabIndex"
                  >
                    <template #overview>
                      <div class="py-4">
                        <PlacePreviewOverview
                          :place="place"
                        ></PlacePreviewOverview>
                      </div>
                    </template>
                    <template #reviews>
                      <PlacePreview-ReviewSummary
                        :place="place"
                      ></PlacePreview-ReviewSummary>
                    </template>
                    <template #gallery>
                      <PlacePreviewGallery
                        v-if="!mediasLoading && medias.length > 0"
                        :images="medias"
                        @showGalleryModal="showGalleryModal = true"
                      ></PlacePreviewGallery>
                    </template>
                    <template #menu>
                      <PlacePreviewMenus
                        :placeId="place.id"
                      ></PlacePreviewMenus>
                    </template>
                    <template #amenities>
                      <div class="py-4">
                        <PlacePreviewAmenities
                          :place="place"
                        ></PlacePreviewAmenities>
                      </div>
                    </template>
                    <template #portfolios>
                      <div class="py-4">
                        <PlacePreviewPortfolios
                          :placeId="place.id"
                        ></PlacePreviewPortfolios>
                      </div>
                    </template>
                  </H-Tab>
                </div>
              </div>

              <!-- --------------------------right side ------------------------>

              <div class="hidden lg:flex flex-col w-[34.5%]">
                <PlaceAndReview-LikeBookmarkShareButtons
                  :id="route.params.id"
                  type="place"
                  :name="place?.name || ''"
                ></PlaceAndReview-LikeBookmarkShareButtons>
                <PlacePreview-ReviewSummary
                  :place="place"
                ></PlacePreview-ReviewSummary>
              </div>
            </div>

            <div class="" v-if="!mediasLoading && medias.length > 0">
              <PlaceAndReview-Gallery
                :images="medias?.filter((placeMedia) => placeMedia?.isImage)"
                :current-image-to-show="galleryModalCurrentImage"
                v-model="showGalleryModal"
                v-if="showGalleryModal"
              ></PlaceAndReview-Gallery>
            </div>
          </div>
        </div>
        <div class="w-full h-screen" v-else>
          <HLoading></HLoading>
        </div>
      </div>
    </template>
  </ModalsModal>
</template>
