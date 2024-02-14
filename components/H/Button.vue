<script setup>
const props = defineProps({
  inputClass: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  disabledClass: {
    type: String,
    default: "",
  },
  textClass: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  router: {
    type: Boolean,
    default: false,
  },
  to: {
    type: String,
    default: "",
  },
});
watch(
  () => props.disabled,
  (newVal) => {
    console.log(newVal);
  }
);
const emits = defineEmits(["click"]);
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      disabled? disabledClass: inputClass?inputClass:props.class

    ]"
    @click="emits('click')"
  >
    <slot name="leadingIcon"></slot>
    <div :textClass="textClass">{{ name }}</div>
    <slot name="tralingIcon"></slot>
  </button>
</template>
