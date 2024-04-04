<script setup>
import addPlaceMutation from "@/graphql/mutations/place/addPlace.gql";
const { handleSubmit } = useForm({});

/**-----------------------Navigation----------------------------- */
const router = useRouter();

const emit = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

/**------------------------Data------------------------ */
const image_url = ref("");
const placeName = ref("");
const placeCousins = ref("");
const description = ref("");
const placeType = ref(props.modelValue);
const placeTag = ref([]);
const placeAmbiances = ref([]);
const placeCategory = ref([]);
const featureAsRecentlyOpened = ref(false);
const recentlyOpenedStartDate = ref(new Date().toISOString().split("T")[0]);
const recentlyOpenedEndDate = ref();
const phoneNumber = ref("");
const alternativePhoneNumber = ref("");
const email = ref("");
const website = ref("");
const socialMedia = ref([]);
const offerTakeout = ref(false);
const orderNumber = ref("");
const alternativeOrderNumber = ref("");
const socials = ref([]);

/*****************************Mutations******************************/
const {
  mutate: addPlace,
  loading: addPlaceLoading,
  onError: addPlaceError,
  onDone: addPlaceDone,
} = authMutation(addPlaceMutation);

addPlaceDone((result) => {
  if (result.data.insertPlacesOne) {
    router.push({
      path: `/app/places/edit/${result.data.insertPlacesOne.id}`,
      query: {
        step: 1,
      },
    });
  }
});

addPlaceError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const handleAddPlace = handleSubmit(() => {
  const input = {
    light_logo: {
      data: {
        url: image_url.value,
      },
    },
    name: placeName.value,
    cousins: placeCousins.value,
    description: description.value,
    type: placeType.value.toUpperCase(),
    placeTags: {
      data: placeTag.value.map((id) => ({ tagId: id })),
    },
    categoryId: placeCategory.value,
    placeAmbiances: {
      data: placeAmbiances.value.map((id) => ({ ambianceId: id })),
    },
    contactPhoneNumber: phoneNumber.value,
    contactAltPhoneNumber: alternativePhoneNumber.value,
    contactEmail: email.value,
    contactWebsite: website.value,
    offerTakeouts: offerTakeout.value,

    featuredReviewMedia: 3,
    placeSocialMedias: {
      data: socialMedia.value.map((social) => ({
        socialMediaId: social.id,
        url: social.url,
      })),
    },
  };

  // recently opened
  if (featureAsRecentlyOpened.value) {
    input.featured_places = {
      data: [
        {
          startDate: recentlyOpenedStartDate.value,
          endDate: recentlyOpenedEndDate.value,
          isActive: true,
          type: "RECENTLY_OPENED_PLACE",
        },
      ],
    };
  }

  // offer take out
  if (offerTakeout.value) {
    input.orderPhoneNumber1 = orderNumber.value;
    input.orderPhoneNumber2 = alternativeOrderNumber.value;
  }

  addPlace({
    obj: input,
  });
});

/**------------------------Emit place type to change the stepper---------------- */

watch(placeType, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<template>
  <div>
    <form
      @submit.prevent="handleAddPlace"
      class="flex"
      method="POST"
      id="basicInfoForm"
    >
      <!-- ----------------------------------------------Left-------------------------------- -->
      <div class="flex-[50%] px-20 flex flex-col gap-6 border-r p-5">
        <!-------------------------------------- image upload------------------------------------------------- -->

        <CommonUploadSingleImage
          folder=""
          v-model:model-value="image_url"
          rules="required"
          name="placeLogo"
        ></CommonUploadSingleImage>

        <!------------------------------------------------ Type--------------------------------------------->

        <SelectorsPlaceType v-model="placeType" />

        <!--------------------------------------------------- Place Name------------------------------- -->
        <HTextfield
          type="text"
          name="PlaceName"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          v-model="placeName"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100">Place Name</p>
          </template>
        </HTextfield>

        <!------------------------------------------------ Cousins ----------------------------------------->

        <HTextfield
          type="text"
          id="cousins"
          name="cousins"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          v-model="placeCousins"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100">Cousins</p>
          </template>
        </HTextfield>

        <!-- ------------------------------Description-------------------------->

        <HTextarea
          name="description"
          id="description"
          label="Description"
          rules="required"
          v-model="description"
        />

        <!-------------------------------------------------- Tag--------------------------------------->
        <SelectorsTag type="PLACE_TAG" v-model="placeTag" />

        <!-- --------------------------------------------------Ambiance----------------------------------- -->
        <SelectorsAmbiance v-model="placeAmbiance" name="placeAmbiance" />

        <!-- --------------------------------------------------Category----------------------------------- -->
        <SelectorsCategory
          type="PLACE_CATEGORY"
          v-model="placeCategory"
        ></SelectorsCategory>

        <!-- -------------------Featured Place------------ -->

        <div class="px-5 rounded-md border border-sheger-gray-200">
          <div class="flex justify-between items-center py-4">
            Feature as Recently Opened?
            <HSwitch
              name="houses_special"
              id="houses_special"
              label="houses_special"
              class="flex items-center"
              v-model="featureAsRecentlyOpened"
            ></HSwitch>
          </div>
          <!-- -----------------Start and End Date -->
          <div
            v-if="featureAsRecentlyOpened"
            class="grid items-center grid-cols-2 pt-6 gap-x-6"
          >
            <HDatePicker
              id="start_date"
              name="start_date"
              label="Start Date"
              class="w-full"
              rules="required"
              trailing-icon="uil:calender"
              trailing-icon-class="lg:text-sheger-gray-100"
              v-model="recentlyOpenedStartDate"
            ></HDatePicker>
            <HDatePicker
              id="end_date"
              name="end_date"
              rules="required"
              label="End Date"
              trailing-icon="uil:calender"
              trailing-icon-class="lg:text-sheger-gray-100"
              class="w-full"
              v-model="recentlyOpenedEndDate"
            ></HDatePicker>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="flex-[50%] px-20 flex flex-col gap-6 p-5">
        <div class="text-xl font-medium">Contact</div>

        <!------------------------------------Phone Number--------------------------------------->

        <HTextfield
          placeholder="+251900000000"
          rules="phoneNumber"
          name="phoneNumber"
          v-model="phoneNumber"
          type="text"
        >
          <template #label>
            <div class="lg:my-2">
              <span
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >Phone Number</span
              >
            </div>
          </template>
        </HTextfield>

        <!---------------------------------Alternative Phone Number------------------------------------>
        <HTextfield
          placeholder="+251900000000"
          rules="phoneNumber"
          name="alternativePhoneNumber"
          v-model="alternativePhoneNumber"
          type="text"
        >
          <template #label>
            <div class="lg:my-2">
              <span
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >Alternative Phone Number</span
              >
            </div>
          </template>
        </HTextfield>

        <!-------------------------------------Contact Email----------------------------->
        <HTextfield
          placeholder="email@example.com"
          name="Email"
          v-model="email"
          rules="requiredN|email"
          type="text"
        >
          <template #label>
            <div class="iphone5:my-2 lg:my-2">
              <span
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >Contact Email</span
              >
            </div>
          </template>
        </HTextfield>

        <!---------------------------------------------Website-------------------------- -->
        <HTextfield
          placeholder="www.example.com"
          name="Website"
          v-model="website"
          type="text"
        >
          <template #label>
            <div class="iphone5:my-2 lg:my-2">
              <span
                class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                >Contact Website</span
              >
            </div>
          </template>
        </HTextfield>

        <!-- ------------------------------------Social Media ------------------------ -->

        <div class="text-xl font-medium my-2">Social Media</div>
        <HSocialMedialSelectChips
          v-model="socialMedia"
          name="socialMedia"
          :socials="socials"
        ></HSocialMedialSelectChips>

        <!-- ----------------------------------Offer Takeout---------------------------------- -->

        <div
          class="flex flex-col gap-6"
          :class="{ 'border p-4 rounded-lg': offerTakeout }"
        >
          <div class="flex items-start justify-between my-3">
            <div class="text-xl font-medium">Offer Takeout</div>
            <HSwitch name="offer_takeout" v-model="offerTakeout"></HSwitch>
          </div>

          <!-- -------------------------------------OrderNumber---------------------------------- -->

          <HTextfield
            v-if="offerTakeout"
            placeholder="+251900000000"
            rules="phoneNumber"
            name="orderNumber"
            v-model="orderNumber"
            type="text"
          >
            <template #label>
              <div class="lg:my-2">
                <span
                  class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                  >Order Number</span
                >
              </div>
            </template>
          </HTextfield>

          <!-- ----------------------------------------Alternative Order Number--------------------- -->

          <HTextfield
            v-if="offerTakeout"
            placeholder="+251900000000"
            rules="phoneNumber"
            name="alternativeOrderNumber"
            v-model="alternativeOrderNumber"
            type="text"
          >
            <template #label>
              <div class="lg:my-2">
                <span
                  class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
                  >Alternative Order Number</span
                >
              </div>
            </template>
          </HTextfield>
        </div>
      </div>
    </form>

    <!-- --------------------------------------navigation-------------------------------- -->
    <div class="flex items-center justify-between my-2">
      <button
        disabled
        class="primary-button border flex items-center gap-4 opacity-50"
      >
        <Icon name="uil:arrow-left" class="w-6 h-6" />
        Previous
      </button>

      <button
        type="submit"
        form="basicInfoForm"
        class="primary-button border flex items-center gap-4 text-white bg-primary-600"
      >
        Save & Proceed
        <Icon name="uil:arrow-right" class="text" />
      </button>
    </div>
  </div>
</template>
