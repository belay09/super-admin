<script setup>
import addMutation from "@/graphql/mutations/configurations/ambiances/add.gql";
import editMutation from "@/graphql/mutations/configurations/ambiances/edit.gql";
import deleteMutation from "@/graphql/mutations/configurations/ambiances/delete.gql";
import listQuery from "@/graphql/query/ambiances/list.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();

/**-------------------------------Check weather add or edit--------------- */

const isAdd = ref(true);
const ambiance = ref(null);
function editAmbiance(item) {
  isAdd.value = false;
  ambiance.value = item;
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
    title: "Ambiance added successfully",
    description: "Ambiance added successfully",
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
    title: "Ambiance deleted successfully",
    description: "Ambiance deleted successfully",
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
  editMutate({ input, id: ambiance.value.id });
};

editDone(() => {
  refetch();

  notify({
    title: "Ambiance edited successfully",
    description: "Ambiance edited successfully",
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

/**-----------------------ambiance data fetch --------------------------- */
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
  if (result.data?.basicsAmbiances) {
    items.value = result.data?.basicsAmbiances;
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
      <p class="text-xl">Ambiances</p>

      <!-- ------------------Add tag section---------------- -->
      <ConfigurationsAmbiancesAddEditAmbiance
        @add="handleAdd"
        @edit="handleEdit"
        :isAdd="isAdd"
        :item="ambiance"
        :loading="loading || editLoading"
      ></ConfigurationsAmbiancesAddEditAmbiance>
      <!-- --------------------Tag lists--------------------- -->

      <Configurations-List
        :items="items"
        :has-icon="false"
        @deleteItem="handleDelete"
        @editItem="editAmbiance"
      ></Configurations-List>
    </div>
  </div>
</template>
