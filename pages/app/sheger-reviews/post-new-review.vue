<script setup>
import addReviewQuery from "@/graphql/mutations/reviews/add.gql";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();

const { handleSubmit } = useForm();

const menuTypeItems = ref([
  {
    name: "Food",
    id: "FOODS",
  },
  {
    name: "Drink",
    id: "DRINKS",
  },
]);

const images = ref([]);
const selectedThumbnail = ref();
const selectedPlaceLocation = ref();
const selectedPlaceID = ref();
const selectedDrinkId = ref();
const selectedDishId = ref();
const title = ref("");
const description = ref(""); //description
const tags = ref();
const price = ref();
const type = ref();
const timeToPrepare = ref();
const youtubeVideoUrl = ref("");
const sides = ref("");

const {
  mutate: addReview,
  onError: addReviewError,
  onDone: addReviewDone,
  loading: addReviewLoading,
} = authMutation(addReviewQuery);

const onSubmit = handleSubmit(() => {
  // remove thumbnail from images
  let imagesWithOutThumbnails = images.value.filter(
    (image) => image !== selectedThumbnail.value
  );

  const review = ref({
    title: title.value,
    description: description.value,
    price: price.value,
    type: type.value,
    timeToPrepare: timeToPrepare.value,
    youtubeVideoUrl: youtubeVideoUrl.value,
    sides: sides.value,
    placeId: selectedPlaceID.value,
    placeLocationId: selectedPlaceLocation.value,
    reviewedAt: new Date().toISOString(),
    status: "DRAFT",
    review_drink: {
      data: {
        drinkId: selectedDrinkId.value,
      },
    },
    menu_reviews: {
      data: selectedDishId.value.map((dish) => {
        return {
          menuId: dish,
        };
      }),
    },
    review_tags: {
      data: tags.value.map((tag) => {
        return {
          tagId: tag,
        };
      }),
    },
    featured_media: {
      data: {
        url: selectedThumbnail.value,
      },
    },

    review_medias: {
      data: imagesWithOutThumbnails.map((image) => {
        return {
          media: {
            data: {
              url: image,
            },
          },
        };
      }),
    },
  });
  addReview({ input: review.value });
});

addReviewDone((result) => {
  notify({
    title: "Review created successfully",
    description: "Review created successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  navigateTo("/app/sheger-reviews");
});

addReviewError((error) => {
  notify({
    title: "Review creation failed",
    description: "Review creation failed",
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="px-20 pb-20">
    <!-- --------------------------------Top-------------------------------- -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-medium">Post New Review</h1>
      <div class="font-medium text-white border primary-button bg-primary-600">
        <button form="addReview" type="submit" class="mx-6">
          <span v-if="!addReviewLoading">Post Now</span>
          <Icon v-else name="eos-icons:bubble-loading" class="text-2xl" />
        </button>
      </div>
    </div>

    <!-- --------------------------------Form-------------------------------- -->

    <form id="addReview" @submit.prevent="onSubmit" class="flex gap-7">
      <!-- ------------------------------Left------------------------------- -->
      <div class="flex-[50%] space-y-4">
        <HTextfield
          name=" Title"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
          v-model="title"
        >
          <template #label>
            <p class="mb-2 text-sheger-gray-100">Title</p>
          </template>
        </HTextfield>

        <!------------------------------- Place--------------------------- -->

        <LazyAdSpacePlaceSelector v-model="selectedPlaceID" />
        <!-- ------------------------------Place Location----------------------------->
        <LazySelectorsPlaceLocation
          :place_Id="selectedPlaceID"
          v-model="selectedPlaceLocation"
        />

        <!-- ------------------------------Dish Title----------------------------->
        <LazySelectorsDish
          v-model="selectedDishId"
          :place_Id="selectedPlaceID"
        />

        <!-- ------------------------------Drinks----------------------------->
        <LazySelectorsDrinks v-model="selectedDrinkId" />
        <!-- ------------------------------Description-------------------------->

        <HTextarea
          name="description"
          id="description"
          label="Description"
          v-model="description"
        />

        <!----------------------------------------------Price (ETB)------------------------------------------>

        <HTextfield
          type="number"
          name="Price"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
          v-model="price"
        >
          <template #label>
            <p class="text-sheger-gray-100">Price (ETB)</p>
          </template>
        </HTextfield>
      </div>

      <!-----------------------------------Right---------------------------- -->
      <div class="flex-[50%] space-y-4">
        <!----------------------------------------Menu Type---------------------------------------->

        <H-SingleSelect
          name="menu_type"
          id="menu_type"
          rules="required"
          label="Menu Type"
          :items="menuTypeItems"
          v-model="type"
        ></H-SingleSelect>
        <!----------------------------------------Preparation Time (Minutes)-------------------------->

        <HTextfield
          type="number"
          name="Preparation Time"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
          v-model="timeToPrepare"
        >
          <template #label>
            <p class="mb-2 text-sheger-gray-100">Preparation Time (Minutes)</p>
          </template>
        </HTextfield>

        <!----------------------------------------Ingredient ( Use comma to seprate)---------------------------------------->
        <!--------------//TODO integrate ingredient-------------------->
        <HTextfield
          type="text"
          name="Ingredient"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
        >
          <template #label>
            <p class="mb-2 text-sheger-gray-100">
              Ingredient ( Use comma to seprate)
            </p>
          </template>
        </HTextfield>

        <!----------------------------------------Tag---------------------------------------->

        <LazySelectorsTag type="REVIEW_TAG" v-model="tags" />
        <!--------------------------------Video Url-------------------------- -->

        <HTextfield
          type="text"
          name="Video Url"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          placeholder="https://www.youtube.com/watch?v=Zz5cu72GQfE"
          rules="required"
          v-model="youtubeVideoUrl"
        >
          <template #label>
            <p class="mb-2 text-sheger-gray-100">Video Url</p>
          </template>
        </HTextfield>

        <!--------------------------------Sides-------------------------- -->

        <HTextfield
          type="text"
          name="Side"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
          v-model="sides"
        >
          <template #label>
            <p class="mb-2 text-sheger-gray-100">Sides</p>
          </template>
        </HTextfield>

        <!----------------------------------------images Upload---------------------------------------->
        <p class="mb-2 text-sheger-gray-100">Upload images</p>

        <HFileUploadWrapper
          name="file"
          :maxFileSize="1024 * 1024 * 10"
          :fileLimit="3"
          folder="applications_form"
          description="upload file"
          placeholder="select multiple files"
          v-model="images"
          :init="images"
          :disabled="false"
          :showStar="false"
          v-model:thumbnails="selectedThumbnail"
        />
      </div>
    </form>
  </div>
</template>
