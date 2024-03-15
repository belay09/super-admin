<script setup>
import editPlaceAdMutation from "@/graphql/mutations/place-ads/edit.gql";
import addMedia from "@/graphql/mutations/medias/add-media.gql";
import getPlaceAdQuery from "@/graphql/query/place-ads/item.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["edit"]);
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

/***---------------------Tab--------------------- */
const { handleSubmit, isSubmitting } = useForm({});

const placeTypeItems = ref([
  {
    name: "Hotels",
    id: "HOTELS",
  },
  {
    name: "Restaurants",
    id: "RESTAURANTS",
  },
  {
    name: "Cafes",
    id: "CAFES",
  },
  {
    name: "Caterings",
    id: "CATERINGS",
  },
]);

/*...................Place detail data fetch.............*/
const placeType = ref("");
const place = ref(0);
const slogan = ref("");
const description = ref("");
const startDate = ref("");
const endDate = ref("");
const url = ref("");
const placeAd = ref({});

const {
  onResult: placeAdOnResult,
  onError: placeAdOnError,
  loading: placeAdLoading,
} = authItemQuery(getPlaceAdQuery, props.id);

placeAdOnResult((result) => {
  if (result.data?.placeAdsByPk) {
    placeAd.value = result.data.placeAdsByPk;
    const placeAdsByPk = result.data.placeAdsByPk;
    placeType.value = placeAdsByPk.place?.type;
    place.value = placeAdsByPk.place?.id;
    slogan.value = placeAdsByPk.slogan;
    description.value = placeAdsByPk.description;
    startDate.value = placeAdsByPk.startDate;
    endDate.value = placeAdsByPk.endDate;
    url.value = placeAdsByPk.media?.url;
  }
});

placeAdOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

/**----------------------------Add media--------------------- */
const {
  mutate: addMediaMutate,
  onDone: addMediaOnDone,
  onError: addMediaOnError,
  loading: addMediaLoading,
} = authMutation(addMedia);

addMediaOnDone((result) => {
  let input = {
    description: description.value,
    slogan: slogan.value,
    startDate: startDate.value,
    endDate: endDate.value,
    type: placeType.value,
    placeId: place.value,
    mediaId: result.data?.insertBasicsMediaOne?.id,
  };
  mutate({ input, id: props.id });
});

addMediaOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const { mutate, onDone, onError, loading } = authMutation(editPlaceAdMutation);
/**-----------------------Handle add --------------------------- */
const handleEdit = handleSubmit(() => {
  if (url.value != placeAd.value.media?.url) {
    addMediaMutate({
      input: {
        url: url.value,
      },
    });
  } else {
    let input = {
      description: description.value,
      slogan: slogan.value,
      startDate: startDate.value,
      endDate: endDate.value,
      type: placeType.value,
      placeId: place.value,
    };
    mutate({ input, id: props.id });
  }
});

onDone(() => {
  emit("edit");
  notify({
    title: "Ad space edited successfully",
    description: "Ad space edited successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <!-- Skeleton container for the form -->
  <div v-if="placeAdLoading" class="flex flex-col space-y-4">
    <!-- Title skeleton -->
    <div class="flex flex-col space-y-4">
      <div class="skeleton w-1/3 h-8"></div>
      <div class="skeleton w-full h-12"></div>
    </div>

    <!-- Price skeleton -->
    <div class="flex flex-col space-y-4">
      <div class="skeleton w-1/3 h-8"></div>
      <div class="skeleton w-full h-12"></div>
    </div>
    <!-- Description skeleton -->
    <div class="flex flex-col space-y-4">
      <div class="skeleton w-1/3 h-8"></div>
      <div class="skeleton w-full h-36"></div>
    </div>
    <!-- Image Upload skeleton -->
    <div class="skeleton w-full h-36"></div>

    <!-- Submit button skeleton -->
    <div class="skeleton w-full h-12"></div>
    <div class="skeleton w-full h-12"></div>
  </div>
  <form
    v-else
    @submit.prevent="handleEdit"
    class="flex flex-col space-y-2"
    action=""
  >
    <!-- ----------------Add space or place type----- -->
    <H-SingleSelect
      name="ad_space"
      id="ad_space"
      label="AD Space"
      :items="placeTypeItems"
      v-model="placeType"
      rules="required"
    ></H-SingleSelect>
    <!-- ------------------Place---------------- -->

    <SelectorsPlace :type="placeType" v-model="place"> </SelectorsPlace>

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

    <!-- ----------------------Slogan------------------- -->

    <H-Textfield
      id="slogan"
      name="slogan"
      label="Slogan"
      placeholder="Write here"
      v-model="slogan"
      rules="required"
    ></H-Textfield>

    <!-- ---------------------Description---------------- -->

    <H-Textarea
      id="description"
      name="description"
      label="Description"
      class="pt-4"
      rules="required"
      v-model="description"
    ></H-Textarea>

    <!-- ----------------------Upload Image------------------- -->
    <CommonUploadSingleImage
      folder=""
      v-model:model-value="url"
      rules="required"
      name="adImage"
    ></CommonUploadSingleImage>

    <!-- ----------------------Submit------------------- -->
    <button
      :disabled="loading"
      type="submit"
      class="primary-button secondary-border py-3 mt-4"
    >
      <span>Edit</span>
      <Icon name="uil:edit" class="text-2 xl"></Icon>
      <Icon
        v-if="loading"
        name="eos-icons:bubble-loading"
        class="text-3xl text-red-600"
      />
    </button>
  </form>
</template>
