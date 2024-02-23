<script setup>
import editDrinkMutation from "@/graphql/mutations/configurations/recommendations/edit.gql";
import addMedia from "@/graphql/mutations/medias/add-media.gql";
import getItemQuery from "@/graphql/query/sheger-recommendations/item.gql";
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
const description = ref("");
const url = ref("");
const recommendation = ref(null);

const {
  onResult: recommendationOnResult,
  onError: recommendationOnError,
  loading: recommendationLoading,
} = authItemQuery(getItemQuery, props.id);

recommendationOnResult((result) => {
  if (result.data?.basicsShegerRecommendationsByPk) {
    console.log(result.data?.basicsShegerRecommendationsByPk);
    recommendation.value = result.data?.basicsShegerRecommendationsByPk;
    const basicsShegerRecommendationsByPk =
      result.data?.basicsShegerRecommendationsByPk;
    title.value = basicsShegerRecommendationsByPk?.title;
    description.value = basicsShegerRecommendationsByPk?.description;
    url.value = basicsShegerRecommendationsByPk?.shegerRecommendationBadge?.url;
  }
});

recommendationOnError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

/**----------------------------Add media--------------------- */

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
  if (url.value != recommendation.value?.shegerRecommendationBadge?.url) {
    addMediaMutate({
      input: {
        url: url.value,
      },
    });
  } else {
    let input = {
      description: description.value,
      title: title.value,
    };
    mutate({ input, id: props.id });
  }
});

onDone(() => {
  emit("edit");
  notify({
    title: "Badge edited successfully",
    description: "Badge edited successfully",
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
  <div v-if="recommendationLoading" class="flex flex-col space-y-4">
    <!-- Title skeleton -->
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
  </div>
  <form v-else @submit.prevent="handleEdit" class="flex flex-col" action="">
    <!-- ----------------------Title------------------- -->

    <H-Textfield
      id="title"
      name="title"
      label="Badge name"
      placeholder="Title"
      type="text"
      v-model="title"
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
      name="badgeImage"
    ></CommonUploadSingleImage>

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
