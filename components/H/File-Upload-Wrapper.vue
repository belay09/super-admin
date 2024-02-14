<script setup>
import { useField } from "vee-validate";
// import { getVideoThumbnail } from "video-thumbnails";

const props = defineProps({
  modelValue: {
    type: [Array, String, Object],
  },
  init: {
    type: [Array, String, Object],
  },
  name: {
    type: String,
  },
  rules: {
    type: [String, Object],
    default: "",
    required: false,
  },
  maxFileSize: {
    type: Number,
  },
  fileLimit: {
    type: Number,
  },
  folder: {
    type: String,
  },
  accept: {
    type: String,
  },
  description: {
    type: String,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showStar: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "Choose file",
  },
});

const emit = defineEmits(["update:modelValue"]);

const { value: inputValue, errorMessage } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});
const uploadedFiles = ref([]);
const openModal = ref(false);
onMounted(() => {
  if (props.init) {
    uploadedFiles.value = props.init;
  }
});

watch(
  () => uploadedFiles.value,
  (newVal) => {
    inputValue.value = newVal;
    emit("update:modelValue", newVal);
  }
);

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
};

function uploadDone() {}
</script>
<template>
  <div>
    <ClientOnly>
      <HModal
        :name="name"
        :rules="rules"
        :maxFileSize="maxFileSize"
        :fileLimit="fileLimit"
        :folder="folder"
        :accept="accept"
        v-model="uploadedFiles"
        v-model:openModal="openModal"
        @uploadDone="uploadDone"
        :description="description"
      />
    </ClientOnly>

    <div class="flex flex-col items-center justify-center">
      <div
        v-if="!uploadedFiles.length"
        class="flex flex-col items-center justify-center w-full py-5 pb-10 border-2 border-dashed rounded-md"
        :class="[
          errorMessage ? 'border-red-600' : 'border-gray-300',
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer',
        ]"
        @click="openModal = true"
      >
        <Icon name="ion:image-outline" class="text-5xl" />
        <p class="relative px-5 pt-3 text-center w-fit text-new-tale">
          {{ placeholder }}
          <span
            v-if="props.showStar"
            class="absolute text-red-600 right-2 top-3"
            >*</span
          >
        </p>
      </div>
      <div
        v-else
        class="flex flex-col items-center justify-center w-full py-2 border-2 border-dashed rounded-md cursor-pointer h-fit"
      >
        <Suspense>
          <template #default>
            <div
              class="flex flex-col items-center justify-center gap-y-3 h-fit"
            >
              <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div
                  v-for="(i, index) in uploadedFiles"
                  class="flex flex-wrap items-center justify-center w-full h-fit"
                  :class="uploadedFiles.length < 2 ? 'md:col-span-2' : ''"
                >
                  <div class="relative">
                    <div
                      v-if="!disabled"
                      class="absolute top-0 flex items-center justify-center bg-white rounded-full cursor-pointer w-fit h-fit right-1"
                    >
                      <Icon
                        name="carbon:close-outline"
                        width="25"
                        height="25"
                        @click="removeFile(index)"
                      />
                    </div>

                    <img
                      :src="i"
                      class="object-cover w-full max-h-[200px]"
                      v-if="
                        ['jpeg', 'png', 'jpg', 'svg'].includes(
                          i?.match(/\.([^.]+)$/)[1].toLowerCase()
                        )
                      "
                      alt="uploaded image"
                    />
                    <object
                      :data="i"
                      class="object-cover w-full"
                      type="application/pdf"
                      v-if="
                        ['pdf'].includes(
                          i?.match(/\.([^.]+)$/)[1].toLowerCase()
                        )
                      "
                    />
                  </div>
                </div>
              </div>
              <button
                type="button"
                @click="openModal = true"
                v-if="!disabled"
                class="flex items-center px-3 py-1 transition-all duration-200 ease-in rounded-md ring-1 ring-primary-600 hover:bg-primary gap-x-2 text-primary-600 group"
              >
                <Icon
                  name="subway:round-arrow-1"
                  class="text-lg transition-all duration-200 ease-in group-hover:rotate-45 text-primary-600"
                />
                {{ uploadedFiles.length < fileLimit ? "Add" : "Change" }}
              </button>
            </div>
          </template>
          <template #fallback>Loading . . . </template>
        </Suspense>
      </div>
      <small class="mt-2 text-red-600">{{ errorMessage }}</small>
    </div>
  </div>
</template>
