<script setup>
import placeTypeQuery from "@/graphql/query/basics/getPlaceTypes.gql";
import placeAmbianceQuery from "@/graphql/query/basics/getAmbiances.gql";
import placeTagQuery from "@/graphql/query/basics/getPlaceTags.gql";
import placeCategoryQuery from "@/graphql/query/basics/getPlaceCategories.gql";
import addPlaceMutation from "@/graphql/mutations/place/addPlace.gql";
import { useRegisterPlaceStore } from "~/stores/registerPlace";

/**-----------------------Emits----------------------------- */

/**------------------------Datas------------------------ */
const placeTypeItems = ref([]);
const placeAmbianceItems = ref([]);
const placeTagItems = ref([]);
const placeCategoryItems = ref([]);
const image_url = ref("");
const placeName = ref("");
const description = ref("");
const placeType = ref("");
const placeTag = ref([]);
const placeCategory = ref([]);
const placeAmbiance = ref([]);
const phoneNumber = ref("");
const alternativephoneNumber = ref("");
const email = ref("");
const website = ref("");
const placeCousins = ref("");
const placeAmbiancesearch = ref("");
const placeTagSearch = ref("");
const placeCategorySearch = ref("");
const socialMedia = ref([]);
const offerTakeout = ref(false);
const OrderNumber = ref("");
const AlternativeOrderNumber = ref("");
const socials = ref([]);
const recentlyOpened = ref(false);

watch(placeTag, (newVal) => {
  console.log(newVal, "placeType");
});

/**-------------------------Control Variables------------------- */
const showProfilePictureModal = ref(false);
const registerPlaceStore = useRegisterPlaceStore();
/*****************************Queries******************************/

/*---------------------------Place Type---------------------------*/
const { onResult, onError, loading, refetch, fetchMore } = authListQuery(
  placeTypeQuery,
  "",
  {},
  0,
  100
);

onResult((result) => {
  placeTypeItems.value = result.data?.placeTypes;
});

/*---------------------------Place Ambiance---------------------------*/

const ambianceFilter = computed(() => {
  let query = {};
  if (placeAmbiancesearch.value) {
    query.title = {
      _ilike: `%${placeAmbiancesearch.value}%`,
    };
  }
  return query;
});

const {
  onResult: onResultAmbiance,
  onError: onErrorAmbiance,
  loading: loadingAmbiance,
  refetch: refetchAmbiance,
  fetchMore: fetchMoreAmbiance,
} = authListQuery(placeAmbianceQuery, ambianceFilter, "", 0, 5);

onResultAmbiance((result) => {
  placeAmbianceItems.value = result.data?.ambiances;
});

/*---------------------------Place Tags---------------------------**/

const tagFilter = computed(() => {
  let query = {};
  if (placeTagSearch.value) {
    console.log(placeTagSearch.value, "placeTagSearch");
    query.title = {
      _ilike: `%${placeTagSearch.value}%`,
    };
  }
  return query;
});

const {
  onResult: onResultTag,
  onError: onErrorTag,
  loading: loadingTag,
  refetch: refetchTag,
  fetchMore: fetchMoreTag,
} = authListQuery(placeTagQuery, tagFilter, "", 0, 5);

onResultTag((result) => {
  placeTagItems.value = result.data?.basicsTags;
});

/*---------------------------Place Category---------------------------**/
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
  onResult: onResultCategory,
  onError: onErrorCategory,
  loading: loadingCategory,
  refetch: refetchCategory,
  fetchMore: fetchMoreCategory,
} = authListQuery(placeCategoryQuery, categoryFilter, "", 0, 5);

onResultCategory((result) => {
  console.log(result, "result");
  placeCategoryItems.value = result.data?.basicsCategories;
});

/*****************************Mutations******************************/

const handleSubmit = () => {
  const obj = {
    dark_logo: {
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
    contactAltPhoneNumber: alternativephoneNumber.value,
    contactEmail: email.value,
    contactWebsite: website.value,
    offerTakeouts: offerTakeout.value,
    orderPhoneNumber1: OrderNumber.value,
    orderPhoneNumber2: AlternativeOrderNumber.value,
    featuredReviewMedia: 3,
    placeSocialMedias: {
      data: socialMedia.value.map((social) => ({
        socialMediaId: social.id,
        url: social.url,
      })),
    },
  };

  const {
    mutate: addPlace,
    loading: addPlaceLoading,
    error: addPlaceError,
    onDone: addPlaceDone,
  } = authMutation(addPlaceMutation);

  addPlace({
    obj,
  });

  addPlaceDone((result) => {
    console.log(result, "result");
    console.log(result.data?.insertPlacesOne?.id, "id");
    registerPlaceStore.setPlaceId(result.data?.insertPlacesOne?.id);
  });

  addPlaceError((err) => {
    console.log(err, "err");
  });
  console.log(obj, "Final");
};
</script>

<template>
  <div>
    <ModalsModal :auto-close="false" v-model="showProfilePictureModal">
      <template #content>
        <UiImageUploader
          title="Upload Place Picture"
          description="Upload a picture of the place"
          v-model="image_url"
          @close="showProfilePictureModal = false"
        ></UiImageUploader>
      </template>
    </ModalsModal>

    <form class="flex" method="POST">
      <!-- ----------------------------------------------Left-------------------------------- -->

      <div class="flex-[50%] px-20 flex flex-col gap-6 border-r p-5">
        <!-------------------------------------- image upload------------------------------------------------- -->

        <div
          class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg p-8"
        >
          <Icon name="uil:cloud-upload" class="w-20 h-20" />
          <div class="input_field flex flex-col w-max mx-auto text-center">
            <div>
              Drag and drop here or
              <span
                class="text-primary-600 cursor-pointer"
                @click="showProfilePictureModal = true"
                >Browse</span
              >
            </div>

            <div class="">Select images that are Square and 10MB</div>
          </div>
          <div>
            <img
              v-if="image_url"
              :src="image_url"
              class="w-40 h-40 object-cover rounded-lg"
              alt=""
            />
          </div>
        </div>

        <!--------------------------------------------------- Place Name------------------------------- -->

        <HTextfield
          type="text"
          name="PlaceName"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          v-model="placeName"
        >
          <template #label>
            <p class="text-sheger-gray-100">Place Name</p>
          </template>
        </HTextfield>

        <!------------------------------------------------ Cousins ----------------------------------------->

        <HTextfield
          type="text"
          name=""
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          v-model="placeCousins"
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
          v-model="description"
        />

        <!------------------------------------------------ Type--------------------------------------------->

        <H-SingleSelect
          name="place_type"
          id="place_type"
          label="Type"
          :items="placeTypeItems"
          v-model="placeType"
          showBy="value"
        ></H-SingleSelect>

        <!-------------------------------------------------- Tag--------------------------------------->

        <Lazyh-multi-select-chips
          multiple
          chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
          :items="placeTagItems"
          v-model="placeTag"
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
        </Lazyh-multi-select-chips>

        <!-- --------------------------------------------------Ambiance----------------------------------- -->

        <H-Multi-Select-Chips
          multiple
          chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
          :items="placeAmbianceItems"
          v-model="placeAmbiance"
          value="id"
          showBy="title"
          listClass="h-40"
          returnBy="id"
          name="tag"
          rules="required"
          label="Ambiance"
          placeholder="Select Ambiance"
          @search="placeAmbiancesearch = $event"
        >
        </H-Multi-Select-Chips>

        <!-- --------------------------------------------------Category----------------------------------- -->
        <H-SingleSelect
          name="place_category"
          id="place_category"
          label="Category"
          :items="placeCategoryItems"
          v-model="placeCategory"
          showBy="title"
        ></H-SingleSelect>

        <div
          class="flex justify-between border items-center py-4 border-sheger-gray-200 px-5 rounded-md"
        >
          Feature as Recently Opened?
          <HSwitch
            name="houses_special"
            id="houses_special"
            label="houses_special"
            class="flex items-center"
            v-model="recentlyOpened"
          ></HSwitch>
        </div>
      </div>

      <!-- Right -->
      <div class="flex-[50%] px-20 flex flex-col gap-6 p-5">
        <div class="text-xl font-medium">Contact</div>

        <!------------------------------------Phone Number--------------------------------------->

        <HTextfield
          leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
          leading-text="+251"
          placeholder="9000000000"
          name="Phone Number"
          v-model="phoneNumber"
          rules="ethio_phone"
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
          leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
          leading-text="+251"
          name="Phone Number"
          v-model="alternativephoneNumber"
          rules="ethio_phone"
          type="text"
          placeholder="9000000000"
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
          rules="requiredN"
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

        <div class="text-xl font-medium my-3">Social Media</div>
        <H-Socail-Medial-Select-Chips
          v-model="socialMedia"
          name="socialMedia"
          :socials="socials"
        ></H-Socail-Medial-Select-Chips>

        <!-- ----------------------------------Offer Takeout---------------------------------- -->

        <div class="flex items-start justify-between my-3">
          <div class="text-xl font-medium">Offer Takeout</div>
          <HSwitch name="" v-model="offerTakeout"></HSwitch>
        </div>

        <!-- -------------------------------------OrderNumber---------------------------------- -->

        <HTextfield
          leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
          leading-text="+251"
          name="Phone Number"
          v-model="OrderNumber"
          rules="ethio_phone"
          type="text"
          placeholder="9000000000"
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
          leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
          leading-text="+251"
          name="Phone Number"
          v-model="AlternativeOrderNumber"
          rules="ethio_phone"
          type="text"
          placeholder="9000000000"
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
    </form>
    <div @click="handleSubmit" class="primary-button border w-fit p-4">
      Subimt
    </div>
  </div>
</template>
