<script setup>
import addPlaceAdMutation from "@/graphql/mutations/place-ads/add.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["add"]);

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

const placeType = ref("");
const place = ref("");
const slogan = ref("");
const description = ref("");
const startDate = ref("");
const endDate = ref("");
const url = ref("");

const noImageIsSelected = ref(false);
watch(
  () => url.value,
  (value) => {
    if (value != "") {
      noImageIsSelected.value = false;
    } else {
      noImageIsSelected.value = true;
    }
  }
);

const { mutate, onDone, onError, loading } = authMutation(addPlaceAdMutation);

/**-----------------------Handle add --------------------------- */
const handleAdd = handleSubmit(() => {
  if (url.value == "") {
    noImageIsSelected.value = true;
    return;
  }
  let input = {
    description: description.value,
    slogan: slogan.value,
    startDate: startDate.value,
    endDate: endDate.value,
    type: placeType.value,
    placeId: place.value,
    media: {
      data: {
        url: url.value,
      },
    },
  };
  mutate({ input });
});

onDone(() => {
  emit("add");
  notify({
    title: "Ad space added successfully",
    description: "Ad space added successfully",
    type: "error",
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
  <form @submit.prevent="handleAdd" class="flex flex-col" action="">
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

    <AdSpace-PlaceSelector v-model="place"> </AdSpace-PlaceSelector>

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
    ></CommonUploadSingleImage>
    <p v-if="noImageIsSelected" class="text-red-500">No image is selected</p>

    <!-- ----------------------Submit------------------- -->
    <button
      :disabled="loading"
      type="submit"
      class="primary-button secondary-border py-3 mt-4"
    >
      <span>Add</span>
      <Icon name="heroicons:plus-small-solid" class="text-2 xl"></Icon>
      <Icon
        v-if="loading"
        name="eos-icons:bubble-loading"
        class="text-3xl text-red-600"
      />
    </button>
  </form>
</template>
