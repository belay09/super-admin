<script setup>
import GetCategories from "@/graphql/query/configuration/getBasicsReviewCategories.gql";
import DeleteCategory from "@/graphql/mutations/configurations/place-service/deleteBasicsReviewCategory.gql";
import mutator from "@/composables/auth-mutation.js";
import list from "@/composables/auth-list-query.js";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import useNotify from "@/use/notify.js";

const { notify } = useNotify();

const tabs = ref([
  {
    name: "Hotels",
    value: "HOTELS",
  },
  {
    name: "Restaurants",
    value: "RESTAURANTS",
  },
  {
    name: "Cafes",
    value: "CAFES",
  },
  {
    name: "Caterings",
    value: "CATERINGS",
  },
]);

const currentActiveTabIndex = ref(0);

const headers = ref([
  {
    text: "Name",
    value: "name",
  },
  //   {
  //     text: "Type",
  //     value: "type",
  //   },
  {
    text: "Description",
    value: "description",
  },

  {
    text: "Actions",
    value: "actions",
  },
]);

/*------------ Fetch Basic Categories -------------*/
const categories = ref([]);
const filter = computed(() => {
  return {
    type: {
      _eq: tabs.value[currentActiveTabIndex.value].value,
    },
  };
});

const limit = ref(10);

const page = ref(1);

const offset = computed(() => {
  return (page.value - 1) * limit.value;
});

const {
  onResult: onCategoryResult,
  loading: categoryLoading,
  refetch: refetchCategories,
} = list(GetCategories, filter, [], offset, limit);

onCategoryResult(({ data }) => {
  categories.value = data?.categories;
});

const openAddModal = ref(false);

/*------------ Delete Basic Category -------------*/
const toBeDeletedCategoryId = ref(null);
const openDeleteConfirmationModal = ref(false);

const {
  mutate: deleteCategory,
  loading: deleteCategoryLoading,
  onDone: onDeleteCategoryDone,
} = mutator(DeleteCategory);

const handleCategoryDeletion = () => {
  deleteCategory({
    id: toBeDeletedCategoryId.value,
  });
  openDeleteConfirmationModal.value = false;
};

onDeleteCategoryDone(() => {
  refetchCategories();
  notify({
    title: "Success",
    description: "Category deleted successfully",
    cardClass: "bg-green-100",
  });
});

/*------------ Edit Basic Category -------------*/
const toBeEditedCategory = ref(null);
const openEditModal = ref(false);
</script>
<template>
  <!-- Add Modal -->
  <Configurations-PlaceService-Modals-Add
    v-model="openAddModal"
    @refetch="refetchCategories"
    v-if="openAddModal"
  />

  <!-- Edit Modal -->
  <Configurations-PlaceService-Modals-Edit
    v-model="openEditModal"
    @refetch="refetchCategories"
    :categoryData="toBeEditedCategory"
    v-if="openEditModal"
  />

  <!-- Delete Confirmation modal -->
  <ModalsConfirmation
    title="Delete Category"
    description="You are about to delete a category. This action cannot be undone. Are you sure you want to proceed?"
    :sure-question="`Are you sure you want to delete this category?`"
    icon="tabler:category-minus"
    icon-class="text-red-600 w-7 h-7"
    v-model="openDeleteConfirmationModal"
    @confirm="handleCategoryDeletion"
  />
  <div>
    <div class="relative">
      <H-Tab :tabs="tabs" v-model:current-tab-index="currentActiveTabIndex" />
      <button
        class="absolute flex items-center justify-center gap-x-2 -top-2 right-0 text-white bg-primary-600 px-5 py-1.5 rounded-md"
        @click="openAddModal = true"
      >
        <icon name="tabler:category-plus" class="text-lg" />
        Add New
      </button>
    </div>
    <div class="mt-10">
      <H-Table
        :headers="headers"
        :loading="categoryLoading"
        :items="categories"
        row-head-style="text-left bg-gray-100"
        supporter-class="border border-gray-300 rounded-lg"
        row-style="border-b border-gray-300"
      >
        <template #name="{ item }">
          <div class="flex items-center gap-x-2">
            <img
              v-if="item?.icon?.lightIconUrl"
              :src="item?.icon?.lightIconUrl"
              class="w-8 h-8"
              alt=" icon image"
            />
            <p>{{ item.name }}</p>
          </div>
        </template>
        <template #actions="{ item }">
          <div>
            <Menu as="div" class="relative inline-block text-left">
              <div>
                <MenuButton class="">
                  <Icon name="tabler:dots" class="text-2xl rotate-90" />
                </MenuButton>
              </div>

              <transition
                enter-active-class="transition duration-100 ease-out"
                enter-from-class="transform scale-95 opacity-0"
                enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 z-50 w-40 mt-2 overflow-hidden origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none"
                >
                  <div>
                    <MenuItem
                      class="py-1.5 px-3 hover:bg-primary-600 hover:text-white flex items-center gap-x-2 font-medium"
                      @click="
                        openEditModal = true;
                        toBeEditedCategory = item;
                      "
                    >
                      <button class="w-full">
                        <icon name="uil:edit-alt" class="text-2xl" />
                        Edit
                      </button></MenuItem
                    >
                    <MenuItem
                      class="py-1.5 px-3 hover:bg-primary-600 hover:text-white flex items-center gap-x-2 font-medium"
                    >
                      <button
                        class="w-full"
                        @click="
                          openDeleteConfirmationModal = true;
                          toBeDeletedCategoryId = item.id;
                        "
                      >
                        <icon name="mdi:delete-sweep" class="text-2xl" /> Delete
                      </button>
                    </MenuItem>
                  </div>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </template>
      </H-Table>
    </div>
    <div>
      <H-Paginate item />
    </div>
  </div>
</template>
