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

const image_urls = ref([]);
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
const selectedThumbnail = ref("");

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
/*...................Place menu data fetch.............*/
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
        name: menuTag.tag.title,
        id: menuTag.tag.id,
      };
    });

    menuTags.value = tempMenu.menuTags.map((menuTag) => menuTag.tag.id);
    selectedThumbnail.value = tempMenu.media.url;
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

    image_urls.value.push(selectedThumbnail.value);
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

/*--------------------------------Edit menu ------------------------- */

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
  // remove thumbnail from images
  let imageWithOutThumbnails =
    image_urls.value.filter((image) => image !== selectedThumbnail.value) || [];
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

    menuMediaObject: imageWithOutThumbnails.map((url) => {
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
      url: selectedThumbnail.value,
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
            :disabled="false"
            :showStar="false"
            v-model:thumbnails="selectedThumbnail"
          />

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

          <LazyHSingleSelect
            name="menu_type"
            id="menu_type"
            label="Menu Type"
            :items="menuTypeItems"
            v-model="menuType"
          ></LazyHSingleSelect>

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
          <SelectorsTag
            type="MENU_TAG"
            v-model="menuTags"
            :init="initMenuTags"
          />

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
            <Icon
              v-if="editLoading"
              name="eos-icons:bubble-loading"
              class="text-3xl text-red-600"
            />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
