<script setup>
const props = defineProps({
  content: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col space-y-6">
    <div class="border p-6 rounded-lg flex flex-col space-y-6">
      <p class="text-xl">{{ content.name }}</p>

      <!-- ------------------Add tag section---------------- -->

      <div class="flex space-x-6 items-center">
        <!---------------------------------Tag Name------------------------------------>
        <HTextfield
          name="name"
          id="name"
          type="text"
          placeholder="Icon Name"
          icon-leading-class="pl-28 lg:focus:border-sheger-gray-300"
        >
          <template #leading>
            <button
              class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-8 bg-gray-300"
            >
              <Icon name="heroicons:cloud-arrow-up" class="text-2xl" />
            </button>
          </template>
        </HTextfield>
        <button class="primary-button block bg-primary-600 lg:px-8 mb-1">
          <Icon
            name="mingcute:user-add-line"
            class="text-xl text-white"
            color=""
          />
          <span class="text-white">Add Add</span>
        </button>
      </div>
      <!-- --------------------Tag lists--------------------- -->

      <div class="flex flex-wrap gap-4">
        <div
          v-for="i in 10"
          :key="i"
          class="flex items-stretch rounded-full border pl-4"
        >
          <div class="flex gap-x-2 items-center self-start py-1.5">
            <Icon name="uil:coffee" class="text-xl" />
            <p class="primary-text">Breakfast</p>
          </div>

          <button class="border-x ml-4 mr-2">
            <Icon name="ic:round-edit" class="w-10" />
          </button>
          <button class="">
            <Icon name="uil:trash-alt" class="w-10" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
