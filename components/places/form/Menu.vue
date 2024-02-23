<script setup>
import insertPlaceMenuMutation from "@/graphql/mutations/menu/add.gql";
import getMenuTypesQuery from "@/graphql/query/basics/menuTypes.gql";
import getMenuTags from "@/graphql/query/basics/menuTags.gql";
import getPlacesMenuQuery from "@/graphql/query/menu/list.gql";

import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**-----------------------Globals----------------------------- */
const { notify } = useNotify();
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
});
/**-----------------------Navigation----------------------------- */
const emit = defineEmits(["next", "prev"]);
const next = () => {
  emit("next");
};
const prev = () => {
  emit("prev");
};

/*...................Place menus data fetch.............*/
const menuFilter = ref({
  placeId: {
    _eq: props.placeId,
  },
});
const limit = ref(20);
const menuOffset = ref(0);
const menuSort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const menus = ref([]);
const length = ref(0);

const {
  onResult: menuResult,
  onError: menuError,
  loading: menuLoading,
  refetch: menuRefetch,
  fetchMore: menuFetchMore,
} = authListQuery(getPlacesMenuQuery, menuFilter, menuSort, menuOffset, limit);

menuResult((result) => {
  if (result.data?.menus) {
    menus.value = result.data?.menus;
    length.value = result.data?.menusAggregate?.aggregate?.count;
  }
});
menuError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-----------------------------Menu Type Data fetch ----------------------*/
const menuTypeItems = ref([]);
const {
  onResult: onResultMenuType,
  onError: onErrorMenuType,
  loading: loadingMenuType,
} = authListQuery(getMenuTypesQuery, {}, "", 0, 50);

onResultMenuType((result) => {
  if (result.data) {
    menuTypeItems.value = result?.data?.menuTypes;
  }
});

/**--------------------------Menu Tag Data Fetch ------------------------ */
const menuTagItems = ref([]);
const menuTagSearch = ref("");
const menuTagFilter = computed(() => {
  let query = {};
  if (menuTagSearch.value) {
    query.title = {
      _ilike: `%${menuTagSearch.value}%`,
    };
  }
});
const {
  onResult: onResultMenuTag,
  onError: onErrorMenuTag,
  loading: loadingMenuTag,
  refetch: refetchMenuTag,
  fetchMore: fetchMoreMenuTag,
} = authListQuery(getMenuTags, menuTagFilter, "", 0, 50);

onResultMenuTag((result) => {
  if (result.data) {
    menuTagItems.value = result?.data?.menuTags.map((item) => {
      return {
        title: item.tag.title,
        id: item.tag.id,
      };
    });
  }
});

/*--------------------------------Add menu ------------------------- */

const image_urls = ref([
  "https://cdn.hahu.jobs/public/sheger-gebeta/715762eb-6c62-4887-a8f6-9ed791dddabc.jpeg",
  "https://cdn.hahu.jobs/public/sheger-gebeta/715762eb-6c62-4887-a8f6-9ed791dddabc.jpeg",
]);
const menuType = ref("");
const menuTags = ref([]);
const menuCategory = ref("");
const isHouseSpecial = ref(false);
const menuName = ref("");
const menuIngredients = ref("");
const menuDescription = ref("");
const menuPrice = ref(0);
const menuPreparationTime = ref(0);
const featuredImage = ref("");

// mutation
const {
  mutate: insertPlaceMenuMutate,
  loading: insertPlaceMenuLoading,
  onError: insertPlaceMenuError,
  onDone: insertPlaceMenuDone,
} = authMutation(insertPlaceMenuMutation);

insertPlaceMenuDone(() => {
  menuRefetch();
  notify({
    title: "Menu Added",
    description: "Menu Added Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

insertPlaceMenuError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

// handler
const handleAddMenu = handleSubmit(() => {
  insertPlaceMenuMutate({
    input: {
      placeId: props.placeId,
      title: menuName.value,
      type: menuType.value.toUpperCase(),
      categoryId: menuCategory.value,
      price: menuPrice.value,
      timeToPrepare: menuPreparationTime.value,
      isHouseSpecial: isHouseSpecial.value,
      ingridients: menuIngredients.value,
      description: menuDescription.value,
      media: {
        data: {
          url: featuredImage.value,
        },
      },
      menuMedias: {
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
      menuTags: {
        data: menuTags.value.map((tag) => {
          return {
            tagId: tag,
          };
        }),
      },
    },
  });
});
</script>
<template>
  <div>
    <div class="flex px-10 py-10">
      <!-----------------------------------Left-------------------------------------------------- -->
      <div class="flex-[50%] pr-10 border-r mx-2">
        <form
          @submit.prevent="handleAddMenu"
          action=""
          class="flex flex-col gap-5"
        >
          <!-- ----------------------------------------- Menu Name ---------------------------------------->
          <HTextfield
            type="text"
            name="Menu Name"
            class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
            rules="required"
            v-model="menuName"
          >
            <template #label>
              <p class="text-sheger-gray-100">Menu Name</p>
            </template>
          </HTextfield>

          <!----------------------------------------------Price (ETB)------------------------------------------>
          <HTextfield
            type="number"
            name="Price"
            class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
            rules="required"
            v-model="menuPrice"
          >
            <template #label>
              <p class="text-sheger-gray-100">Price (ETB)</p>
            </template>
          </HTextfield>

          <!----------------------------------------Preparation Time (Minutes)---------------------------------------->

          <HTextfield
            type="number"
            name="Preparation Time"
            class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
            rules="required"
            v-model="menuPreparationTime"
          >
            <template #label>
              <p class="text-sheger-gray-100">Preparation Time (Minutes)</p>
            </template>
          </HTextfield>

          <!----------------------------------------Menu Type---------------------------------------->

          <LazyH-SingleSelect
            name="menu_type"
            id="menu_type"
            label="Menu Type"
            :items="menuTypeItems"
            v-model="menuType"
          ></LazyH-SingleSelect>

          <!----------------------------------------Ingredient ( Use comma to separate)---------------------------------------->

          <HTextfield
            type="text"
            name="Ingredient"
            class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
            rules="required"
            v-model="menuIngredients"
          >
            <template #label>
              <p class="text-sheger-gray-100 mb-2">
                Ingredient ( Use comma to separate)
              </p>
            </template>
          </HTextfield>

          <!----------------------------------------Tag---------------------------------------->

          <LazyH-multi-select-chips
            multiple
            chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
            :items="menuTagItems"
            v-model="menuTags"
            value="id"
            showBy="title"
            listClass="h-40"
            returnBy="id"
            name="tag"
            rules="required"
            label="Tag"
            placeholder="Select Tag"
            @search="menuTagSearch = $event"
          >
          </LazyH-multi-select-chips>

          <!--------------------------------------------Category ---------------------------------------- -->
          <SelectorsCategory
            type="MENU_CATEGORY"
            v-model="menuCategory"
          ></SelectorsCategory>

          <!--------------------------------------------Description ---------------------------------------- -->
          <H-Textarea
            name="place_portfolio_description"
            id="place_portfolio_description"
            label="Description"
            placeholder="Description"
            v-model="menuDescription"
            rules="required"
          ></H-Textarea>

          <!----------------------------------------Home Special---------------------------------------->

          <div
            class="flex justify-between border items-center py-2.5 border-sheger-gray-200 px-2 rounded-md"
          >
            Houses' Special

            <HSwitch
              name="houses_special"
              id="houses_special"
              label="houses_special"
              class="flex items-center"
              v-model="isHouseSpecial"
            ></HSwitch>
          </div>

          <!-- ----------------------Featured image------------------- -->
          <div class="flex flex-col gap-y-4">
            <p class="secondary-text">Featured Image</p>
            <CommonUploadSingleImage
              folder=""
              v-model:model-value="featuredImage"
              name="featuredImage"
              rules="required"
            ></CommonUploadSingleImage>
          </div>

          <!----------------------------------------Image Upload---------------------------------------->

          <div
            class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg p-8"
          >
            <Icon name="uil:cloud-upload" class="w-20 h-20" />
            <div class="input_field flex flex-col w-max mx-auto text-center">
              <label>
                <input
                  class="text-sm cursor-pointer w-36 hidden"
                  type="file"
                  accept="image/*"
                  multiple
                />
                <div>
                  Drag and drop here or
                  <span class="text-primary-600">Browse</span>
                </div>
              </label>

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
                v-for="(url, index) in image_urls"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-3">
                  <img :src="url" class="w-[100px]" />
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

          <button class="primary-button border">
            <Icon name="uil:plus" class="w-6 h-6" />
            <span class="">Add Menu Item</span>
          </button>
        </form>
      </div>

      <!-- ------------------------------Menu list ----------------------------- -->
      <div class="flex-[50%] pl-6">
        <p class="secondary-text !text-lg font-medium mb-6">
          {{ length }} Menu items
        </p>

        <!-- -----------------------Skeleton------------------- -->
        <div v-if="menuLoading" class="flex flex-col gap-4">
          <div v-for="i in 8" class="w-full 2xl:max-w-4xl">
            <!-- Skeleton loader for the menu item -->
            <div
              class="grid grid-cols-8 gap-4 lg:gap-8 secondary-border rounded-lg w-full relative skeleton-container"
            >
              <div
                class="skeleton col-span-3 lg:col-span-3 bg-gray-300 rounded-l-lg"
              ></div>
              <div
                class="col-span-5 lg:col-span-5 flex flex-col space-y-2 lg:space-y-4 py-4 pr-2 lg:pr-6"
              >
                <div class="flex justify-between w-full">
                  <div class="skeleton w-20 h-6"></div>
                  <div class="skeleton w-8 h-8"></div>
                </div>
                <div class="skeleton w-full h-8"></div>
                <div class="skeleton w-2/3 h-6"></div>
                <div class="flex space-x-4 items-start">
                  <div class="skeleton w-8 h-8"></div>
                  <div class="skeleton w-2/3 h-6"></div>
                </div>
                <div class="skeleton w-full h-16"></div>
                <div class="flex items-center space-x-4">
                  <div class="skeleton w-8 h-8"></div>
                  <div class="skeleton w-2/3 h-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex flex-col gap-4">
          <UiCardsMenu
            @onDelete="menuRefetch"
            @onEdit="menuRefetch"
            v-for="menu in menus"
            :key="menu.id"
            :menu="menu"
          />
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
