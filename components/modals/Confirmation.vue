<script setup>
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: String,
    default: "ph:seal-check-fill",
  },
  iconWrapperClass: {
    type: String,
    default:
      "mx-auto flex h-12 w-12 flex-shrink-0 items-center text-green-600 justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10",
  },
  iconClass: {
    type: String,
    default: "h-8 w-8 text-green-600",
  },
  title: {
    type: String,
    default: "",
  },
  sureQuestion: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  confirmButton: {
    type: String,
    default: "Confirm",
  },
  confirmButtonClass: {
    type: String,
    default:
      "inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto",
  },
});

const open = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emits("update:modelValue", newVal);
  },
});
</script>
<template>
  <ClientOnly>
    <TransitionRoot as="template" :show="open">
      <Dialog
        as="div"
        class="relative z-[200]"
        @close="autoClose ? (open = false) : ''"
      >
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
            class="fixed inset-0 bg-gray-500 bg-opacity-20 transition-opacity"
          />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div class="flex flex-col space-y-4">
                  <div class="flex items-center justify-between">
                    <!-- title -->
                    <div class="flex items-center space-x-3 text-primary-600">
                      <Icon
                        :name="icon"
                        :class="iconClass"
                        class="text-primary-600"
                      />
                      <DialogTitle
                        as="h3"
                        class="text-base font-semibold leading-6"
                        >{{ title }}</DialogTitle
                      >
                    </div>

                    <!-- Close button -->
                    <button
                      type="button"
                      class="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-0"
                      @click="open = false"
                    >
                      <Icon
                        name="ion:close-outline"
                        width="25"
                        height="25"
                        class="h-6 w-6"
                      />
                    </button>
                  </div>
                  <h3 v-if="sureQuestion !== ''" class="font-medium">
                    {{ sureQuestion }}
                  </h3>
                  <p v-if="description !== ''" class="secondary-text">
                    {{ description }}
                  </p>
                  <div class="secondary-flex-row justify-between w-full">
                    <button
                      @click="open = false"
                      class="primary-button block bg-primary-600 w-full text-white"
                    >
                      <span class="">Cancel</span>
                    </button>
                    <button
                      @click="emits('confirm')"
                      class="primary-button block secondary-border w-full"
                    >
                      <span class="">Confirm</span>
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </ClientOnly>
</template>
