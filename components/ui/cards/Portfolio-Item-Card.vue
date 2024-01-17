<script setup>
const emit = defineEmits([""]);
const props = defineProps({
  portfolio: {
    type: Object,
    required: true,
  },
});


// =========================Handlers=========================
const edit = () => {
  // Send a variable to the parent function
  emit("childEvent", props.portfolio);
};

const handleDelete = () => {
  console.log("portfolio");
  // console.log(props.portfolio, "portfolio");
  // Send a variable to the parent function
  emit("deleteEvent", props.portfolio.id);
};
</script>

<template>
  <div
    class="border p-5 py-8 flex flex-col gap-3 border-sheger-gray-300 rounded-lg"
  >
    <div class="text-lg font-medium">{{ portfolio.title }}</div>
    <div class="text-sheger-gray-100">{{ portfolio.description }}</div>
    <div class="text-sheger-gray-400 text-sm font-light">
      {{ portfolio.date }}
    </div>

    <div class="flex gap-5 overflow-x-scroll">
      <img
        v-for="(image, index) in portfolio.portfolioMedias"
        :key="index"
        :src="image?.media?.url"
        class="w-[181px] h-[229px] rounded-lg object-cover"
        alt=""
      />
    </div>

    <div class="flex justify-between px-5 w-[20rem]">
      <button
        @click="edit"
        class="bg-white-500 border-[1px] hover:bg-gray-200 text-black font-normal px-2 py-1 rounded"
      >
        <Icon name="material-symbols:edit" color="black" class="w-5 h-5" />
        Edit
      </button>
      <div
        @click="handleDelete"
        class="ml-2 bg-white-500 border-[1px] hover:bg-gray-100 text-black font-normal px-2 py-1 rounded cursor-pointer"
      >
        <Icon name="ph:trash" color="black" class="w-5 h-5" />
        Deleteee
      </div>
    </div>
  </div>
</template>
