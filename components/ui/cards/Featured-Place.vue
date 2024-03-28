<script setup>
/**--------------------Imports------------------------------- */
import { onClickOutside } from "@vueuse/core";
import editMutation from "@/graphql/mutations/featured-places/edit.gql";
import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**------------------------Globals------------------------- */
const { notify } = useNotify();
const emit = defineEmits(["toggleSelect", "edit"]);
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isAdd: {
    type: Boolean,
    default: false,
  },
  featuredValue: {
    type: String,
    required: true,
  },
});

/***---------------------------Main location---------------------- */
const mainLocation = ref(null);

/**--------------------Convert the feature value to name------------- */
function featuredPlaceValue(value) {
  if (value === "RECENTLY_OPENED_PLACE") {
    return {
      name: "Recently Opened",
      class: " text-[#47FF6F]",
    };
  } else if (value === "WEEKLY_RECOMMENDED_PLACE") {
    return {
      name: "Recommendation",
      class: "text-[#47FF6F]",
    };
  } else if (value === "SEASONAL_PLACE") {
    return {
      name: "Seasonal",
      class: "text-[#47FF6F]",
    };
  }
}

/**---------------------------Select place to make it featured-------------- */
const isSelected = ref(false);
function makePlaceFeatured() {
  if (!props.isAdd) {
    return;
  }
  isSelected.value = !isSelected.value;
  emit("toggleSelect", props.place.id); // add the featured place
}

/**---------------------------Get the other featured type data by using id------------------ */
function getFeaturedPlace() {
  const featuredPlace = props.place.featured_places.find(
    (featured) => featured.featured_place_type.value === props.featuredValue
  );
  return featuredPlace;
}

/**--------------------------Click outside------------------- */
const featureActionsContainer = ref(null);
onClickOutside(featureActionsContainer, (e) => (showMoreAction.value = false));

/**------------------------------Handle edit--------------- */
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editMutation);

/**-------------------------Remove from featured---------------- */
const removeFromFeatured = () => {
  let input = {
    isActive: false,
  };
  editMutate({ input, id: getFeaturedPlace().id });
};

/**--------------------------Extend date------------------------ */
const endDate = ref("");
const extendDate = handleSubmit(() => {
  let input = {
    endDate: endDate.value,
  };
  editMutate({ input, id: getFeaturedPlace().id });
});

/***-----------------------Edit on done------------------------ */
editDone(() => {
  showMoreAction.value = false;
  showExtendEndDateModal.value = false;
  emit("edit");
  notify({
    title: "Updated  successfully",
    description: "Updated  successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

editError((error) => {
  showMoreAction.value = false;
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

onMounted(() => {
  endDate.value = getFeaturedPlace().endDate;
  isSelected.value = props.isFeatured;

  mainLocation.value =
    props.place.placeLocations.find(
      (placeLocation) => placeLocation.isMainLocation
    ) || props.place.placeLocations[0];
});

// place detail page
function gotoDetailPage() {
  router.push(`/app/places/${props.place.id}`);
}

/***-----------------Modals--------------------------- */
const showExtendEndDateModal = ref(false);
const showRemoveFromFeaturedModal = ref(false);
const showMoreAction = ref(false);
</script>
<template>
  <!-- -------------------Extend end date modal--------------- -->
  <Modals-Modal
    body-class="!max-w-[30rem]"
    :autoClose="true"
    :modelValue="showExtendEndDateModal"
  >
    <template #header>
      <div class="flex items-center justify-between pb-4">
        <h3 class="text-lg font-medium text-gray-900">Extend Deadline</h3>
        <button @click="showExtendEndDateModal = false">
          <Icon name="system-uicons:close" class="text-4xl" />
        </button>
      </div>
    </template>
    <template #content>
      <div>
        <form
          @submit.prevent="extendDate"
          class="flex flex-col gap-y-3"
          action=""
        >
          <!-- ---------------------Date------------- -->
          <HDatePickers
            id="end_date"
            name="end_date"
            rules="required"
            label="End Date"
            trailing-icon="uil:calender"
            trailing-icon-class=""
            class="w-full"
            v-model="endDate"
          ></HDatePickers>

          <!-- ------------------Update button---------------- -->
          <button
            @click="showConfirmationModal = true"
            class="primary-button border justify-center secondary-text"
          >
            Update Deadline
            <Icon
              v-if="editLoading"
              name="eos-icons:bubble-loading"
              class="text-3xl text-red-600"
            />
          </button>
        </form>
      </div>
    </template>
  </Modals-Modal>

  <!-- -----------------Remove from featured ---------------- -->

  <ModalsConfirmation
    @confirm="removeFromFeatured"
    v-model="showRemoveFromFeaturedModal"
    :title="`Remove from ${featuredPlaceValue(featuredValue).name}`"
    v-bind:sure-question="`Are you sure you want to remove ${
      featuredPlaceValue(featuredValue).name
    } ?`"
    description=""
  ></ModalsConfirmation>
  <!-- -----------------------Card---------------- -->
  <div
    @click="makePlaceFeatured"
    class="flex flex-col border max-w-lg p-[25px] rounded-xl text-sm hover:cursor-pointer"
    :class="isSelected ? 'border-primary-600' : ''"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex gap-3 w-full">
        <!-- Logo -->
        <div class="w-20 h-20 self-start shrink-0 mr-1">
          <!-- Image -->
          <img
            :src="place.light_logo?.url"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </div>
        <!-- Middle -->
        <div class="flex flex-col gap-2 w-full">
          <!-- -----------------Name ------------------->
          <div class="flex justify-between">
            <h1 class="text-xl font-medium">{{ place.name }}</h1>
            <!---------------- Option Icon---------------- -->
            <div v-if="isSelected && isAdd" class="hover:cursor-pointer">
              <Icon name="icons8:checked" class="text-2xl text-primary-600" />
            </div>
            <div v-if="!isAdd" class="relative">
              <button
                @click="showMoreAction = !showMoreAction"
                class="hover:cursor-pointer"
              >
                <Icon name="iwwa:option" class="text-3xl" />
              </button>

              <!-- -----------------------Extend date and Remove from feature --------------- -->
              <div
                ref="featureActionsContainer"
                v-if="showMoreAction"
                class="absolute top-7 left-0 w-72 flex flex-col gap-y-4 shadow-xl bg-white rounded-lg p-5"
              >
                <div
                  class="flex gap-3 items-center"
                  @click="showExtendEndDateModal = true"
                >
                  <Icon
                    name="heroicons:calendar-days-16-solid"
                    class="text-2xl shrink-0"
                  />
                  <p class="text-sm">Extend Deadline</p>
                </div>
                <button
                  @click="showRemoveFromFeaturedModal = true"
                  class="flex gap-3 items-center"
                >
                  <Icon
                    name="heroicons:minus-16-solid"
                    class="text-2xl shrink-0"
                  />
                  <p class="text-sm text-primary-600 whitespace-nowrap">
                    Remove from {{ featuredPlaceValue(featuredValue)?.name }}
                  </p>
                </button>
              </div>
            </div>
          </div>
          <!-- status -->
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <div class="bg-blue-300 px-2 py-1 rounded-sm">
              <p class="text-primary-600 font-medium capitalize">
                {{ place.type?.toLowerCase() }}
              </p>
            </div>
            <div
              v-for="featuredType in place?.featured_places"
              class="px-2 py-1 rounded-sm"
              :class="
                featuredType.isActive
                  ? 'bg-green-200 text-primary-600'
                  : 'bg-primary-100 text-primary-600'
              "
            >
              <p class="font-medium">
                {{
                  featuredPlaceValue(featuredType.featured_place_type?.value)
                    .name
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- -------------------Body ---------------------------->
    <div class="flex flex-col gap-4 my-2 text-sheger-gray-100">
      <!----------------- Rating , Review   and Like -------------->
      <CommonReviewRatingLike
        :rating="place.place_aggregate_summary?.avgRating || 0"
        :like="place.place_aggregate_summary?.sumLikes || 0"
        :review="place.placeReviewsAggregate?.aggregate?.count || 0"
      ></CommonReviewRatingLike>
      <!-------------------- Location------------------ -->
      <div v-if="mainLocation" class="flex items-center gap-3">
        <Icon name="carbon:map" class="h-5 w-5" />

        <span class="decoration-sheger_brown-200 underline leading"
          >{{ mainLocation.area?.name }}, {{ mainLocation.city?.name }}</span
        >
      </div>
      <!-- Tags -->
      <div class="flex flex-wrap secondary-text pb-4">
        <p
          v-for="placeTag in place.placeTags"
          :key="placeTag.tag.id"
          class="pr-2"
        >
          #{{ placeTag.tag.title }}
        </p>
      </div>
      <!-- menu update -->

      <div v-if="getFeaturedPlace()" class="flex items-center gap-3">
        <Icon name="carbon:calendar" class="h-5 w-5" />
        <p class="">
          {{ getFeaturedPlace()?.startDate }} to
          {{ getFeaturedPlace()?.endDate }}
        </p>
      </div>

      <!-- last payed -->
      <div class="flex items-center gap-3">
        <Icon name="carbon:calendar" class="h-5 w-5" />
        <p class="">Last payed: 2 days ago</p>
      </div>

      <!-- --------------------Award ----------------->
      <div v-if="place.shegerRecommendation" class="flex items-center gap-3">
        <Icon name="uil:award-alt" class="h-5 w-5" />
        <p class="">{{ place.shegerRecommendation?.title }}</p>
      </div>
    </div>
  </div>
</template>
