<script setup>
import insertPlacePortfolioMutation from "~/graphql/mutations/place/insertPortfolios.gql";
import getPlacePortfoliosQuery from "~/graphql/query/places/getPlacePortfolios.gql";
import deletePlacePortfolioMutation from "~/graphql/mutations/place/deletePlacePortfolio.gql";
import useNotify from "@/use/notify";
import { useRegisterPlaceStore } from "~/stores/registerPlace";

// const portfolios = ref([
//   {
//     title: "Served Lunch at National Assembly of Doctors",
//     date: "12 Feb, 2023",
//     images: [
//       "/images/temporary/default-food-image.png",
//       "/images/temporary/default-food-image.png",
//       "/images/temporary/default-food-image.png",
//     ],
//   },
// ]);

/************************* Data ****************************/

const portfolios = ref([]);
const date = ref(new Date());
const title = ref("");
const images = ref([]);
const image_url = ref("");
const image_urls = ref([]);
const placeportfolioDescription = ref("");
const { notify } = useNotify();

watch(image_url, (newVal) => {
  image_urls.value.push({
    media: {
      data: {
        url: newVal,
      },
    },
  });
});

/************************* Control Variables ****************************/
const showProfilePictureModal = ref(false);
const registerPlaceStore = useRegisterPlaceStore();

/************************** Query ******************************/

const portfolioFilters = computed(() => {
  let query = {};

  if (registerPlaceStore.placeId) {
    query.placeId = {
      _eq: registerPlaceStore.placeId,
    };
  }

  return query;
});

const {
  onResult: onResultPortfolios,
  onError: onErrorPortfolios,
  loading: loadingPortfolios,
  refetch: refetchPortfolios,
  fetchMore: fetchMorePortfolios,
} = authListQuery(getPlacePortfoliosQuery, portfolioFilters, "", 0, 50);

onResultPortfolios((result) => {
  if (result.data) {
    portfolios.value = result.data.portfolios;
    console.log(portfolios.value, "portfolios");
  }
});

/************************** Mutations ******************************/

/**---------------------Insert Place Portfolio ---------------------- */
const {
  mutate: insertPlacePortfolio,
  loading: loadingInsertPlacePortfolio,
  onError: errorInsertPlacePortfolio,
  onDone: doneInsertPlacePortfolio,
} = authMutation(insertPlacePortfolioMutation);

doneInsertPlacePortfolio(() => {
  notify({
    title: "Portfolio Added",
    description: "Portfolio Added Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  refetchPortfolios();
  title.value = "";
  date.value = new Date();
  image_urls.value = [];
});

errorInsertPlacePortfolio((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**---------------------Delete Place Portfolio ---------------------- */
const {
  mutate: deletePlacePortfolio,
  loading: loadingDeletePlacePortfolio,
  onError: errorDeletePlacePortfolio,
  onDone: doneDeletePlacePortfolio,
} = authMutation(deletePlacePortfolioMutation);

doneDeletePlacePortfolio(() => {
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

/************************** Handler ******************************/
const handelDeleteImage = (index) => {
  image_urls.value.splice(index, 1);
};

const handleAddPlacePortfolio = () => {
  insertPlacePortfolio({
    obj: {
      placeId: registerPlaceStore.placeId,
      title: title.value,
      date: date.value,
      portfolioMedias: {
        data: image_urls.value,
      },
      description: placeportfolioDescription.value,
    },
  });
};

const handleChildEvent = (portfolio) => {
  title.value = portfolio.title;
  date.value = portfolio.date;
  image_urls.value = portfolio.portfolioMedias;
  placeportfolioDescription.value = portfolio.description;
};

const handelDelete = (id) => {
  console.log("object");
  deletePlacePortfolio({
    id: id,
  });
};
</script>

<template>
  <!-- Modal for image upload -->

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
  <div class="flex px-20 py-10">
    <!-----------------------------------Left-------------------------------------------------- -->
    <div class="flex-[50%] px-10 flex flex-col gap-4 border-r mx-2">
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
        v-model="placeportfolioDescription"
        rules="required"
      ></H-Textarea>

      <!-------------------------------------- image upload------------------------------------------------- -->
      <div
        class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg px-8 py-4"
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
      </div>

      <!-------------------------------Uploaded Files------------------------------- -->

      <div
        class="flex flex-col gap-4 border px-6 py-3 rounded-md"
        v-if="image_urls.length > 0"
      >
        <p class="font-medium">Uploaded Files</p>
        <div class="flex flex-col gap-4">
          <div
            v-for="(image, index) in image_urls"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <img :src="image?.media?.data?.url" class="w-[100px]" />
              <div>
                <p class="text-lg font-medium">IMG=99KJ0-.png</p>
                <p class="text-sm font-light text-sheger-gray-100">
                  Feb 2, 2023. image
                </p>
              </div>
            </div>
            <!--progress -->
            <div class="bg-primary-600 h-[3px] w-[200px]" />

            <div @click="handelDeleteImage(index)" class="cursor-pointer">
              <Icon name="uil:trash-alt" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <!------------------------------- Add btn --------------------------->

      <div class="primary-button border" @click="handleAddPlacePortfolio">
        <Icon name="uil:plus" class="w-6 h-6" />
        <span class="">Add</span>
      </div>
    </div>

    <!------------------------------------Right----------------------------------------->

    <div class="flex-[50%]">
      <!-------------------------------------- Preview------------------------------------------------- -->

      <UiCardsPortfolioItemCard
        v-if="portfolios.length > 0"
        v-for="(portfolio, index) in portfolios"
        class="w-full"
        :key="index"
        :portfolio="portfolio"
        @childEvent="handleChildEvent"
        @deleteEvent="handelDelete"
      ></UiCardsPortfolioItemCard>
      <div v-else class="flex flex-col items-center justify-center h-full">
        <p class="text-lg text-sheger-gray-400">No Portfolio Added</p>
      </div>
    </div>
  </div>
</template>
