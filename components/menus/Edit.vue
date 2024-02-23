<script setup>
import editMenuMutation from "@/graphql/mutations/menu/edit.gql";
import getMenuTypesQuery from "@/graphql/query/basics/menuTypes.gql";
import getMenuTags from "@/graphql/query/basics/menuTags.gql";
import getMenuQuery from "@/graphql/query/menu/item.gql";
import addMediaMutation from "@/graphql/mutations/medias/add-media.gql";

import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**-----------------------Globals----------------------------- */
const emit = defineEmits(["onEdit"]);
const { notify } = useNotify();
const props = defineProps({
  menuId: {
    type: Number,
    required: true,
  },
});

/*--------------------------------Add menu data ------------------------- */

const image_urls = ref([
  "https://cdn.hahu.jobs/public/sheger-gebeta/715762eb-6c62-4887-a8f6-9ed791dddabc.jpeg",
  "https://cdn.hahu.jobs/public/sheger-gebeta/715762eb-6c62-4887-a8f6-9ed791dddabc.jpeg",
]);
const menuType = ref("");
const menuTags = ref([]);
const initMenuTags = ref([]);
const menuCategory = ref("");
const isHouseSpecial = ref(false);
const menuName = ref("");
const menuIngredients = ref("");
const menuDescription = ref("");
const menuPrice = ref(0);
const menuPreparationTime = ref(0);
const featuredImage = ref("");

/**
 * Capitalizes the first letter of the input string.
 *
 * @param {string} inputString - The input string to be capitalized
 * @return {string} The input string with the first letter capitalized
 */
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
/*...................Place detail data fetch.............*/
const menu = ref(null);
const {
  onResult: menuOnResult,
  onError: menuOnError,
  loading: menuLoading,
  refetch: menuRefetch,
} = authItemQuery(getMenuQuery, props.menuId);

menuOnResult((result) => {
  if (result.data?.menu) {
    menu.value = result.data.menu;
    let tempMenu = result.data.menu;
    menuType.value = capitalizeFirstLetter(tempMenu.type.toLowerCase());

    // init menu tags
    initMenuTags.value = tempMenu.menuTags.map((menuTag) => {
      return {
        title: menuTag.tag.title,
        id: menuTag.tag.id,
      };
    });

    featuredImage.value = tempMenu.media.url;
    menuCategory.value = tempMenu.categoryId;
    menuName.value = tempMenu.title;
    menuIngredients.value = tempMenu.ingridients;
    menuDescription.value = tempMenu.description;
    menuPrice.value = tempMenu.price;
    menuPreparationTime.value = tempMenu.timeToPrepare;
    isHouseSpecial.value = tempMenu.isHouseSpecial;
    image_urls.value = tempMenu.menuMedias.map((item) => {
      return item.media.url;
    });
  }
});

menuOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
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
const editInput = ref({
  id: props.menuId,
});
// mutation
const {
  mutate: editMutate,
  loading: editLoading,
  onError: editError,
  onDone: editDone,
} = authMutation(editMenuMutation);

editDone(() => {
  menuRefetch();
  emit("onEdit");
  notify({
    title: "Menu Updated",
    description: "Menu Updated Successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
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
    id: props.menuId,
    menuObject: {
      title: menuName.value,
      type: menuType.value.toUpperCase(),
      categoryId: menuCategory.value,
      price: menuPrice.value,
      timeToPrepare: menuPreparationTime.value,
      isHouseSpecial: isHouseSpecial.value,
      ingridients: menuIngredients.value,
      description: menuDescription.value,
      featuredImage: result.data?.insertBasicsMediaOne?.id,
    },
    // menu medias
    menuMediaObject: image_urls.value.map((url) => {
      return {
        menuId: props.menuId,
        media: {
          data: {
            url,
          },
        },
      };
    }),
    // menu tags
    menuTagObject: menuTags.value.map((tag) => {
      return {
        menuId: props.menuId,
        tagId: tag,
      };
    }),
  });
});
// handler
const handleEditMenu = handleSubmit(() => {
  addMediaMutate({
    input: {
      url: featuredImage.value,
    },
  });
});
</script>
<template>
  <div>
    <div class="px-10 py-10">
      <!-----------------------------------Left-------------------------------------------------- -->
      <div v-if="menuLoading" class="grid grid-cols-2 gap-x-20">
        <!-- Skeleton container for the form -->
        <div v-for="i in 2" class="flex flex-col space-y-4 w-[34rem]">
          <!-- Title skeleton -->
          <div class="flex flex-col space-y-4">
            <div class="skeleton w-1/3 h-8"></div>
            <div class="skeleton w-full h-12"></div>
          </div>

          <!-- Price skeleton -->
          <div class="flex flex-col space-y-4">
            <div class="skeleton w-1/3 h-8"></div>
            <div class="skeleton w-full h-12"></div>
          </div>
          <!-- Description skeleton -->
          <div class="flex flex-col space-y-4">
            <div class="skeleton w-1/3 h-8"></div>
            <div class="skeleton w-full h-36"></div>
          </div>
          <!-- Image Upload skeleton -->
          <div class="skeleton w-full h-36"></div>

          <!-- Submit button skeleton -->
          <div class="skeleton w-full h-12"></div>
          <div class="skeleton w-full h-12"></div>
        </div>
      </div>
      <form
        v-else
        @submit.prevent="handleEditMenu"
        action=""
        class="grid grid-cols-2 gap-x-20"
      >
        <!-- -----------------------Left---------------------------------------- -->
        <div class="flex flex-col gap-5">
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

          <!-- ----------------------Featured image------------------- -->
          <div class="flex flex-col gap-y-4">
            <p class="secondary-text">Featured Image</p>
            <CommonUploadSingleImage
              folder=""
              v-model:model-value="featuredImage"
              name="featuredImage"
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
        </div>

        <!-- -----------------------Right---------------------------------------- -->

        <div class="flex flex-col gap-5">
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
            :init="initMenuTags"
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
          ></H-Textarea>

          <!------------------------------- Add btn --------------------------->

          <button class="primary-button text-white bg-primary-600">
            <Icon name="uil:plus" class="w-6 h-6" />
            <span class="">Submit</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
