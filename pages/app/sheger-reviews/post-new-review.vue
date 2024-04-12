<script setup>
import addReviewQuery from "@/graphql/mutations/reviews/add.gql";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const { handleSubmit } = useForm();

const images = ref([]);
const selectedThumbnail = ref();
const selectedPlaceLocation = ref();
const placeType = ref("");
const selectedPlaceID = ref();
const selectedDrinkId = ref();
const selectedDishId = ref();
const title = ref("");
const description = ref(""); //description
const tags = ref();
const youtubeVideoUrl = ref("");
const tiktokVideoUrl = ref("");
const instagramVideoUrl = ref("");
const reviewedBy = ref();
const socialMedias = ref([]);
const socials = ref([]);
const serviceRatings = ref([]);
const averageRating = ref(0);
const serviceComment = ref("");

const {
  mutate: addReview,
  onError: addReviewError,
  onDone: addReviewDone,
  loading: addReviewLoading,
} = authMutation(addReviewQuery);

function isImage(url) {
  if (url.includes("mp4")) {
    return false;
  } else {
    return true;
  }
}

provide("setServiceRatings", ({ serviceCategories, comment }) => {
  serviceRatings.value = serviceCategories;
  serviceComment.value = comment;

  if (serviceRatings.value.length == 0) {
    return;
  }

  let totalValue = 0;
  for (let i = 0; i < serviceRatings.value.length; i++) {
    totalValue += serviceRatings.value[i].value;
  }
  averageRating.value = totalValue / serviceRatings.value.length;

  // Calculate the average
});
const onSubmit = handleSubmit(() => {
  // remove thumbnail from images
  let imagesWithOutThumbnails = images.value.filter(
    (image) => image !== selectedThumbnail.value
  );

  if (images.value.length < 4) {
    notify({
      type: "error",
      title: "Medias required",
      description: "At least 4 medias are required",
      borderClass: "border-l-8 border-red-300 ",
    });

    return;
  }

  const review = ref({
    title: title.value,
    description: description.value,
    youtubeVideoUrl: youtubeVideoUrl.value,
    tiktokUrl: tiktokVideoUrl.value,
    instagramUrl: instagramVideoUrl.value,
    placeId: selectedPlaceID.value,
    placeLocationId: selectedPlaceLocation.value,
    reviewedAt: new Date().toISOString(),
    status: "DRAFT",
    reviewedBy: reviewedBy.value,
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
    featured_image: {
      data: {
        url: selectedThumbnail.value,
      },
    },

    review_medias: {
      data: imagesWithOutThumbnails.map((image) => {
        return {
          isImage: isImage(image),
          media: {
            data: {
              url: image,
            },
          },
        };
      }),
    },

    place_sheger_review: {
      data: {
        comment: serviceComment.value,
        place_sheger_review_by_services: {
          data: serviceRatings.value.map((serviceRating) => {
            return {
              reviewCategoryId: serviceRating.id,
              rate: serviceRating.value,
            };
          }),
        },
      },
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
  layout: "engagement",
});
</script>

<template>
  <div class="px-20 pb-20">
    <!-- --------------------------------Top-------------------------------- -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-medium">Post New Review</h1>
      <div class="font-medium text-white border primary-button bg-primary-600">
        <button
          :disabled="addReviewLoading"
          type="submit"
          form="addReview"
          class="mx-6"
        >
          <span>Post Now</span>
          <Icon
            v-if="addReviewLoading"
            name="eos-icons:bubble-loading"
            class="text-2xl"
          />
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

        <!------------------------------- Place Type--------------------------- -->
        <SelectorsPlaceType v-model="placeType" />

        <!------------------------------- Place--------------------------- -->

        <LazySelectorsPlace :type="placeType" v-model="selectedPlaceID" />
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

        <!----------------------------------------Tag---------------------------------------->

        <LazySelectorsTag type="REVIEW_TAG" v-model="tags" />

        <!-- ------------------------------Drinks----------------------------->
        <LazySelectorsDrinks v-model="selectedDrinkId" />
        <!-- ------------------------------Description-------------------------->

        <HTextarea
          name="description"
          id="description"
          label="Description"
          rules="required"
          v-model="description"
        />

        <!----------------------------------------------Price (ETB)------------------------------------------>
      </div>

      <!-----------------------------------Right---------------------------- -->
      <div class="flex-[50%] space-y-4">
        <!----------------------------------------Reviewer---------------------------------------->
        <SelectorsAdminstrators v-model="reviewedBy" />

        <!-- ------------------------------------Sheger Review Value------------------------ -->
        <ShegerReviewsReviewReview
          :model-value="serviceRatings"
          :average-rating="averageRating"
        >
        </ShegerReviewsReviewReview>

        <!-- ------------------------------------You tube url ------------------------ -->
        <HTextfield
          type="text"
          name="youtube"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          placeholder="https://www.youtube.com"
          rules="required"
          v-model="youtubeVideoUrl"
          label="You tube url"
          leading-icon="logos:youtube-icon"
        >
        </HTextfield>

        <!-- ------------------------------------Instagram url ------------------------ -->

        <HTextfield
          type="text"
          name="instagram"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          placeholder="https://instagram.com"
          rules="required"
          v-model="instagramVideoUrl"
          label="Instagram url"
          leading-icon="skill-icons:instagram"
        >
        </HTextfield>
        <!-- ------------------------------------Instagram url ------------------------ -->

        <HTextfield
          type="text"
          name="tiktok"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          placeholder="https://tiktok.com"
          rules="required"
          v-model="tiktokVideoUrl"
          label="Tiktok url"
          leading-icon="ic:sharp-tiktok"
        >
        </HTextfield>
        <!----------------------------------------images Upload---------------------------------------->
        <p class="mb-2 text-sheger-gray-100">Upload images</p>
        <span class="text-sm font-light leading-3"
          >Click the image to make it thumbnail image</span
        >

        <HFileUploadWrapper
          name="file"
          :maxFileSize="1024 * 1024 * 10"
          :fileLimit="20"
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
