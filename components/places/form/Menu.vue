<script setup>
import insertPlaceMenuMutation from "@/graphql/mutations/place/insertPlaceMenus.gql";
import getMenuTypes from "@/graphql/query/basics/menuTypes.gql";
import getMenuTags from "@/graphql/query/basics/menuTags.gql";

/***************************Data*************************************/
const menuType = ref("");
const menuTag = ref([]);
const housesSpecial = ref(false);
const menuTypeItems = ref([]);
const menuTagItems = ref([]);
const menuTagSearch = ref("");
const menuName = ref("");
const menuPrice = ref(0)
const menuPreparationTime = ref(0)

watch(menuType, (newVal) => {
  console.log(newVal, "menuType");
});

/***************************Query*************************************/

/**-----------------------------Menu Type Query ----------------------*/
const {
  onResult: onResultMenuType,
  onError: onErrorMenuType,
  loading: loadingMenuType,
  refetch: refetchMenuType,
  fetchMore: fetchMoreMenuType,
} = authListQuery(getMenuTypes, {}, "", 0, 50);

onResultMenuType((result) => {
  if (result.data) {
    menuTypeItems.value = result?.data?.menuTypes;
  }
});

/**--------------------------Menu Tag Query ------------------------ */

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

  console.log(menuTagItems.value, "menuTagItems");
});

// const menuTypeItems = ref([
//   {
//     name: "Food",
//     id: "Food",
//   },
//   {
//     name: "Drink",
//     id: "Drink",
//   },
// ]);
</script>
<template>
  <div class="flex px-20 py-10">
    <!-----------------------------------Left-------------------------------------------------- -->
    <div class="flex-[50%] px-10 flex flex-col gap-4 border-r mx-2">
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
      <H-SingleSelect
        name="menu_type"
        id="menu_type"
        label="Menu Type"
        :items="menuTypeItems"
        v-model="menuType"
        show-by="value"
        return-object
      ></H-SingleSelect>

      <!----------------------------------------Ingredient ( Use comma to seprate)---------------------------------------->

      <HTextfield
        type="text"
        name="Ingredient"
        class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
        rules="required"
        v-model="menuIngredient"
      >
        <template #label>
          <p class="text-sheger-gray-100 mb-2">
            Ingredient ( Use comma to seprate)
          </p>
        </template>
      </HTextfield>

      <!----------------------------------------Tag---------------------------------------->

      <Lazyh-multi-select-chips
        multiple
        chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
        :items="menuTagItems"
        v-model="menuTag"
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
      </Lazyh-multi-select-chips>

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
          v-model="housesSpecial"
        ></HSwitch>
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

      <div class="flex flex-col gap-4">
        <p class="text-lg font-medium">Uploaded Files</p>
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <img
                src="/images/temporary/default-food-image.png"
                class="w-[100px]"
              />
              <div>
                <p class="text-lg font-medium">IMG=99KJ0-.png</p>
                <p class="text-sm font-light text-sheger-gray-100">
                  Feb 2, 2023. image
                </p>
              </div>
            </div>
            <!--progress -->
            <div class="bg-primary-600 h-[3px] w-[200px]" />

            <div>
              <Icon name="uil:trash-alt" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
      <!------------------------------- Add btn --------------------------->

      <div class="primary-button border">
        <Icon name="uil:plus" class="w-6 h-6" />
        <span class="">Add Menu Item</span>
      </div>
    </div>

    <!-- ------------------------------Right ----------------------------- -->

    <div class="flex-[50%] flex flex-col gap-4">
      <UiCardsMenuItemCard />
      <UiCardsMenuItemCard />
      <UiCardsMenuItemCard />
    </div>
  </div>
</template>
