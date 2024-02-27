<script setup>
import insertPlacePortfolioMutation from "~/graphql/mutations/place/insertPortfolios.gql";
import deletePlacePortfolioMutation from "~/graphql/mutations/place/deletePlacePortfolio.gql";
import editPlacePortfolioMutation from "~/graphql/mutations/place/editPlacePortfolio.gql";

import getPlacePortfoliosQuery from "~/graphql/query/places/getPlacePortfolios.gql";
import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**-----------------------Globals----------------------------- */
const { notify } = useNotify();
const placeAmenityForm = ref(null);
const emit = defineEmits(["next", "prev"]);
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});

/**-----------------------Navigation----------------------------- */
const next = () => {
  emit("next");
};
const prev = () => {
  emit("prev");
};

/**---------------------Portfolios Data Fetch---------------------- */

const portfolios = ref([]);
const portfoliosSort = ref([{ createdAt: "DESC_NULLS_LAST" }]);

const portfolioFilters = computed(() => {
  let query = {
    placeId: {
      _eq: props.placeId,
    },
  };
  return query;
});

const {
  onResult: onResultPortfolios,
  onError: onErrorPortfolios,
  loading: loadingPortfolios,
  refetch: refetchPortfolios,
  fetchMore: fetchMorePortfolios,
} = authListQuery(
  getPlacePortfoliosQuery,
  portfolioFilters,
  portfoliosSort,
  0,
  10
);

onResultPortfolios((result) => {
  if (result.data) {
    portfolios.value = result.data.portfolios;
  }
});

onErrorPortfolios((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**************************Add and Edit Data ******************************/

const date = ref();
const title = ref("");
const image_urls = ref([]);
const portfolioDescription = ref("");

/**--------------------------------Toggle between edit and add place amenity---------------- */
const isAddPortfolio = ref(true);
function changeToAddPortfolio() {
  isAddPortfolio.value = true;
  image_urls.value = [];
  portfolioDescription.value = "";
  selectedPortfolio.value = null;
}
// portfolio selected for edit
const selectedPortfolio = ref(null);

/**---------------------Insert Place Portfolio ---------------------- */
// mutation
const {
  mutate: insertPlacePortfolioMutate,
  loading: insertPlacePortfolioLoading,
  onError: insertPlacePortfolioError,
  onDone: insertPlacePortfolioDone,
} = authMutation(insertPlacePortfolioMutation);

insertPlacePortfolioDone(() => {
  refetchPortfolios();
  notify({
    title: "Portfolio Added",
    description: "Portfolio Added Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  isAddPortfolio.value = true;
  title.value = "";
  date.value = "";
  portfolioDescription.value = "";
  image_urls.value = [];
});

insertPlacePortfolioError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

// handler
const handleAddPortfolio = () => {
  insertPlacePortfolioMutate({
    obj: {
      placeId: props.placeId,
      title: title.value,
      date: date.value,
      description: portfolioDescription.value,
      portfolioMedias: {
        data: image_urls.value.map((url) => {
          return {
            media: {
              data: {
                url,
              },
            },
          };
        }),
      },
    },
  });
};

/************************** edit portfolio ******************************/
// Set initial value for edit portfolio
const editPortfolio = (portfolio) => {
  selectedPortfolio.value = portfolio;
  isAddPortfolio.value = false;
  title.value = portfolio.title;
  date.value = portfolio.date;
  portfolioDescription.value = portfolio.description;
  image_urls.value = portfolio.portfolioMedias.map((item) => item.media.url);
};

// mutation
const {
  mutate: editPortfolioMutate,
  onDone: editPortfolioDone,
  onError: editPortfolioError,
  loading: editPortfolioLoading,
} = authMutation(editPlacePortfolioMutation);

editPortfolioDone((result) => {
  refetchPortfolios();
  notify({
    title: "Portfolio Updated",
    description: "Portfolio Updated Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});
editPortfolioError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
// handler
const handleEditPortfolio = () => {
  editPortfolioMutate({
    id: selectedPortfolio.value?.id,

    portfolioObject: {
      title: title.value,
      date: date.value,
      description: portfolioDescription.value,
    },
    portfolioResourceObject: image_urls.value.map((url) => {
      return {
        portfolioId: selectedPortfolio.value?.id,
        media: {
          data: {
            url,
          },
        },
      };
    }),
  });
};

/**---------------------Delete Place Portfolio ---------------------- */
const {
  mutate: deletePlacePortfolioMutate,
  loading: loadingDeletePlacePortfolio,
  onError: errorDeletePlacePortfolio,
  onDone: doneDeletePlacePortfolio,
} = authMutation(deletePlacePortfolioMutation);

doneDeletePlacePortfolio(() => {
  showDeletePortfolioModal.value = false;

  notify({
    title: "Portfolio Deleted",
    description: "Portfolio Deleted Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  refetchPortfolios();
});

errorDeletePlacePortfolio((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**---------------------------Handle delete portfolio---------------- --------------- */
const portfolioToDelete = ref(null);
const setPortfolioToDelete = (id) => {
  showDeletePortfolioModal.value = true;
  portfolioToDelete.value = id;
};
const handleDeletePortfolio = () => {
  deletePlacePortfolioMutate({
    id: portfolioToDelete.value,
  });
};

/**----------------------------Call edit or add portfolio handler------------------------------ */
const callEditOrAddPortfolio = handleSubmit(() => {
  if (isAddPortfolio.value) {
    handleAddPortfolio();
  } else {
    handleEditPortfolio();
  }
});

/************************** Control Variables ******************************/
const showProfilePictureModal = ref(false);
const showDeletePortfolioModal = ref(false);
const handelDeleteImage = (index) => {
  image_urls.value.splice(index, 1);
};
</script>

<template>
  <!-- -----------------------Delete Place Amenity Badge Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleDeletePortfolio"
    v-model="showDeletePortfolioModal"
    title="Delete Place Amenity"
    sure-question="Are you sure you want to delete the amenity ?"
    description="This action is irreversible and will permanently delete the amenity and its associated resources."
  ></ModalsConfirmation>

  <div>
    <div class="flex px-20 py-10">
      <!-----------------------------------Left-------------------------------------------------- -->
      <div class="flex-[50%] px-10 border-r mx-2">
        <form
          @submit.prevent="callEditOrAddPortfolio"
          action=""
          class="flex flex-col gap-4"
        >
          <!-- ----------------------------------------- Title ---------------------------------------->
          <HTextfield
            type="text"
            name="Title"
            class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
            rules="required"
            v-model="title"
          >
            <template #label>
              <p class="text-sheger-gray-100">Title</p>
            </template>
          </HTextfield>

          <!----------------------------------------------Date------------------------------------------>
          <HDatePicker
            :mainDiv="'my-5'"
            v-model="date"
            name="date"
            label="Date"
            labelClass="text-gray-600 pb-3"
            class="border-gray-300 focus:border-primary-600 dark:bg-transparent outline-none"
            rules="required"
          />

          <!--------------------------------------------Description ---------------------------------------- -->
          <H-Textarea
            name="place_portfolio_description"
            id="place_portfolio_description"
            label="Description"
            placeholder="Description"
            v-model="portfolioDescription"
            rules="required"
          ></H-Textarea>

          <!----------------------------------------images Upload---------------------------------------->
          <p class="mb-2 text-sheger-gray-100">Upload images</p>

          <HFileUploadWrapper
            name="file"
            :maxFileSize="1024 * 1024 * 10"
            :fileLimit="3"
            folder="applications_form"
            description="upload file"
            placeholder="select multiple files"
            v-model="image_urls"
            :init="image_urls"
            v-model:thumbnails="selectedThumbnail"
            :disabled="false"
            :showStar="false"
            rules="required"
          />

          <!------------------------------- Add btn --------------------------->

          <button type="submit" class="primary-button border">
            <span class="">Submit</span>

            <Icon
              v-if="insertPlacePortfolioLoading || editPortfolioLoading"
              name="eos-icons:bubble-loading"
              class="text-3xl text-red-600"
            />
          </button>
          <button
            type="button"
            v-if="!isAddPortfolio"
            class="primary-button bg-primary-600 text-white border"
            @click="changeToAddPortfolio"
          >
            <Icon name="uil:plus" class="w-6 h-6" />
            <span class="">Add New</span>
          </button>
        </form>
      </div>

      <!------------------------------------Right----------------------------------------->

      <div class="flex-[50%]">
        <!-- -------------------Loading Place Amenities---------------- -->
        <div v-if="loadingPortfolios" class="flex flex-col gap-6">
          <div
            v-for="i in 1"
            class="rounded-lg border skeleton-container py-5 flex flex-col gap-y-6 pr-10"
          >
            <!-- Skeleton loader for the title -->
            <div class="skeleton w-full h-6 rounded-t-lg"></div>

            <!-- Description skeleton -->
            <div class="skeleton w-full h-20"></div>

            <!-- -------------------date-------------- -->

            <div class="skeleton w-32 h-6 rounded-t-lg"></div>

            <!-- ---------------------Images----------------- -->

            <div class="flex items-center gap-5">
              <div v-for="i in 3" class="skeleton w-44 h-44"></div>
            </div>

            <!-- Skeleton loader for the card footer -->
            <div class="flex items-center px-10 py-4 gap-x-4 border-t">
              <!-- Edit button skeleton -->
              <div class="skeleton w-2/3 h-10"></div>
              <!-- Delete button skeleton -->
              <div class="skeleton w-2/3 h-10"></div>
            </div>
          </div>
        </div>
        <!-------------------------------------- Preview------------------------------------------------- -->
        <div v-else>
          <UiCardsPortfolioItemCard
            v-for="(portfolio, index) in portfolios"
            class="w-full"
            :key="index"
            :portfolio="portfolio"
            @editPortfolio="editPortfolio"
            @deletePortfolio="setPortfolioToDelete"
          ></UiCardsPortfolioItemCard>
        </div>

        <div
          v-if="portfolios.length == 0 && !loadingPortfolios"
          class="flex flex-col items-center justify-center h-full"
        >
          <p class="text-lg text-sheger-gray-400">No Portfolio Added</p>
        </div>
      </div>
    </div>

    <!-- --------------------------------------navigation-------------------------------- -->
    <div class="flex items-center justify-between my-2">
      <button
        class="primary-button border flex items-center gap-4"
        @click="prev()"
      >
        <Icon name="uil:arrow-left" class="w-6 h-6" />
        Previous
      </button>

      <button
        class="primary-button border flex items-center gap-4 text-white bg-primary-600"
        @click="next()"
      >
        Save & Proceed
        <Icon name="uil:arrow-right" class="text" />
      </button>
    </div>
  </div>
</template>
