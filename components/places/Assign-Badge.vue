<script setup>
/**----------------------Imports-------------------------- */

import editPlaceMutation from "@/graphql/mutations/place/editPlace.gql";
import listQuery from "@/graphql/query/sheger-recommendations/list.gql";
import useNotify from "@/use/notify";

/**----------------------Globals-------------------------- */
const { notify } = useNotify();
const { handleSubmit, isSubmitting } = useForm({});
const emit = defineEmits(["close"]);
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/***---------------------recommendations badge data fetch--------------------- */
const sort = ref([{}]);
const recommendations = ref([]);
const limit = ref(20);
const offset = ref(0);
const filter = ref({});

const { onResult, onError, loading } = authListQuery(
  listQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.basicsShegerRecommendations) {
    recommendations.value = result.data.basicsShegerRecommendations;
  }
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-----------------------Handle assign badge--------------------------- */
const refetchPlaces = inject("refetch");
const recommendation = ref(null);
const {
  mutate: assignMutate,
  onDone: assignDone,
  onError: assignError,
  loading: assignLoading,
} = authMutation(editPlaceMutation);

const handleEdit = handleSubmit(() => {
  let input = {
    shegerRecommendationId: recommendation.value?.id,
  };
  assignMutate({ input, id: props.place.id });
});

assignDone(() => {
  refetchPlaces();
  notify({
    title: "Badge assigned successfully",
    description: "Badge assigned successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
  emit("close");
});

assignError((error) => {
  emit("close");
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
</script>

<template>
  <div class="grid grid-cols-2 gap-x-10">
    <form @submit.prevent="handleEdit" class="flex flex-col pt-8" action="">
      <!-- ----------------Add space or place type----- -->
      <H-SingleSelect
        name="badge"
        id="badge"
        label="Badge"
        :items="recommendations"
        v-model="recommendation"
        rules="required"
        :return-object="true"
        show-by="title"
      ></H-SingleSelect>

      <!-- ----------------------Submit------------------- -->
      <button
        :disabled="assignLoading"
        type="submit"
        class="primary-button bg-primary-600 secondary-border py-3 mt-4 text-white"
      >
        <span>Assign Sheger Badge</span>

        <Icon
          v-if="assignLoading"
          name="eos-icons:bubble-loading"
          class="text-3xl text-red-600"
        />
      </button>
    </form>

    <!-- ---------------------Selected Badge------------- -->
    <div v-if="recommendation" class="flex flex-col gap-y-2 pl-10 border-l">
      <p>
        {{ recommendation.description }}
      </p>

      <!-- ------------------Image section -->
      <img
        :src="recommendation?.shegerRecommendationBadge?.url"
        alt="ad-space-default image"
        class="w-[40%] object-cover object-center rounded-t-lg h-36 py-4"
      />
    </div>
  </div>
</template>
