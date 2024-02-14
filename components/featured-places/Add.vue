<script setup>
import placesQuery from "@/graphql/query/places/list.gql";
import addMutation from "@/graphql/mutations/featured-places/add-list.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const { handleSubmit, isSubmitting } = useForm({});

const emit = defineEmits(["add"]);
const props = defineProps({
  featuredValue: {
    type: String,
    required: true,
  },
});

/**------------------------Feature selected places---------------------- */
const selectedPlaces = ref([]);
const startDate = ref("");
const endDate = ref("");

/***---------------------Place data fetch--------------------- */
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const places = ref([]);
const limit = ref(6);
const length = ref(0);
const offset = ref(0);
const search = ref("");

/***-------------------------Compute offset------------------------- */

/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
  let query = {};
  query._and = [
    {
      name: {
        _ilike: `%${search.value}%`,
      },
    },
  ];

  return query;
});

// TODO order by
const { onResult, onError, loading, refetch } = authListQuery(
  placesQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.places) {
    places.value = result.data.places;
    length.value = result.data.placesAggregate?.aggregate?.count;
  }
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

function isFeatured(place) {
  return selectedPlaces.value.some(
    (selectedPlace) => selectedPlace.id === place.id
  );
}

function toggleSelect(placeId) {
  if (selectedPlaces.value.some((selectedPlace) => selectedPlace === placeId))
    selectedPlaces.value = selectedPlaces.value.filter(
      (selectedPlace) => selectedPlace !== placeId
    );
  else selectedPlaces.value.push(placeId);
}

/**---------------------------Add New Featured places--------------------------- */
const {
  mutate: addMutate,
  onDone: addDone,
  onError: addError,
  loading: addLoading,
} = authMutation(addMutation);

/**-----------------------Handle add --------------------------- */
const handleAdd = handleSubmit(() => {
  if (selectedPlaces.value.length == 0) {
    notify({
      title: "No places are selected",
      description: "Please select places",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
    return;
  }

  let input = [];
  selectedPlaces.value.forEach((place) => {
    input.push({
      startDate: startDate.value,
      endDate: endDate.value,
      type: props.featuredValue,
      placeId: place,
      isActive: true,
    });
  });
  addMutate({ input });
});

addDone(() => {
  emit("add");
  notify({
    title: "Featured successfully",
    description: "Featured successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

addError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <div class="flex flex-col gap-y-8">
    <!-- ---------------------List places--------------------- -->
    <div class="flex flex-col gap-y-8">
      <form @submit.prevent="handleAdd" class="flex flex-col gap-y-2">
        <div class="flex items-center justify-between">
          <p class="text-xl font-medium">
            Selected {{ selectedPlaces.length }} Places
          </p>
          <button class="primary-button block bg-primary-600">
            <span class="text-white">Confirm and Post</span>
          </button>
        </div>

        <!-- -----------------Start and End Date -->
        <div class="flex items-center justify-between pt-6 gap-x-6">
          <HDatePicker
            id="start_date"
            name="start_date"
            label="Start Date"
            class="w-full"
            rules="required"
            trailing-icon="uil:calender"
            trailing-icon-class="lg:text-sheger-gray-100"
            v-model="startDate"
          ></HDatePicker>
          <HDatePicker
            id="end_date"
            name="end_date"
            rules="required"
            label="End Date"
            trailing-icon="uil:calender"
            trailing-icon-class="lg:text-sheger-gray-100"
            class="w-full"
            v-model="endDate"
          ></HDatePicker>
        </div>
      </form>

      <!-- --------------------Search places------------- -->
      <H-Textfield
        name="search"
        type="text"
        placeholder="Search here"
        trailing-icon="uil:search"
        v-model="search"
      ></H-Textfield>

      <!-- ------------------Place list----------------- -->
      <div class="grid grid-cols-1 gap-8">
        <Ui-Cards-FeaturedPlace
          v-for="place in places"
          :place="place"
          :key="place.id"
          :isFeatured="isFeatured(place)"
          :featuredValue="featuredValue"
          :isAdd="true"
          @toggleSelect="toggleSelect"
        />
      </div>

      <HPaginate
        :items-per-page="limit"
        v-model:offset="offset"
        :total-data="length"
        class="w-full pt-16"
      ></HPaginate>
    </div>

    <!-- ---------------------List selected places--------------------- -->
  </div>
</template>
