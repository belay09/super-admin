<script setup>
import addMutation from "@/graphql/mutations/configurations/tags/add.gql";
import editMutation from "@/graphql/mutations/configurations/tags/edit.gql";
import deleteMutation from "@/graphql/mutations/configurations/tags/delete.gql";
import listQuery from "@/graphql/query/tags/list.gql";
import addIconMutation from "@/graphql/mutations/icons/add-icon.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();

/**-------------------------------Check weather add or edit--------------- */

const isAdd = ref(true);
const category = ref(null);
function editTag(item) {
  isAdd.value = false;
  category.value = item;
}

function addTag() {
  isAdd.value = true;
  category.value = null;
}

/**-----------------------Handle add --------------------------- */
const { mutate, onDone, onError, loading } = authMutation(addMutation);
const handleAdd = (addInput) => {
  let input = {
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
    title: "Tag added",
    description: "Tag added successfully",
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
} = authMutation(deleteMutation);
const handleDelete = (id) => {
  deleteMutate({ id });
};

deleteDone(() => {
  refetch();
  notify({
    title: "Tag deleted",
    description: "Tag deleted successfully",
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
} = authMutation(editMutation);
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
    title: "Tag updated ",
    description: "Tag edited successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

editError((error) => {
  notify({
    title: "Some thing went wrong",
    description: message,
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
} = authListQuery(listQuery, filter, sort, 0, 100);

getResult((result) => {
  if (result.data?.basicsTags) {
    items.value = result.data?.basicsTags;
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
      <p class="text-xl">Tags</p>

      <!-- ------------------Add tag section---------------- -->
      <Configurations-Tags-AddEditTag
        @add="handleAdd"
        @edit="handleEdit"
        :isAdd="isAdd"
        :item="category"
        :loading="loading || editLoading"
      ></Configurations-Tags-AddEditTag>
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
      <Configurations-List
        v-else
        :items="items"
        :has-icon="true"
        :is-add="isAdd"
        @addItem="addTag"
        @deleteItem="handleDelete"
        @editItem="editTag"
      ></Configurations-List>
    </div>
  </div>
</template>
