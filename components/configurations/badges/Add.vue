<script setup>
import addMutation from "@/graphql/mutations/configurations/recommendations/add.gql";
import useNotify from "@/use/notify";
const { notify } = useNotify();
const emit = defineEmits(["add"]);
const { handleSubmit, isSubmitting } = useForm({});

const title = ref("");
const description = ref("");
const url = ref("");

/**-----------------------Handle add --------------------------- */
const { mutate, onDone, onError, loading } = authMutation(addMutation);

const handleAdd = handleSubmit(() => {
  let input = {
    description: description.value,
    title: title.value,
    shegerRecommendationBadge: {
      data: {
        url: url.value,
      },
    },
  };
  mutate({ input });
});

onDone(() => {
  emit("add");
  notify({
    title: "Badge added successfully",
    description: "Badge added successfully",
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
  <form @submit.prevent="handleAdd" class="flex flex-col" action="">
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
      <span>Add</span>
      <Icon name="heroicons:plus-small-solid" class="text-2xl"></Icon>
      <Icon
        v-if="loading"
        name="eos-icons:bubble-loading"
        class="text-3xl text-red-600"
      />
    </button>
  </form>
</template>
