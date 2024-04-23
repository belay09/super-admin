<script setup>
import addCategoryMutation from "@/graphql/mutations/configurations/categories/add.gql";
import editCategoryMutation from "@/graphql/mutations/configurations/categories/edit.gql";
import deleteCategoryMutation from "@/graphql/mutations/configurations/categories/delete.gql";
import categoryListQuery from "@/graphql/query/categories/list.gql";
import addIconMutation from "@/graphql/mutations/icons/add-icon.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();

/**-------------------------------Check weather add or edit--------------- */

const isAddCategory = ref(true);
const category = ref(null);
function editCategory(item) {
  isAddCategory.value = false;
  category.value = item;
}

/**-----------------------Handle add --------------------------- */
const { mutate, onDone, onError, loading } = authMutation(addCategoryMutation);
const handleAdd = (addInput) => {
  let input = {
    description: "",
    type: addInput.type,
    title: addInput.title,
    icon: {
      data: {
        darkIconUrl: "",
        lightIconUrl: addInput.url,
      },
    },
  };
  mutate({ input });
};

onDone(() => {
  refetch();
  notify({
    title: "Ad space added successfully",
    description: "Ad space added successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-----------------------Handle delete --------------------------- */
const {
  mutate: deleteMutate,
  onDone: deleteDone,
  onError: deleteError,
  loading: deleteLoading,
} = authMutation(deleteCategoryMutation);
const handleDelete = (id) => {
  deleteMutate({ id });
};

deleteDone(() => {
  refetch();
  notify({
    title: "Category deleted successfully",
    description: "Category deleted successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

deleteError((error) => {
  let message;
  if (error.message.includes("Foreign key violation")) {
    message = "Can't delete this item";
  } else {
    message = error.message;
  }
  notify({
    title: "Some thing went wrong",
    description: message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

//**------------------------------Handle edit--------------- */

/**----------------------------Add media--------------------- */

const {
  mutate: addIconMutate,
  onDone: addIconOnDone,
  onError: addIconOnError,
  loading: addIconLoading,
} = authMutation(addIconMutation);

addIconOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editCategoryMutation);
const handleEdit = (editInput) => {
  if (editInput.url === category.value?.icon?.lightIconUrl) {
    let input = {
      type: editInput.type,
      title: editInput.title,
    };
    editMutate({ input, id: category.value.id });
    return;
  }

  addIconMutate({
    input: {
      lightIconUrl: editInput.url,
      darkIconUrl: "",
    },
  });

  addIconOnDone((result) => {
    if (result.data?.insertBasicsIconsOne?.id) {
      let input = {
        type: editInput.type,
        title: editInput.title,
        iconId: result.data?.insertBasicsIconsOne.id,
      };
      editMutate({ input, id: category.value?.id });
    }
  });
};

editDone(() => {
  refetch();

  notify({
    title: "Category edited successfully",
    description: "Category edited successfully",
    type: "error",
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

/**-----------------------Category data fetch --------------------------- */
const sort = ref([{}]);
const filter = ref({});
const items = ref([]);

const {
  onResult: getResult,
  onError: getError,
  loading: getLoading,
  refetch,
} = authListQuery(categoryListQuery, filter, sort, 0, 100);

getResult((result) => {
  if (result.data?.basicsCategories) {
    items.value = result.data.basicsCategories;
  }
});

getError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <div class="flex flex-col space-y-6">
    <div class="border p-6 rounded-lg flex flex-col space-y-6">
      <p class="text-xl">Categories</p>

      <!-- ------------------Add tag section---------------- -->
      <Configurations-Categories-Add-EditCategories
        @add="handleAdd"
        @edit="handleEdit"
        :isAdd="isAddCategory"
        :item="category"
        :loading="loading || editLoading"
      ></Configurations-Categories-Add-EditCategories>
      <!-- --------------------Tag lists--------------------- -->
      <div v-if="getLoading" class="flex flex-col space-y-6">
        <div class="border p-6 rounded-lg flex flex-col space-y-6">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="i in 8"
              class="rounded-full skeleton border pl-4 h-8 w-40"
            ></div>
          </div>
        </div>
      </div>
      <ConfigurationsCategoriesList
        v-else
        :items="items"
        :has-icon="true"
        @deleteItem="handleDelete"
        @editItem="editCategory"
      ></ConfigurationsCategoriesList>
    </div>
  </div>
</template>
