<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-[100]">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full p-0 items-center justify-center  text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 "
          >
            <DialogPanel
              :class="[
                wrapperClass ||
                  'relative transform  overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[60vw] sm:p-0',
              ]"
            >
              <slot name="ModalContent" />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const props = defineProps({
  modelValue: [String, Boolean],
  wrapperClass: String,
});
const emits = defineEmits(["update:modelValue"]);

const open = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emits("update:modelValue", val);
  },
});
// const open = ref(props.modelValue);
</script>