<script setup>
import uploadMutation from "@/graphql/mutations/file-upload/upload.gql";
import useNotify from "@/use/notify";
import { useField } from "vee-validate";

/**-----------------------Global variables----------------------- */
const { notify } = useNotify();
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  folder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },

  name: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: "props.modelValue",
});

const base64Image = ref(null);
const isUploaded = ref(false);
const isError = ref(false);

const isImageSelected = computed(() => {
  return props.modelValue != "" || base64Image.value;
});

const selectedImage = computed(() => {
  return props.modelValue != "" ? props.modelValue : base64Image.value;
});

const deleteImage = () => {
  isUploaded.value = false;
  isError.value = false;
  base64Image.value = null;
  inputValue.value = null;
  emit("update:modelValue", "");
};

const {
  mutate: uploadMutate,
  onDone: uploadDone,
  onError: uploadError,
  loading: uploadLoading,
} = authMutation(uploadMutation);

uploadDone((result) => {
  isUploaded.value = true;
  isError.value = false;
  emit("update:modelValue", result.data?.uploadFiles.fileUrls[0]);
});

uploadError((error) => {
  isError.value = true;
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

function uploadImage(image) {
  isError.value = false;
  showUploadImageModal.value = false;
  base64Image.value = image;
  inputValue.value = image;
  uploadMutate({ base64Image: image, folder: "shegergebeta" + props.folder });
}

// modal
const showUploadImageModal = ref(false);
</script>

<template>
  <ModalsModal v-model="showUploadImageModal" :show-close="true">
    <template #content>
      <div class="flex items-center justify-between pb-5">
        <p class="text-xl font-medium">Upload Image</p>
        <button type="button" @click="showUploadImageModal = false">
          <Icon name="heroicons:x-mark-20-solid" class="text-2xl" />
        </button>
      </div>

      <HFileUploadSingleImgCropper
        name="upload"
        @upload="uploadImage"
        :loading="uploadLoading"
      />
    </template>
  </ModalsModal>
  <div>
    <div class="flex flex-col space-y-4 border rounded-lg p-6">
      <div class="flex justify-between">
        <p class="font-medium">Uploaded file</p>

        <button
          @click="showUploadImageModal = true"
          type="button"
          class="flex space-x-2 items-center border rounded-md p-2"
        >
          <Icon name="heroicons:cloud-arrow-up" class="text-2xl" />
          <p>Upload</p>
        </button>
      </div>
      <div
        v-if="isImageSelected && !isError"
        class="flex items-center space-x-6"
      >
        <img
          class="w-16 h-16 object-center"
          :src="selectedImage"
          alt="My Image"
        />
        <H-LoadingBar v-if="uploadLoading" />
        <p v-if="true" class="w-[200px] h-1 bg-primary-600"></p>
        <button @click="deleteImage">
          <Icon name="heroicons:x-mark-20-solid" class="text-2xl" />
        </button>
      </div>
      <p class="secondary-text text-center" v-else>No image is selected</p>
    </div>
    <p
      :visible="errorMessage"
      class="mt-1 text-sm text-red-500 font-body"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
