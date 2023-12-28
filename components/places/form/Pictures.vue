<script setup>
const images = ref([
  {
    url: "/images/temporary/default-food-image.png",
  },
  {
    url: "/images/temporary/default-food-image.png",
  },
  {
    url: "/images/temporary/default-food-image.png",
  },
]);
</script>

<template>
  <div class="flex flex-col justify-between">
    <!----------------------------------------Image Upload---------------------------------------->
    <div
      class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg p-8"
    >
      <Icon name="uil:cloud-upload" class="w-20 h-20" />
      <div class="input_field flex flex-col w-max mx-auto text-center">
        <label>
          <input
            class="text-sm cursor-pointer w-36 hidden"
            type="file"
            accept="image/*"
            multiple
          />
          <div>
            Drag and drop here or
            <span class="text-primary-600">Browse</span>
          </div>
        </label>

        <div class="">Select images that are Square and 10MB</div>
      </div>
    </div>

    <!-----------------------------Image Galay-------------------------------->
    <div class="grid grid-cols-4 gap-4 my-6">
      <img v-for="image in images" :src="image.url" class="w-[390px]" />
    </div>
    <div class="mt-5">
      <HPaginate
        v-model:offset="offset"
        :items-per-page="8"
        :total-data="79"
      />
    </div>
  </div>
</template>
