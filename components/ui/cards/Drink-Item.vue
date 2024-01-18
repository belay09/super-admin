<script setup>
import deleteDrinkMutation from "@/graphql/mutations/drinks/delete.gql";
import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */

const { notify } = useNotify();
const emit = defineEmits(["onDeleted", "edit"]);
const props = defineProps({
  drink: {
    type: Object,
    required: true,
  },
});

/**------------------------Handle delete--------------------- */
const { mutate, onDone, onError, loading } = authMutation(deleteDrinkMutation);

function handleDelete() {
  mutate({
    id: props.drink.id,
  });
}
onDone((result) => {
  showConfirmationModal.value = false;
  emit("onDeleted");
  notify({
    title: "Success",
    description: "Drink  deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  z;
  showConfirmationModal.value = false;
  notify({
    title: "Error",
    description: error.message,
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
    sure-question="Are you sure you want to delete this drink ?"
    description="This action is irreversible and will permanently remove the drink and all associated data."
  ></ModalsConfirmation>
  <div class="rounded-lg border">
    <!-- --------------------Card body------------------------ -->
    <div class="flex items-center space-x-5 px-5">
      <!-- ------------------Image section -->
      <img
        :src="drink.media?.url"
        alt="ad-space-default image"
        class="w-[40%] object-cover object-center rounded-t-lg h-36 py-4"
      />

      <!-- ------------------Place name and logo------------------ -->
      <div class="flex flex-col space-y-4 w-[60%]">
        <p class="text-xl font-medium">{{ drink.title }}</p>
        <p class="">{{ drink.description }}</p>
        <p class="">ETB {{ drink.price }}</p>
      </div>
    </div>

    <!-- -------------------Card footer------------------------ -->
    <div class="grid grid-cols-2 px-10 py-4 gap-x-4 border-t">
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
