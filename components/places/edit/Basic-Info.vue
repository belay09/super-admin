<script setup>
import addPlaceMutation from "@/graphql/mutations/place/addPlace.gql";
import getPlaceQuery from "@/graphql/query/places/item.gql";
import editPlaceMutation from "@/graphql/mutations/place/editPlace.gql";
import addMediaMutation from "@/graphql/mutations/medias/add-media.gql";
import useNotify from "@/use/notify";

const { handleSubmit } = useForm({});

/**-----------------------Globals----------------------------- */
const emit = defineEmits(["next", "prev"]);
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});
const { notify } = useNotify();

/**------------------------Data------------------------ */
const placeLog = ref("");
const placeName = ref("");
const initPlaceCousins = ref([]);
const placeCousins = ref([]);
const description = ref("");
const placeType = ref("");
const placeTags = ref([]);
const initPlaceTags = ref([]);
const placeAmbiances = ref([]);
const initPlaceAmbiances = ref([]);
const placeCategory = ref([]);
const phoneNumber = ref("");
const alternativePhoneNumber = ref("");
const email = ref("");
const website = ref("");
const socialMedias = ref([]);
const initSocialMedias = ref([]);
const offerTakeout = ref(false);
const orderNumber = ref("");
const alternativeOrderNumber = ref("");
/*...................Place detail data fetch.............*/

function capitalizeFirstLetter(inputString) {
  // Check if the input is not an empty string
  if (inputString && typeof inputString === "string") {
    // Capitalize the first letter and concatenate the rest of the string
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  } else {
    // Return the input unchanged if it's not a non-empty string
    return inputString;
  }
}

const place = ref(null);
const {
  onResult: placeOnResult,
  onError: placeOnError,
  loading: placeLoading,
} = authItemQuery(getPlaceQuery, props.placeId);

placeOnResult((result) => {
  if (result.data?.place) {
    place.value = result.data.place;
    let tempPlace = result.data.place;
    placeName.value = tempPlace.name;
    placeLog.value = tempPlace.light_logo?.url;
    placeCousins.value = tempPlace.cousins;
    description.value = tempPlace.description;
    placeType.value = capitalizeFirstLetter(tempPlace.type.toLowerCase());
    // init place tags
    initPlaceTags.value = tempPlace.placeTags.map((placeTag) => {
      return {
        name: placeTag.tag.title,
        id: placeTag.tag.id,
      };
    });

    // init place cousins
    initPlaceCousins.value = tempPlace.place_cousins.map((placeCousin) => {
      return {
        name: placeCousin.cousin.title,
        id: placeCousin.cousin.id,
      };
    });

    placeTags.value = tempPlace.placeTags.map((placeTag) => placeTag.tag.id);
    placeCousins.value = tempPlace.place_cousins.map(
      (placeCousin) => placeCousin.cousinId
    );

    // init place ambiances
    initPlaceAmbiances.value = tempPlace.placeAmbiances.map((placeAmbiance) => {
      return {
        name: placeAmbiance.ambiance.title,
        id: placeAmbiance.ambiance.id,
      };
    });

    placeAmbiances.value = tempPlace.placeAmbiances.map(
      (placeAmbiance) => placeAmbiance.ambiance.id
    );

    placeCategory.value = tempPlace.categoryId;

    // contact
    phoneNumber.value = tempPlace.contactPhoneNumber;
    alternativePhoneNumber.value = tempPlace.contactAltPhoneNumber;
    email.value = tempPlace.contactEmail;
    website.value = tempPlace.contactWebsite;

    // social media

    socialMedias.value = tempPlace.placeSocialMedias.map((media) => {
      return {
        ...media.socialMedia,
        url: media.url,
      };
    });

    offerTakeout.value = tempPlace.offerTakeouts;
    orderNumber.value = tempPlace.orderPhoneNumber1;
    alternativeOrderNumber.value = tempPlace.orderPhoneNumber2;
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

/*--------------------------------Edit Place ------------------------- */

// mutation
const {
  mutate: editMutate,
  loading: editLoading,
  onError: editError,
  onDone: editDone,
} = authMutation(editPlaceMutation);

editDone(() => {
  emit("next");
});

editError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**----------------------------Add Featured Media--------------------- */
const {
  mutate: addMediaMutate,
  onDone: addMediaOnDone,
  onError: addMediaOnError,
  loading: addMediaLoading,
} = authMutation(addMediaMutation);

addMediaOnDone((result) => {
  editMutate({
    id: props.placeId,
    placeObject: {
      name: placeName.value,
      cousins: "",
      description: description.value,
      type: placeType.value.toUpperCase(),
      categoryId: placeCategory.value,
      contactPhoneNumber: phoneNumber.value,
      contactAltPhoneNumber: alternativePhoneNumber.value,
      contactEmail: email.value,
      contactWebsite: website.value,
      offerTakeouts: offerTakeout.value,
      featuredReviewMedia: 3,
      featuredMedia: result.data?.insertBasicsMediaOne?.id,
      orderPhoneNumber1: orderNumber.value,
      orderPhoneNumber2: alternativeOrderNumber.value,
    },

    // place tags
    placeTagObject: placeTags.value.map((tag) => {
      return {
        placeId: props.placeId,
        tagId: tag,
      };
    }),

    // place tags
    placeCousinObject: placeCousins.value.map((cousin) => {
      return {
        placeId: props.placeId,
        cousinId: cousin,
      };
    }),

    // place ambiances
    placeAmbianceObject: placeAmbiances.value.map((ambiance) => {
      return {
        placeId: props.placeId,
        ambianceId: ambiance,
      };
    }),

    // place social medias
    placeSocialMediaObject: socialMedias.value.map((social) => {
      return {
        placeId: props.placeId,
        socialMediaId: social.id,
        url: social.url,
      };
    }),
  });
});
// handler
const handleEditPlace = handleSubmit(() => {
  addMediaMutate({
    input: {
      url: placeLog.value,
    },
  });
});
</script>

<template>
  <div v-if="place && !placeLoading">
    <form
      @submit.prevent="handleEditPlace"
      class="flex"
      method="POST"
      id="basicInfoForm"
    >
      <!-- ----------------------------------------------Left-------------------------------- -->
      <div class="flex-[50%] px-20 flex flex-col gap-6 border-r p-5">
        <!-------------------------------------- image upload------------------------------------------------- -->

        <CommonUploadSingleImage
          folder=""
          v-model:model-value="placeLog"
          rules="required"
          name="placeLogo"
        ></CommonUploadSingleImage>

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
        <SelectorsCousinChips
          :init="initPlaceCousins"
          v-model="placeCousins"
          name="placeCousin"
        />

        <!-- ------------------------------Description-------------------------->

        <HTextarea
          name="description"
          id="description"
          label="Description"
          rules="required"
          v-model="description"
        />

        <!------------------------------------------------ Type--------------------------------------------->
        <SelectorsPlaceType v-model="placeType" />

        <!-------------------------------------------------- Tag--------------------------------------->

        <SelectorsTag
          type="PLACE_TAG"
          v-model="placeTags"
          :init="initPlaceTags"
        />
        <!-- --------------------------------------------------Ambiance----------------------------------- -->
        <SelectorsAmbiance
          v-model="placeAmbiances"
          :init="initPlaceAmbiances"
          name="placeAmbiance"
        />

        <!-- --------------------------------------------------Category----------------------------------- -->

        <SelectorsCategory
          type="PLACE_CATEGORY"
          v-model="placeCategory"
        ></SelectorsCategory>
      </div>

      <!-- Right -->
      <div class="flex-[50%] px-20 flex flex-col gap-6 p-5">
        <div class="text-xl font-medium">Contact</div>

        <!------------------------------------Phone Number--------------------------------------->

        <HTextfield
          placeholder="900000000"
          rules="ethio_phone"
          name="phoneNumber"
          v-model="phoneNumber"
          type="text"
          leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
          leading-text="+251"
          label="Phone Number"
        >
        </HTextfield>

        <!---------------------------------Alternative Phone Number------------------------------------>
        <HTextfield
          placeholder="900000000"
          rules="ethio_phone"
          name="alternativePhoneNumber"
          v-model="alternativePhoneNumber"
          type="text"
          leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
          leading-text="+251"
          label="Alternative Phone Number"
        >
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
        <H-SocialMedialSelectChips
          v-model="socialMedias"
          name="socialMedia"
        ></H-SocialMedialSelectChips>

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
            placeholder="900000000"
            rules="ethio_phone"
            name="orderNumber"
            v-model="orderNumber"
            type="text"
            label="Order Number"
            leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
            leading-text="+251"
          >
          </HTextfield>

          <!-- ----------------------------------------Alternative Order Number--------------------- -->

          <HTextfield
            v-if="offerTakeout"
            placeholder="900000000"
            rules="ethio_phone"
            name="alternativeOrderNumber"
            v-model="alternativeOrderNumber"
            type="text"
            leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
            leading-text="+251"
            label="Alternative Order Number"
          >
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
        <!-- loading icon -->
        <Icon
          v-if="editLoading"
          name="eos-icons:bubble-loading"
          class="text-3xl"
        />
        Save & Proceed
        <Icon name="uil:arrow-right" class="text" />
      </button>
    </div>
  </div>
</template>
