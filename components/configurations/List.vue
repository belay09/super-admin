<script setup>
const emit = defineEmits(["deleteItem", "editItem"]);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  hasIcon: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="flex flex-col space-y-6">
    <div class="border p-6 rounded-lg flex flex-col space-y-6">
      <div class="flex flex-wrap gap-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-stretch rounded-full border pl-4"
        >
          <div class="flex gap-x-2 items-center self-start py-1.5">
            <div v-if="hasIcon">
              <CommonSVG
                v-if="item?.icon?.lightIconUrl"
                :url="item?.icon?.lightIconUrl"
              ></CommonSVG>
              <Icon v-else name="mdi:null" class="text-xl" />
            </div>
            <p class="primary-text">{{ item.title }}</p>
          </div>

          <button @click="emit('editItem', item)" class="border-x ml-4 mr-2">
            <Icon name="ic:round-edit" class="w-10" />
          </button>
          <button @click="emit('deleteItem', item.id)" class="">
            <Icon name="uil:trash-alt" class="w-10" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
