<script setup>
import addMutation from "@/graphql/mutations/configurations/social-medias/add.gql";
import editMutation from "@/graphql/mutations/configurations/social-medias/edit.gql";
import deleteMutation from "@/graphql/mutations/configurations/social-medias/delete.gql";
import listQuery from "@/graphql/query/medias/socialMedias.gql";
import addIconMutation from "@/graphql/mutations/icons/add-icon.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();

/**-------------------------------Check weather add or edit--------------- */

const isAdd = ref(true);
const socialMedia = ref(null);
function editSocialMedia(item) {
  isAdd.value = false;
  socialMedia.value = item;
}

function showAdd() {
  socialMedia.value = null;
  isAdd.value = true;
}

/**-----------------------Handle add --------------------------- */
const { mutate, onDone, onError, loading } = authMutation(addMutation);
const handleAdd = (addInput) => {
  let input = {
    name: addInput.title,
    url: "http://shegergebeta.com",
    order: 1,
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
    title: "Social Media added ",
    description: "Social Media added successfully",
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
    title: "Social Media deleted ",
    description: "Social Media deleted successfully",
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
  if (editInput.url === socialMedia.value?.icon?.lightIconUrl) {
    let input = {
      name: editInput.title,
    };
    editMutate({ input, id: socialMedia.value.id });
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
        name: editInput.title,
        iconId: result.data?.insertBasicsIconsOne.id,
      };
      editMutate({ input, id: socialMedia.value?.id });
    }
  });
};

editDone(() => {
  refetch();

  notify({
    title: "Social Media updated ",
    description: "Social Media updated successfully",
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
  if (result.data?.basicsSocialMedias) {
    items.value = result.data?.basicsSocialMedias;
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
      <p class="text-xl">Social Medias</p>

      <!-- ------------------Add tag section---------------- -->
      <ConfigurationsSocialMediasAddEditSocialMedia
        @add="handleAdd"
        @edit="handleEdit"
        @showAdd="showAdd"
        :isAdd="isAdd"
        :item="socialMedia"
        :loading="loading || editLoading"
      ></ConfigurationsSocialMediasAddEditSocialMedia>
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
        :isAdd="isAdd"
        @addItem="isAdd = true"
        @deleteItem="handleDelete"
        @editItem="editSocialMedia"
      ></Configurations-List>
    </div>
  </div>
</template>
