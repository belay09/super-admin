<script setup>
const props = defineProps({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  imageClass: {
    type: String,
    required: false,
  },

  containerClass: {
    type: String,
    required: false,
  },
  harassment: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
<template>
  <div class="w-3/4 py-3">
    <div class="flex justify-between">
      <div class="flex space-x-4">
        <div class="bg-primary-100 p-[1px] rounded-full my-auto">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="user image"
            class="w-10 h-10 rounded-full"
          />
        </div>
        <div class="felx-col ml-2">
          <h1 class="text-lg capitalize">yonas bekele</h1>
          <h1 class="text-sm capitalize text-gray-500">23 sep,2023</h1>
        </div>
      </div>
      <div v-if="harassment" class="flex">
        <div class="mr-2 flex gap-2 border-[1px] items-center px-2 rounded-3xl">
          <Icon
            name="carbon:flag-filled"
            color="red"
            width="20"
            height="20"
          ></Icon>
          <h1 class="text-sm capitalize text-gray-700">harassment</h1>
        </div>
        <button class="flex gap-3 items-center l">
          <Icon
            name="charm:menu-kebab"
            color="black"
            width="20"
            height="20"
          ></Icon>
        </button>
      </div>
    </div>
    <div class="py-4 flex items-center gap-2">
      <HRating image-class="w-6" :rating="4" :readonly="true" />
      <h1 class="text-sm">(4/5)</h1>
    </div>
    <div>
      <p class="text-sm capitalize text-sheger-gray-100">
        'I'm always happy with new developments,' he commented. Stuart commented
        that this was very true. He made his comments at a news conference in
        Amsterdam.
      </p>
    </div>
  </div>
</template>
