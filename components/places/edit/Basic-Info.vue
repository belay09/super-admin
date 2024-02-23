<script setup>
import placeTypeQuery from "@/graphql/query/basics/getPlaceTypes.gql";
import placeAmbianceQuery from "@/graphql/query/basics/getAmbiances.gql";
import placeTagQuery from "@/graphql/query/basics/getPlaceTags.gql";
import placeCategoryQuery from "@/graphql/query/basics/getPlaceCategories.gql";
import addPlaceMutation from "@/graphql/mutations/place/addPlace.gql";
import { useRegisterPlaceStore } from "~/stores/registerPlace";
import getPlaceQuery from "@/graphql/query/places/item.gql";

const { handleSubmit } = useForm({});

/**-----------------------Globals----------------------------- */
const emit = defineEmits(["next", "prev"]);
const route = useRoute();

/**------------------------Data------------------------ */
const image_url = ref("");
const placeName = ref("");
const placeCousins = ref("");
const description = ref("");
const placeType = ref("");
const placeTag = ref([]);
const initPlaceTags = ref([]);
const placeAmbiance = ref([]);
const initPlaceAmbiances = ref([]);

const placeCategory = ref([]);

const phoneNumber = ref("");
const alternativePhoneNumber = ref("");
const email = ref("");
const website = ref("");
const socialMedia = ref([]);
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
} = authItemQuery(getPlaceQuery, route.params.id);

placeOnResult((result) => {
  if (result.data?.place) {
    place.value = result.data.place;
    let tempPlace = result.data.place;
    placeName.value = tempPlace.name;
    image_url.value = tempPlace.light_logo?.url;
    placeCousins.value = tempPlace.cousins;
    description.value = tempPlace.description;
    placeType.value = capitalizeFirstLetter(tempPlace.type.toLowerCase());

    // init place tags
    initPlaceTags.value = tempPlace.placeTags.map((placeTag) => {
      return {
        title: placeTag.tag.title,
        id: placeTag.tag.id,
      };
    });

    // init place ambiances
    initPlaceAmbiances.value = tempPlace.placeAmbiances.map((placeAmbiance) => {
      return {
        title: placeAmbiance.ambiance.title,
        id: placeAmbiance.ambiance.id,
      };
    });

    placeCategory.value = tempPlace.categoryId;

    // contact
    phoneNumber.value = tempPlace.contactPhoneNumber;
    alternativePhoneNumber.value = tempPlace.contactAltPhoneNumber;
    email.value = tempPlace.contactEmail;
    website.value = tempPlace.contactWebsite;

    // social media

    socialMedia.value = tempPlace.placeSocialMedias.map((media) => {
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

/**-------------------------Control Variables------------------- */
const registerPlaceStore = useRegisterPlaceStore();
/*****************************Queries******************************/

/*---------------------------Place Type Data Fetch---------------------------*/
const placeTypeItems = ref([]);
const { onResult, onError, loading, refetch, fetchMore } = authListQuery(
  placeTypeQuery,
  {},
  [{}],
  0,
  100
);

onResult((result) => {
  placeTypeItems.value = result.data?.placeTypes;
});

/*---------------------------Place Tags Data Fetch---------------------------**/
const placeTagItems = ref([]);
const placeTagSearch = ref("");
const tagFilter = computed(() => {
  let query = {};
  if (placeTagSearch.value) {
    query.title = {
      _ilike: `%${placeTagSearch.value}%`,
    };
  }
  return query;
});

const {
  onResult: tagResult,
  onError: tagError,
  loading: tagLoading,
  refetch: tagRefetch,
} = authListQuery(placeTagQuery, tagFilter, "", 0, 5);

tagResult((result) => {
  placeTagItems.value = result.data?.basicsTags;
});

/*---------------------------Place Ambiance Data Fetch---------------------------*/
const placeAmbianceItems = ref([]);
const placeAmbianceSearch = ref("");
const ambianceFilter = computed(() => {
  let query = {};
  if (placeAmbianceSearch.value) {
    query.title = {
      _ilike: `%${placeAmbianceSearch.value}%`,
    };
  }
  return query;
});

const {
  onResult: ambianceResult,
  onError: ambianceError,
  loading: ambianceLoading,
  refetch: ambianceRefetch,
} = authListQuery(placeAmbianceQuery, ambianceFilter, "", 0, 5);

ambianceResult((result) => {
  placeAmbianceItems.value = result.data?.ambiances;
});

/*---------------------------Place Category Data Fetch---------------------------**/
const placeCategorySearch = ref("");
const placeCategoryItems = ref([]);
const categoryFilter = computed(() => {
  let query = {};
  if (placeCategorySearch.value) {
    console.log(placeCategorySearch.value, "placeCategorySearch");
    query.title = {
      _ilike: `%${placeCategorySearch.value}%`,
    };
  }
  return query;
});

const {
  onResult: categoryResult,
  onError: categoryError,
  loading: categoryLoading,
  refetch: categoryRefetch,
} = authListQuery(placeCategoryQuery, categoryFilter, "", 0, 5);

categoryResult((result) => {
  placeCategoryItems.value = result.data?.basicsCategories;
});

/*****************************Mutations******************************/
const {
  mutate: addPlace,
  loading: addPlaceLoading,
  onError: addPlaceError,
  onDone: addPlaceDone,
} = authMutation(addPlaceMutation);

addPlaceDone((result) => {
  console.log(result, "result");
  console.log(result.data?.insertPlacesOne?.id, "id");
  registerPlaceStore.setPlaceId(result.data?.insertPlacesOne?.id);
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
      data: placeAmbiance.value.map((id) => ({ ambianceId: id })),
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

  // offer take out
  if (offerTakeout.value) {
    input.orderPhoneNumber1 = orderNumber.value;
    input.orderPhoneNumber2 = alternativeOrderNumber.value;
  }

  console.log(input, "input");

  addPlace({
    obj: input,
  });
});
</script>

<template>
  <div v-if="place && !placeLoading">
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

        <!------------------------------------------------ Type--------------------------------------------->

        <H-SingleSelect
          name="place_type"
          id="place_type"
          label="Type"
          :items="placeTypeItems"
          v-model="placeType"
          rules="required"
        ></H-SingleSelect>

        <!-------------------------------------------------- Tag--------------------------------------->
        <H-Multi-Select-Chips
          multiple
          chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
          :items="placeTagItems"
          v-model="placeTag"
          :init="initPlaceTags"
          value="id"
          showBy="title"
          listClass="h-40"
          returnBy="id"
          name="tag"
          rules="required"
          label="Tag"
          placeholder="Select Tag"
          @search="placeTagSearch = $event"
        >
        </H-Multi-Select-Chips>

        <!-- --------------------------------------------------Ambiance----------------------------------- -->
        <H-Multi-Select-Chips
          multiple
          chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
          :items="placeAmbianceItems"
          v-model="placeAmbiance"
          :init="initPlaceAmbiances"
          value="id"
          showBy="title"
          listClass="h-40"
          returnBy="id"
          name="tag"
          rules="required"
          label="Ambiance"
          placeholder="Select Ambiance"
          @search="placeAmbianceSearch = $event"
        >
        </H-Multi-Select-Chips>

        <!-- --------------------------------------------------Category----------------------------------- -->
        <H-SingleSelectWithSearch
          name="place_category"
          id="place_category"
          label="Category"
          :items="placeCategoryItems"
          v-model="placeCategory"
          showBy="title"
          rules="required"
        ></H-SingleSelectWithSearch>
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
        <LazyH-SocialMedialSelectChips
          v-model="socialMedia"
          name="socialMedia"
        ></LazyH-SocialMedialSelectChips>

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
