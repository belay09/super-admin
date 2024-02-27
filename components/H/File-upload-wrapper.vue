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
  thumbnails: {
    type: String,
  },
  emitSubmit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "update:thumbnails",
  "submitToDatabase",
]);

const { value: inputValue, errorMessage } = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});
const uploadedFiles = ref([]);
const openModal = ref(false);

watchEffect(() => {
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

const thumbnail = computed({
  get() {
    return props.thumbnails;
  },
  set(value) {
    emit("update:thumbnails", value);
  },
});

function submitToDatabase() {
  emit("submitToDatabase");
}
</script>
<template>
  <div>
    <ClientOnly>
      <HFileUploadModal
        :name="name"
        :rules="rules"
        :maxFileSize="maxFileSize"
        :fileLimit="fileLimit"
        :folder="folder"
        :accept="accept"
        :init="init"
        v-model="uploadedFiles"
        v-model:openModal="openModal"
        @uploadDone="uploadDone"
        :description="description"
      />
    </ClientOnly>

    <div class="flex flex-col items-center justify-center">
      <div
        v-if="!uploadedFiles.length"
        @click="openModal = true"
        class="flex flex-col items-center justify-center w-full gap-4 p-8 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer"
      >
        <Icon name="uil:cloud-upload" class="w-20 h-20" />
        <div class="flex flex-col mx-auto text-center input_field w-max">
          <div>
            {{ placeholder }} <span class="text-primary-600">Browse</span>
          </div>

          <div class="">Select images that are Square and 10MB</div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center w-full py-2 border-2 border-dashed rounded-md cursor-pointer h-fit"
      >
        <Suspense>
          <template #default>
            <div
              class="flex flex-col items-center justify-center w-full px-4 gap-y-4 h-fit"
            >
              <div
                v-for="(i, index) in uploadedFiles"
                :key="index"
                class="flex items-center justify-between w-full p-2"
                @click="thumbnail = i"
              >
                <div class="flex items-center gap-3">
                  <img
                    :src="i"
                    class="w-[50px] h-[50px] rounded-sm object-cover"
                    alt="file"
                  />
                  <div class="flex items-center gap-x-2">
                    <p class="text-lg font-medium">Image {{ index + 1 }}</p>
                    <span
                      v-if="thumbnail === i"
                      class="text-sm font-light text-primary-600"
                    >
                      <Icon class="text-2xl" name="icons8:checked" />
                    </span>
                  </div>
                </div>
                <!--progress -->

                <button type="button" @click.stop="removeFile(index)">
                  <Icon name="uil:trash-alt" class="w-6 h-6" />
                </button>
              </div>

              <div class="flex items-center gap-x-6">
                <button
                  type="button"
                  @click="openModal = true"
                  v-if="!disabled"
                  class="flex items-center px-3 py-1 transition-all duration-200 ease-in rounded-md border hover:bg-primary gap-x-2 group"
                >
                  <Icon
                    name="subway:round-arrow-1"
                    class="text-lg transition-all duration-200 ease-in group-hover:rotate-45"
                  />
                  Change
                </button>
                <button
                  type="button"
                  @click="submitToDatabase"
                  v-if="true"
                  class="flex items-center px-3 py-1 transition-all duration-200 ease-in rounded-md border hover:bg-primary gap-x-2 text-green-600 group"
                >
                  <Icon name="bx:upload" class="text-lg text-green-600" />
                  Submit
                </button>
              </div>
            </div>
          </template>
          <template #fallback>Loading . . . </template>
        </Suspense>
      </div>
      <small class="mt-2 text-red-600">{{ errorMessage }}</small>
    </div>
  </div>
</template>
