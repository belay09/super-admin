<script setup>
import insertPlaceMenuMutation from "@/graphql/mutations/menu/add.gql";
import useNotify from "@/use/notify";
import getMenuTypesQuery from "@/graphql/query/basics/menuTypes.gql";

const { handleSubmit, isSubmitting } = useForm({});

/**-----------------------Globals----------------------------- */
const emit = defineEmits(["onAdd"]);
const { notify } = useNotify();
const props = defineProps({
  placeId: {
    type: Number,
    required: true,
  },
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

/*--------------------------------Add menu ------------------------- */

const image_urls = ref([]);
const menuType = ref("");
const menuTags = ref([]);
const menuCategory = ref("");
const isHouseSpecial = ref(false);
const menuName = ref("");
const menuIngredients = ref("");
const menuDescription = ref("");
const menuPrice = ref(0);
const menuPreparationTime = ref(0);
const selectedThumbnail = ref("");

// mutation
const {
  mutate: insertPlaceMenuMutate,
  loading: insertPlaceMenuLoading,
  onError: insertPlaceMenuError,
  onDone: insertPlaceMenuDone,
} = authMutation(insertPlaceMenuMutation);

insertPlaceMenuDone(() => {
  emit("onAdd");
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
  // remove thumbnail from images
  let imageWithOutThumbnails =
    image_urls.value.filter((image) => image !== selectedThumbnail.value) || [];
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
          url: selectedThumbnail.value,
        },
      },
      menuMedias: {
        data: imageWithOutThumbnails.map((url) => {
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
    <div class="px-10 py-10">
      <!-----------------------------------Left-------------------------------------------------- -->

      <form
        @submit.prevent="handleAddMenu"
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
          <SelectorsTag type="MENU_TAG" v-model="menuTags" />

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
              v-if="insertPlaceMenuLoading"
              name="eos-icons:bubble-loading"
              class="text-3xl text-red-600"
            />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
