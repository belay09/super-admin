<script setup>
const props = defineProps({
  label: {
    type: String,
  },
  class: String,
  btnClass: String,
  trailingIcon: String,
});
const emit = defineEmits(["click"]);

const emitClick = () => {
  emit("click");
};
</script>

<template>
  <div>
    <span
      :class="class"
      class="px-4 py-1 rounded-full text-black bg-primary-600-2 font-semibold text-sm flex items-center align-center w-max cursor-pointer active:bg-gray-300 transition duration-300 ease"
    >
      {{ label }}
      <button
        type="button"
        :class="btnClass"
        class="bg-transparent hover focus:outline-none"
        @click="emitClick"
      >
        <div v-if="trailingIcon" class="">
          <Icon
            :name="trailingIcon"
            class="text-black ml-2 hover:scale-125 duration-200"
            size="25"
          ></Icon>
        </div>
        <div v-else>
          <Icon
            name="typcn:delete"
            class="ml-2 hover:scale-125 duration-200"
            size="25"
          />
        </div>
      </button>
    </span>
  </div>
</template>
