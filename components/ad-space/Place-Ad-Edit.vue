<script setup>
import editPlaceAdMutation from "@/graphql/mutations/place-ads/edit.gql";
import addMedia from "@/graphql/mutations/medias/add-media.gql";
import getPlaceAdQuery from "@/graphql/query/place-ads/item.gql";
import useNotify from "@/use/notify";
console.log("selamu dawi");

const { notify } = useNotify();
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const refetchAds = inject("refetchAds");
const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});

/***---------------------Tab--------------------- */
const { handleSubmit, isSubmitting } = useForm({});

/*...................Place detail data fetch.............*/
const placeType = ref("");
const place = ref(0);
const slogan = ref("");
const description = ref("");
const startDate = ref("");
const endDate = ref("");
const placeAd = ref({});
const images = ref([]);

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
    images.value = placeAdsByPk.place_ad_medias?.map(
      (adMedia) => adMedia.media?.url
    );
  }
});

placeAdOnError((error) => {
  let message = error.message;
  let title = "Some thing went wrong";
  let borderClass = "border-l-8 border-red-300";
  if(error.message == "database ") {
    title = "warning";
    message = "database query error";
    borderClass = "border-l-8 border-yellow-300";
  }
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: borderClass,
  });
});

const { mutate, onDone, onError, loading } = authMutation(editPlaceAdMutation);
/**-----------------------Handle add --------------------------- */
const handleEdit = handleSubmit(() => {
  if (images.value.length == 0) {
    notify({
      title: "Images required",
      description: "Please add at least one images",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });

    return;
  }
  let input = {
    description: description.value,
    slogan: slogan.value,
    startDate: startDate.value,
    endDate: endDate.value,
    type: placeType.value,
    placeId: place.value,
  };

  let placeAdMedias = images.value.map((image) => ({
    placeAdId: props.id,
    media: {
      data: {
        url: image,
      },
    },
  }));
  mutate({ input, id: props.id, placeAdMedias });
});

onDone(() => {
  notify({
    title: "Ad space edited successfully",
    description: "Ad space edited successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });

  open.value = false;
  if (refetchAds) {
    refetchAds();
  }
});

onError((error) => {
  let message = error.message;
  let title = "Some thing went wrong";
  let borderClass = "border-l-8 border-red-300";
  if(error.message == "database query error") {
    title = "warning";
    message = "you can't update in this gap time because there is ad already in this time";
    borderClass = "border-l-8 border-yellow-300";
  }
  notify({
    title: "Some thing went wrong",
    description: message,
    type: "error",
    borderClass: borderClass,
  });
});
</script>

<template>
  <ModalsModal body-class="max-w-[40rem] !p-12" v-model="open">
    <template #header>
      <h2 class="leading-6 text-xl text-gray-900 pb-6">Edit Ad Space</h2>
    </template>
    <template #content>
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
        <!-- ------------------Place---------------- -->

        <SelectorsPlace :type="placeType" v-model="place"> </SelectorsPlace>

        <!-- -----------------Start and End Date -->
        <div class="flex  justify-between pt-6 gap-x-6">
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
            :rules="`required|date_greater_than_latest_plus_seven:${startDate}`"
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

        <!----------------------------------------upload images ---------------------------------------->

        <div class="flex flex-col gap-y-4 pt-4">
          <p class="mb-2 text-sheger-gray-100">Upload images</p>

          <HFileUploadWrapper
            name="adImages"
            :maxFileSize="1024 * 1024 * 10"
            :fileLimit="5"
            folder=""
            description="upload file"
            placeholder="select multiple files"
            v-model="images"
            :init="images"
            :disabled="false"
            :showStar="false"
          />
        </div>
        <!-- ----------------------Submit------------------- -->
        <button
          :disabled="loading"
          type="submit"
          class="primary-button text-white bg-primary-600 mt-4"
        >
          <span>Edit</span>
          <Icon name="uil:edit" class="text-2xl"></Icon>
          <Icon
            v-if="loading"
            name="eos-icons:bubble-loading"
            class="text-3xl text-white"
          />
        </button>
      </form>
    </template>
  </ModalsModal>
</template>
