<script setup>
import editDrinkMutation from "@/graphql/mutations/drinks/edit.gql";
import addMedia from "@/graphql/mutations/medias/add-media.gql";
import getDrinkQuery from "@/graphql/query/drinks/item.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["edit"]);
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

/***---------------------Tab--------------------- */
const { handleSubmit, isSubmitting } = useForm({});

/*...................Place detail data fetch.............*/
const title = ref("");
const price = ref();
const description = ref("");
const url = ref("");
const drink = ref(null);

const {
  onResult: drinkOnResult,
  onError: drinkOnError,
  loading: drinkLoading,
} = authItemQuery(getDrinkQuery, props.id);

drinkOnResult((result) => {
  if (result.data?.basicsDrinksByPk) {
    drink.value = result.data?.basicsDrinksByPk;
    const basicsDrinksByPk = result.data?.basicsDrinksByPk;
    title.value = basicsDrinksByPk.title;
    price.value = basicsDrinksByPk.price;
    description.value = basicsDrinksByPk.description;
    url.value = basicsDrinksByPk.media?.url;
  }
});

drinkOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

/**----------------------------Add media--------------------- */
const noImageIsSelected = ref(false);
watch(
  () => url.value,
  (value) => {
    if (value != "") {
      noImageIsSelected.value = false;
    }
  }
);
const {
  mutate: addMediaMutate,
  onDone: addMediaOnDone,
  onError: addMediaOnError,
  loading: addMediaLoading,
} = authMutation(addMedia);

addMediaOnDone((result) => {
  let input = {
    description: description.value,
    title: title.value,
    price: price.value,
    mediaId: result.data?.insertBasicsMediaOne?.id,
  };
  mutate({ input, id: props.id });
});

addMediaOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const { mutate, onDone, onError, loading } = authMutation(editDrinkMutation);
/**-----------------------Handle add --------------------------- */
const handleEdit = handleSubmit(() => {
  if (url.value != drink.value?.media?.url) {
    addMediaMutate({
      input: {
        url: url.value,
      },
    });
  } else {
    let input = {
      description: description.value,
      title: title.value,
      price: price.value,
    };
    mutate({ input, id: props.id });
  }
});

onDone(() => {
  emit("edit");
  notify({
    title: "Drink edited successfully",
    description: "Drink edited successfully",
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
</script>

<template>
  <!-- Skeleton container for the form -->
  <div v-if="drinkLoading" class="flex flex-col space-y-4">
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
  <form v-else @submit.prevent="handleEdit" class="flex flex-col" action="">
    <!-- ----------------------Title------------------- -->
    <H-Textfield
      id="drink_title"
      name="drink_title"
      label="Drink title"
      placeholder="Title"
      type="text"
      v-model="title"
      rules="required"
    ></H-Textfield>

    <!-- ----------------------Price------------------- -->

    <H-Textfield
      id="price"
      name="price"
      label="Price"
      type="number"
      v-model="price"
      rules="required"
    ></H-Textfield>

    <!-- ---------------------Description---------------- -->

    <H-Textarea
      id="description"
      name="description"
      label="Description"
      class="pt-4"
      rules="required"
      v-model="description"
    ></H-Textarea>

    <!-- ----------------------Upload Image------------------- -->
    <CommonUploadSingleImage
      folder=""
      v-model:model-value="url"
      rules="required"
      name="drinkImage"
    ></CommonUploadSingleImage>
    <p v-if="noImageIsSelected" class="text-red-500">No image is selected</p>

    <!-- ----------------------Submit------------------- -->
    <button
      :disabled="loading"
      type="submit"
      class="primary-button secondary-border py-3 mt-4"
    >
      <span>Edit</span>
      <Icon name="uil:edit" class="text-2 xl"></Icon>

      <Icon
        v-if="loading"
        name="eos-icons:bubble-loading"
        class="text-3xl text-red-600"
      />
    </button>
  </form>
</template>
