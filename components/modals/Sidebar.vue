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
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div
              class="pointer-events-none fixed inset-y-0 right-0 flex max-w-sm pl-10"
            >
              <HeadlessTransitionChild
                as="template"
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enter-from="translate-x-full"
                enter-to="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leave-from="translate-x-0"
                leave-to="translate-x-full"
              >
                <HeadlessDialogPanel
                  class="pointer-events-auto w-screen max-w-xs"
                >
                  <div
                    class="flex h-full flex-col overflow-y-scroll bg-white py-6 px-4 max-h-[48rem] shadow-xl dark:bg-sheger_brown-300"
                  >
                    <div>
                      <div class="flex items-center justify-between">
                        <div class="flex h-7 items-center">
                          <button
                            type="button"
                            class="relative text-gray-600 focus:outline-none focus:ring-0 focus:border-none"
                            @click="open = false"
                          >
                            <span class="absolute -inset-2.5" />
                            <span class="sr-only">Close panel</span>
                            <Icon
                              name="iconamoon:close-light"
                              class="text-2xl dark:text-white"
                            />
                          </button>
                        </div>
                        <HeadlessDialogTitle
                          as="h3"
                          class="flex-1 text-base font-semibold leading-6 text-gray-900"
                          ><slot name="Heading" />
                        </HeadlessDialogTitle>
                      </div>
                    </div>
                    <div class="relative mt-6 flex-1">
                      <!-- Your content -->
                      <slot name="Content" />
                    </div>
                  </div>
                </HeadlessDialogPanel>
              </HeadlessTransitionChild>
            </div>
          </div>
        </div>
      </HeadlessDialog>
    </HeadlessTransitionRoot>
  </ClientOnly>
</template>
