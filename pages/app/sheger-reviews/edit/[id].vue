<script setup>
import editReviewQuery from "@/graphql/mutations/reviews/edit.gql";

import getReviewQuery from "@/graphql/query/reviews/item.gql";

// this query insert both review drink and review media
import insertMediaQuery from "@/graphql/mutations/reviews/add-review-drink.gql";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const route = useRoute();
const router = useRouter();

const { handleSubmit } = useForm({});

/**------------------------Form Data----------------------- */

const images = ref([]);
const selectedThumbnail = ref();
const selectedPlaceLocation = ref();
const placeType = ref("");
const selectedPlaceID = ref();
const selectedDrinkId = ref();
const selectedDishIds = ref([]);
const initDishIds = ref([]);
const title = ref("");
const description = ref("");
const tags = ref();
const initReviewTags = ref([]);
const youtubeVideoUrl = ref("");
const tiktokVideoUrl = ref("");
const instagramVideoUrl = ref("");
const reviewedBy = ref();
const serviceRatings = ref([]);
const averageRating = ref(0);
const serviceComment = ref("");
const mediaType = ref("");

/*...................Review detail data fetch.............*/
function capitalize(word) {
  let lowerCase = word.toLowerCase();
  return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
}

const review = ref([]);
const {
  onResult: reviewOnResult,
  onError: reviewOnError,
  loading: reviewLoading,
} = authItemQuery(getReviewQuery, route.params.id);

reviewOnResult(({ data }) => {
  if (data.reviewsByPk) {
    review.value = data.reviewsByPk;
    title.value = data.reviewsByPk.title;

    description.value = data.reviewsByPk.description;
    placeType.value = capitalize(data.reviewsByPk.place.type);
    selectedPlaceID.value = data.reviewsByPk.place.id;
    selectedPlaceLocation.value = data.reviewsByPk.placeLocationId;
    selectedDrinkId.value = data.reviewsByPk.review_drink?.drink.id;
    youtubeVideoUrl.value = data.reviewsByPk.youtubeVideoUrl;
    tiktokVideoUrl.value = data.reviewsByPk.tiktokUrl;
    instagramVideoUrl.value = data.reviewsByPk.instagramUrl;
    reviewedBy.value = data.reviewsByPk.reviewedBy;
    initDishIds.value = data.reviewsByPk.menu_reviews.map((item) => {
      return item.menu;
    });
    selectedDishIds.value = data.reviewsByPk.menu_reviews.map((item) => {
      return item.menu.id;
    });
    selectedThumbnail.value = data.reviewsByPk.featured_image?.url;
    images.value = data.reviewsByPk.review_medias.map((item) => {
      return item.media.url;
    });

    if (data.reviewsByPk.featured_image.url) {
      images.value.unshift(data.reviewsByPk.featured_image.url);
    }

    initReviewTags.value = data.reviewsByPk.review_tags.map((item) => {
      return {
        name: item.tag.title,
        id: item.tag.id,
      };
    });
    tags.value = data.reviewsByPk.review_tags.map(
      (reviewTag) => reviewTag.tag.id
    );
  }
});

reviewOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

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

/**------------------------Insert and drink Media----------------------- */
const {
  mutate: insertMedia,
  onError: insertMediaError,
  onDone: insertMediaDone,
  loading: insertMediaLoading,
} = authMutation(insertMediaQuery);

/**------------------------Edit Review----------------------- */
const {
  mutate: editReview,
  onError: editReviewError,
  onDone: editReviewDone,
  loading: editReviewLoading,
} = authMutation(editReviewQuery);

const onSubmit = handleSubmit(() => {
  // check images length
  if (images.value?.length < 4) {
    notify({
      type: "error",
      title: "Medias required",
      description: "At least 4 medias are required",
      borderClass: "border-l-8 border-red-300",
    });
    return;
  }
  // open preview modal
  openFinishModal.value = true;
});

const confirmUpdateReview = () => {
  insertMedia({
    input: {
      url: selectedThumbnail.value,
    },
    drink: {
      drinkId: selectedDrinkId.value,
    },
  });
};

/**------------------------Call review input mutate ----------------------- */

function isImage(url) {
  if (url.includes("mp4")) {
    return false;
  } else {
    return true;
  }
}
insertMediaDone(({ data }) => {
  const reviewInput = ref({
    title: title.value,
    description: description.value,
    reviewedBy: reviewedBy.value,
    youtubeVideoUrl: youtubeVideoUrl.value,
    tiktokUrl: tiktokVideoUrl.value,
    instagramUrl: instagramVideoUrl.value,
    placeId: selectedPlaceID.value,
    placeLocationId: selectedPlaceLocation.value,
    reviewedAt: new Date().toISOString(),
    drinkId: data.insertReviewDrinksOne.id,
    featuredImageId: data.insertBasicsMediaOne.id,
  });

  const reviewMenu = selectedDishIds.value.map((dish) => {
    return {
      menuId: dish,
      reviewId: route.params.id,
    };
  });

  const reviewTag = tags.value.map((tag) => {
    return {
      tagId: tag,
      reviewId: route.params.id,
    };
  });

  // remove thumbnail from images
  let imageWithOutThumbnails = images.value.filter(
    (image) => image !== selectedThumbnail.value
  );

  const reviewMedia = imageWithOutThumbnails.map((image) => {
    return {
      isImage: isImage(image),
      media: {
        data: {
          url: image,
          isPortrait: mediaType.value === "portrait",
        },
      },
      reviewId: route.params.id,
    };
  });

  // review service rating

  // const reviewServiceRatingInput = {
  //   comment: serviceComment.value,
  //   reviewId: review.value?.id,
  //   place_sheger_review_by_services: {
  //     data: serviceRatings.value.map((serviceRating) => {
  //       return {
  //         reviewCategoryId: serviceRating.id,
  //         rate: serviceRating.value,
  //       };
  //     }),
  //   },
  // };

  editReview({
    id: route.params.id,
    input: reviewInput.value,
    reviewMediaInput: reviewMedia,
    reviewMenuInput: reviewMenu,
    reviewTagInput: reviewTag,
    // reviewServiceRatingInput: reviewServiceRatingInput,
  });
});

insertMediaError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**------------------------Edit Review Done----------------------- */
editReviewDone(() => {
  notify({
    title: "Review Updated",
    type: "success",
    description: "Review Updated Successfully",
    borderClass: "border-l-8 border-green-300",
  });

  openFinishModal.value = false;

  router.push("/app/sheger-reviews");
});

editReviewError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const openFinishModal = ref(false);

definePageMeta({
  layout: "engagement",
});
</script>

<template>
  <ModalsEditReviewPreview
    v-if="openFinishModal"
    :id="route.params.id"
    v-model="openFinishModal"
    @confirm="confirmUpdateReview"
  />

  <div class="px-20 pb-20" v-if="!reviewLoading">
    <!-- --------------------------------Top-------------------------------- -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-medium">Update Review</h1>
      <div class="font-medium text-white border primary-button bg-primary-600">
        <button
          :disabled="editReviewLoading"
          form="addReview"
          type="submit"
          class="mx-6"
        >
          <span>Preview</span>
          <Icon
            v-if="editReviewLoading"
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
        <LazySelectorsPlace v-model="selectedPlaceID" :type="placeType" />

        <!-- ------------------------------Place Location----------------------------->
        <!-- <SelectorsPlaceLocation
          :place_Id="selectedPlaceID"
          v-model="selectedPlaceLocation"
        /> -->
        <!-- ------------------------------Dish Title----------------------------->
        <SelectorsDish
          v-model="selectedDishIds"
          :place_Id="selectedPlaceID"
          :init="initDishIds"
        />
        <!----------------------------------------Tag---------------------------------------->

        <SelectorsTag type="REVIEW_TAG" v-model="tags" :init="initReviewTags" />

        <!-- ------------------------------Drinks----------------------------->
        <SelectorsDrinks v-model="selectedDrinkId" />
        <!-- ------------------------------Description-------------------------->

        <HTextarea
          name="description"
          id="description"
          label="Description"
          v-model="description"
        />

        <!----------------------------------------------Price (ETB)------------------------------------------>
      </div>

      <!-----------------------------------Right---------------------------- -->
      <div class="flex-[50%] space-y-4">
        <!----------------------------------------Reviewer---------------------------------------->
        <SelectorsAdminstrators v-model="reviewedBy" />

        <!-- ------------------------------------Sheger Review Value------------------------ -->

        <!-- <ShegerReviewsReviewReview
          :model-value="serviceRatings"
          :average-rating="averageRating"
        >
        </ShegerReviewsReviewReview> -->

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
        <!--------------------------------Sides-------------------------- -->

        <!----------------------------------------images Upload---------------------------------------->
        <p class="mb-2 text-sheger-gray-100">Upload images</p>
        <span class="text-sm font-light leading-3"
          >Click the image to make it thumbnail image</span
        >

        <HFileUploadWrapperNew
          name="file"
          :maxFileSize="1024 * 1024 * 20"
          :fileLimit="10"
          folder="applications_form"
          description="upload file"
          placeholder="select multiple files"
          v-model="images"
          :init="images"
          :disabled="false"
          :showStar="false"
          v-model:thumbnails="selectedThumbnail"
          v-model:selectedMediaType="mediaType"
          rules="required"
        />
      </div>
    </form>
  </div>
</template>
