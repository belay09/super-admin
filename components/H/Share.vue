<script setup>
import { useClipboard } from "@vueuse/core";
import { Icon } from "@iconify/vue";
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
    required: true,
  },
  url: {
    type: String,
    default: "",
    required: true,
  },
  text: {
    type: String,
    default: "",
    required: true,
  },
});

props.url = encodeURIComponent(props.url);

const { copy, copied } = useClipboard();
const responseMessage = computed(() => {
  return copied.value ? "Copied" : ".";
});
const pageUrl = ref("x");
const emits = defineEmits(["closeShareModal"]);

const closeDialog = () => {
  emits("closeShareModal");
};

onMounted(() => {
  pageUrl.value = `${window.location.href}`;
  pageUrl.value = pageUrl.value.split("?")[0];
});
</script>

<template>
  <h-modal
    v-model="props.modelValue"
    class="mx-auto w-full md:w-1/3 rounded-none"
  >
    <template v-slot>
      <div class="p-4 md:p-7 dark:bg-secondary-dark-2">
        <div class="flex justify-between items-center mb-4">
          <p
            class="text-base md:text-lg font-body text-primary-500 dark:text-secondary-8"
          >
            Share
          </p>
          <button
            class="hover:bg-primary-4 dark:hover:bg-primary-lite p-2 rounded-md"
            @click="closeDialog"
          >
            <Icon icon="material-symbols:close" class="w-7 h-7 hover:text-red-500 dark:text-white dark:hover:text-red-500" />
          </button>
        </div>
        <div class="flex justify-around items-center mt-4">
          <a
            :href="`https://t.me/share/url?url=${pageUrl}${props.url}&text=${props.text}`"
            target="_blank"
            class="flex flex-col gap-3 cursor-pointer items-center text-center"
            aria-label="social link"
          >
            <Icon icon="logos:telegram" class="w-10 h-10" />
            <p
              class="text-secondary-dark dark:text-white text-xs md:text-base"
            >
              Telegram
            </p>
          </a>
          <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}${props.url}`"
            target="_blank"
            class="flex flex-col gap-3 cursor-pointer items-center text-center"
            aria-label="social link"
          >
            <Icon icon="logos:facebook" class="w-10 h-10" />
            <p
              class="text-secondary-dark dark:text-white text-xs md:text-base"
            >
              Facebook
            </p>
          </a>
          <a
            :href="`https://twitter.com/intent/tweet?url=${pageUrl}${props.url}&text=${props.text}`"
            target="_blank"
            class="flex flex-col gap-3 cursor-pointer items-center text-center"
            aria-label="social link"
          >
          <Icon icon="akar-icons:x-fill" class="w-10 h-10 dark:text-white" />
            <p
              class="text-secondary-dark dark:text-white text-xs md:text-base"
            >
              X
            </p>
          </a>
          <a
            :href="`https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}${props.url}`"
            target="_blank"
            class="flex flex-col gap-3 cursor-pointer items-center text-center"
            aria-label="social link"
          >
            <Icon icon="skill-icons:linkedin" class="w-10 h-10 " />
            <p
              class="text-secondary-dark dark:text-white text-xs md:text-base"
            >
              LinkedIn
            </p>
          </a>
        </div>
        <div
          :title="pageUrl + props.url"
          @click="copy(`${pageUrl}${props.url}`)"
          class="hover:cursor-pointer m-auto border-[1px] md:border-2 mt-8 md:mt-9 border-secondary-6/10 dark:border-secondary-6 p-2 md:p-3 w-11/12 md:w-3/4 flex justify-between items-center text-center"
        >
          <p
            class="text-secondary-5 truncate dark:text-white text-sm md:text-base"
          >
            {{ pageUrl }}{{ props.url }}
          </p>
          <button
            class="hover:bg-primary-4 dark:hover:bg-primary-lite p-2 rounded-md"
          >
            <Icon icon="ant-design:copy-outlined" class="w-5 h-5 dark:text-white" />
          </button>
        </div>
        <div class="w-full text-center mt-4">
          <p class="text-xs text-primary dark:text-white">{{ responseMessage }}</p>
        </div>
      </div>
    </template>
  </h-modal>
</template>
