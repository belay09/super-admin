<script setup>
const emit = defineEmits(["deleteItem", "editItem", "addItem"]);

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  hasIcon: {
    type: Boolean,
    default: false,
  },
  isAdd: {
    type: Boolean,
    default: true,
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
              <img
                :src="item?.icon?.lightIconUrl"
                width="35"
                v-if="item?.icon?.lightIconUrl"
              />
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
        <button @click="emit('addItem')" v-if="!isAdd">
          <Icon
            name="icon-park-outline:add-one"
            class="text-3xl text-primary-600"
          />
        </button>
      </div>
    </div>
  </div>
</template>
