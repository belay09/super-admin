<script setup>
import addMutation from "@/graphql/mutations/configurations/amenities/add.gql";
import editMutation from "@/graphql/mutations/configurations/amenities/edit.gql";
import deleteMutation from "@/graphql/mutations/configurations/amenities/delete.gql";
import listQuery from "@/graphql/query/amenities/list.gql";
import addIconMutation from "@/graphql/mutations/icons/add-icon.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();

/**-------------------------------Check weather add or edit--------------- */

const isAdd = ref(true);
const amenity = ref(null);
function editAmenity(item) {
  isAdd.value = false;
  amenity.value = item;
}

function addAmenity() {
  isAdd.value = true;
  amenity.value = null;
}

/**-----------------------Handle add --------------------------- */
const { mutate, onDone, onError, loading } = authMutation(addMutation);
const handleAdd = (addInput) => {
  let input = {
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
    title: "Amenity added successfully",
    description: "Amenity added successfully",
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
    title: "Amenity deleted successfully",
    description: "Amenity deleted successfully",
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
  if (editInput.url === amenity.value?.icon?.lightIconUrl) {
    let input = {
      title: editInput.title,
    };
    editMutate({ input, id: amenity.value.id });
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
      editMutate({ input, id: amenity.value?.id });
    }
  });
};

editDone(() => {
  refetch();

  notify({
    title: "Amenity edited successfully",
    description: "Amenity edited successfully",
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
/**-----------------------amenities data fetch --------------------------- */
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
  if (result.data?.basicsAmenities) {
    items.value = result.data?.basicsAmenities;
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
      <p class="text-xl">Amenities</p>

      <!-- ------------------Add tag section---------------- -->
      <Configurations-Amenities-AddEditAmenity
        @add="handleAdd"
        @edit="handleEdit"
        :isAdd="isAdd"
        :item="amenity"
        :loading="loading || editLoading"
      ></Configurations-Amenities-AddEditAmenity>
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
        @addItem="addAmenity"
        @deleteItem="handleDelete"
        @editItem="editAmenity"
      ></Configurations-List>
    </div>
  </div>
</template>
