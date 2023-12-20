<script setup>
const emits = defineEmits(["update:modelValue", "confirm"]);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "",
  },
  autoClose: {
    type: Boolean,
    default: true,
  },
  overflowVisible: {
    type: Boolean,
    default: true,
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
    <HeadlessTransitionRoot as="template" :show="open">
      <HeadlessDialog
        as="div"
        class="relative z-50"
        @close="autoClose ? (open = false) : ''"
      >
        <HeadlessTransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div
            class="fixed z-50 inset-0 bg-gray-500 bg-opacity-20 transition-opacity"
          />
        </HeadlessTransitionChild>

        <div
          class="fixed inset-0 z-50 overflow-y-auto dark:bg-sheger_brown-300"
        >
          <div
            class="flex min-h-full items-end justify-center pt-4 text-center sm:items-center sm:p-0"
          >
            <HeadlessTransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-24 sm:translate-y-0 sm:scale-95"
            >
              <HeadlessDialogPanel
                class="relative z-50 transform rounded-lg bg-white text-left transition-all min-w-[100vw] lg:min-w-[auto] sm:my-8 sm:max-w-4xl dark:bg-sheger_brown-100"
                :class="
                  overflowVisible ? 'overflow-visible' : 'overflow-hidden '
                "
              >
                <slot name="content" />
              </HeadlessDialogPanel>
            </HeadlessTransitionChild>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </ClientOnly>
</template>
