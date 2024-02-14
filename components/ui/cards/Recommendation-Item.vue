<script setup>
import deleteMutation from "@/graphql/mutations/configurations/recommendations/delete.gql";
import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */

const { notify } = useNotify();
const emit = defineEmits(["onDeleted", "edit"]);
const props = defineProps({
  recommendation: {
    type: Object,
    required: true,
  },
});

/**------------------------Handle delete--------------------- */
const { mutate, onDone, onError, loading } = authMutation(deleteMutation);

function handleDelete() {
  mutate({
    id: props.recommendation.id,
  });
}
onDone((result) => {
  showConfirmationModal.value = false;
  emit("onDeleted");
  notify({
    title: "Success",
    description: "Badge  deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  showConfirmationModal.value = false;
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

// confirmation modal
const showConfirmationModal = ref(false);
</script>

<template>
  <ModalsConfirmation
    @confirm="handleDelete"
    v-model="showConfirmationModal"
    title="Delete Sponsored Drink"
    sure-question="Are you sure you want to delete this badge ?"
    description="This action is irreversible and will permanently remove the badge and all associated data."
  ></ModalsConfirmation>
  <div class="rounded-lg border">
    <!-- --------------------Card body------------------------ -->
    <div class="flex items-center space-x-5 px-12">
      <!-- ------------------Image section -->
      <img
        :src="recommendation?.shegerRecommendationBadge?.url"
        alt="ad-space-default image"
        class="w-[40%] object-cover object-center rounded-t-lg h-36 py-4"
      />

      <!-- ------------------Place name and logo------------------ -->
      <div class="flex flex-col space-y-4 w-[60%] py-6">
        <p class="text-xl font-medium">{{ recommendation.title }}</p>
        <p class="">{{ recommendation.description }}</p>
      </div>
    </div>

    <!-- -------------------Card footer------------------------ -->
    <div class="grid grid-cols-2 px-12 py-4 gap-x-4 border-t">
      <!-- ------------------Edit ad space---------------- -->
      <button
        @click="emit('edit')"
        class="primary-button border justify-center secondary-text"
      >
        <Icon name="ic:round-edit" class="text-xl"></Icon>
        <span> Edit</span>
      </button>

      <!-- ------------------Delete ad space---------------- -->
      <button
        @click="showConfirmationModal = true"
        class="primary-button border justify-center secondary-text"
      >
        <Icon name="uil:trash-alt" class="text-xl"></Icon>
        <span> Delete</span>
        <Icon
          v-if="loading"
          name="eos-icons:bubble-loading"
          class="text-3xl text-red-600"
        />
      </button>
    </div>
  </div>
</template>
