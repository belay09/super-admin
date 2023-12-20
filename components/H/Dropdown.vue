<script setup>
const emit = defineEmits(["update:modelValue", "showItemsState"]);
const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: [String, Number, Object, Boolean],
    required: true,
  },
  showItems: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const toggleView = inject("toggleView");

const selecetItem = (item) => {
  emit("update:modelValue", item.id);
};

const handleShowItems = () => {
  toggleView();
  if (props.showItems) {
    emit("update:modelValue");
  }
};
</script>

<template>
  <div class="flex flex-col space-y-8">
    <button
      @click="handleShowItems"
      class="flex justify-between items-center w-full"
    >
      <p class="text-xl text-sheger_dark_gray-100 dark:text-white">
        {{ name }}
      </p>
      <Icon
        :class="[
          showItems
            ? 'transform rotate-180 text-primary-600'
            : 'text-black dark:text-white',
        ]"
        class="text-2xl transition duration-150 ease-in-out"
        name="heroicons:chevron-down-20-solid"
      ></Icon>
    </button>

    <ul v-show="showItems">
      <li
        v-for="item in items"
        :key="item.name"
        class="flex flex-col space-y-6 cursor-pointer"
      >
        <button
          @click="selecetItem(item)"
          :class="[
            modelValue == item.id
              ? 'bg-gray-50 dark:bg-transparent'
              : 'hover:bg-gray dark:hover:bg-transparent',
            'block rounded-md py-3 pr-2 pl-9  text-gray-700',
          ]"
          class="flex justify-between items-center w-full"
        >
          <p
            class="text-lg text-sheger_brown-200 dark:text-sheger_light_gray-400"
          >
            {{ item.name }}
          </p>
          <Icon
            v-show="modelValue == item.id"
            class="text-xl transition duration-150 ease-in-out text-primary-600"
            name="bi:check2"
          ></Icon>
        </button>
      </li>
    </ul>
  </div>
</template>
