<script setup>
const emit = defineEmits(["close", "deleteReview"]);
const deleteReview = () => {
  emit("deleteReview");
};
</script>

<template>
  <div
    class="iphone5:w-full iphone5:px-5 z-20 md:px-10 xl:max-w-sm xl:pt-6 mx-auto iphone5:my-5 md:mt-20 xl:mt-0 xl:relative"
  >
    <div class="flex items-center space-x-4">
      <Icon name="uil:trash-alt" class="text-3xl text-primary-600" />

      <p class="whitespace-nowrap text-3xl font-medium text-primary-600">
        Delete Review
      </p>
    </div>

    <p class="text-sheger_dark_gray-200 py-4">
      Are you sure you want to delete this review? After confirming this your
      review will be deleted forever.
    </p>

    <div class="flex justify-end space-x-8">
      <button
        @click="emit('close')"
        class="bg-sheger_brown-400 py-3 px-2 text-center block w-full rounded-md font-bold text-white"
      >
        Cancel
      </button>
      <button
        @click="deleteReview"
        class="border py-3 px-2 text-center block w-full rounded-md font-bold text-primary-600"
      >
        Delete
      </button>
    </div>
  </div>
</template>
