<script setup>
import uploadMutation from "@/graphql/mutations/file-upload/upload.gql";
import useNotify from "@/use/notify";

/**-----------------------Global variables----------------------- */
const { notify } = useNotify();
const emit = defineEmits(["update:modelValue", "uploadDone", "close"]);
const props = defineProps({
  folder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
});
const showUploadImageModal = ref(true);
const {
  mutate: uploadMutate,
  onDone: uploadDone,
  onError: uploadError,
  loading: uploadLoading,
} = authMutation(uploadMutation);

uploadDone((result) => {
  if (result.data) {
    emit("update:modelValue", result.data?.uploadFiles.fileUrls[0]);
    console.log(result.data?.uploadFiles.fileUrls[0]);
    emit("uploadDone", result.data?.uploadFiles.fileUrls[0]);
    showUploadImageModal.value = false;
    emit("close");
  }
});

uploadError((error) => {
  showUploadImageModal.value = false;
  emit("close");
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

function uploadImage(image) {
  uploadMutate({ base64Image: image, folder: "shegergebeta" + props.folder });
}

onUnmounted(function () {
  showUploadImageModal.value = true;
});

const test = ref(true);
// modal
</script>

<template>
  <ModalsModal v-model="test">
    <template #content>
      <div class="">
        <HFileUploadSingleImg
          name="upload"
          @upload="uploadImage"
          :loading="uploadLoading"
          :allowed-types="['image/svg+xml']"
          file-types-message="Select SVG only images and < 10MB"
        />
      </div>

      <div class="flex justify-center space-x-10 py-5">
        <button
          @click="crop"
          class="flex items-center justify-center space-x-2 py-2 px-5 w-full bg-primary-600 bg-opacity-20 text-white rounded-md"
        >
          Add Icon
        </button>
      </div>
    </template>
  </ModalsModal>
</template>
