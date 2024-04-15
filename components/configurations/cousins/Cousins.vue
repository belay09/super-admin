<script setup>
import addMutation from "@/graphql/mutations/configurations/cousins/add.gql";
import editMutation from "@/graphql/mutations/configurations/cousins/edit.gql";
import deleteMutation from "@/graphql/mutations/configurations/cousins/delete.gql";
import listQuery from "@/graphql/query/cousins/list.gql";
import useNotify from "@/use/notify";
import addIconMutation from "@/graphql/mutations/icons/add-icon.gql";

const { notify } = useNotify();

/**-------------------------------Check weather add or edit--------------- */

const isAdd = ref(true);
const cousin = ref(null);
function editCousin(item) {
  isAdd.value = false;
  cousin.value = item;
}

/**-----------------------Handle add --------------------------- */
const { mutate, onDone, onError, loading } = authMutation(addMutation);
const handleAdd = (addInput) => {
  let input = {
    title: addInput.title,
  };
  mutate({ input });
};

onDone(() => {
  refetch();
  notify({
    title: "Cousin added successfully",
    description: "Cousin added successfully",
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
    title: "Cousin deleted successfully",
    description: "Cousin deleted successfully",
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

const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editMutation);
const handleEdit = (editInput) => {
  let input = {
    title: editInput.title,
  };
  editMutate({ input, id: cousin.value.id });
};

editDone(() => {
  refetch();
  notify({
    title: "Cousin edited successfully",
    description: "Cousin edited successfully",
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

/**-----------------------Cousin data fetch --------------------------- */
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
  if (result.data?.basicsCousins) {
    items.value = result.data?.basicsCousins;
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
      <p class="text-xl">Cousins</p>

      <!-- ------------------Add tag section---------------- -->
      <ConfigurationsCousinsAddEditCousin
        @add="handleAdd"
        @edit="handleEdit"
        :isAdd="isAdd"
        :item="cousin"
        :loading="loading || editLoading"
      ></ConfigurationsCousinsAddEditCousin>
      <!-- --------------------Tag lists--------------------- -->

      <div v-if="loading" class="flex flex-col space-y-6">
        <div class="border p-6 rounded-lg flex flex-col space-y-6">
          <div class="flex flex-wrap gap-4">
            <div
              v-for="i in 8"
              class="rounded-full skeleton border pl-4 h-8 w-32"
            ></div>
          </div>
        </div>
      </div>
      <Configurations-List
        v-else
        :items="items"
        :has-icon="false"
        :is-add="isAdd"
        @addItem="isAdd = true"
        @deleteItem="handleDelete"
        @editItem="editCousin"
      ></Configurations-List>
    </div>
  </div>
</template>
