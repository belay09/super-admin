<script setup>
import addPlaceAdMutation from "@/graphql/mutations/place-ads/add.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emits = defineEmits(["update:modelValue"]);
const props = defineProps({
  placeType: {
    type: String,
    default: "HOTELS",
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  lastDate: {
    type: String,
    default: null,
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
const latestStartDate= ref(props.lastDate)
watchEffect(() => {
  latestStartDate.value = props.lastDate;
});
const { handleSubmit, isSubmitting } = useForm({});
const place = ref("");
const slogan = ref("");
const description = ref("");
const startDate = ref("");
const endDate = ref("");
const images = ref([]);

const { mutate, onDone, onError, loading } = authMutation(addPlaceAdMutation);
/**-----------------------Handle add --------------------------- */
const handleAdd = handleSubmit(() => {
  if (images.value.length == 0) {
    notify({
      title: "Images required",
      description: "Please add at least one images",
      type: "error",
      borderClass: "border-l-8 border-red-300",
    });
    return;
  }
  // New validation for start and end date gap
  const startDateObj = new Date(startDate.value);
  const endDateObj = new Date(endDate.value);
  const timeDiff = endDateObj - startDateObj;
  const dayDiff = timeDiff / (1000 * 3600 * 24);

  if (dayDiff !== 7) {
    notify({
      title: "Date Gap Error",
      description: "The gap between start date and end date must be exactly 7 days.",
      type: "error",
      borderClass: "border-l-8 border-yellow-300",
    });
    return;
  }

  let input = {
    description: description.value,
    slogan: slogan.value,
    startDate: startDate.value,
    endDate: endDate.value,
    type: props.placeType,
    placeId: place.value,
    place_ad_medias: {
      data: images.value.map((image) => ({
        media: {
          data: {
            url: image,
          },
        },
      })),
    },

    media: {
      data: {
        url: "",
      },
    },
  };
  mutate({ input });
});

onDone(() => {
  notify({
    title: "Ad space added successfully",
    description: "Ad space added successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
  open.value = false;
  if (refetchAds) {
    refetchAds();
  }
});

onError((error) => {
  let Message="Some thing went wrong"
  let title= "Some thing went wrong"
  let borderClass= "border-l-8 border-red-300"

  if (error.message.includes("database query error")) {
    Message = "Can't add please check the last date of previous add date and  the date gap must be 7 days or check subscription plan for more ad space";
    title="Date gap error"
    borderClass= "border-l-8 border-yellow-300"
  }
  notify({
    title: title,
    description: Message,
    type: "error",
    borderClass: borderClass,
  });
});
</script>

<template>
  <ModalsModal body-class="max-w-[40rem] !p-12" v-model="open">
    <template #header>
      <h2 class="leading-6 text-xl text-gray-900 pb-6">Add Ad Space</h2>
    </template>
    <template #content>
      <form @submit.prevent="handleAdd" class="flex flex-col" action="">
        <!-- ------------------Place---------------- -->
        <Selectors-Place :type="placeType" v-model="place"> </Selectors-Place>

        <!-- -----------------Start and End Date  -->
        <div class="flex justify-between pt-6 gap-x-6">
          <HDatePicker
            id="start_date"
            name="start_date"
            label="Start Date"
            class="w-full"
            label-class="!text-sheger-gray-100"
            :rules="`required|date_greater_than_latest:${latestStartDate}`"
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
            label-class="!text-sheger-gray-100"
            v-model="endDate"
          ></HDatePicker>
        </div>

        <!-- ----------------------Slogan------------------- -->

        <H-Textfield
          id="slogan"
          name="slogan"
          label="Slogan"
          placeholder="Write here...."
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
          <span>Add</span>
          <Icon name="heroicons:plus-small-solid" class="text-2xl"></Icon>
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
