<script setup>
import mutator from "@/composables/auth-mutation";
import UploadProfilePictureMutation from "@/graphql/mutations/file-upload/upload.gql";

const imageUrls = ref("");
const base64File = ref("");
const uploading = ref(false);
const { resetForm } = useForm({});
const props = defineProps({
  modelValue: {
    type: String,
  },
  reset: {
    type: Boolean,
  },
});
const emit = defineEmits(["update:modelValue", "upload", "select"]);
watchEffect(() => {
  imageUrls.value = props.modelValue;
  emit("update:modelValue", imageUrls.value);
});
watch(
  () => props.reset,
  (newAction) => {
    // Execute a function based on the new action
    console.log("reset is trigured------------");
    resetForm();
    console.log("reset is trigured------------");

    imageUrls.value = "";
  }
);

function uploadFile(value) {
  console.log("file upload start");
  let file = value.split(";")[1];
  console.log("file", file);
  uploadID({
    base64Image: file,
    folder: "sheger",
  });
}
const {
  mutate: uploadID,
  loading: uploadingId,
  onDone: uploadDone,
  onError: idUploadError,
} = mutator(UploadProfilePictureMutation);
idUploadError((error) => {
  uploading.value = false;
});
uploadDone(({ data }) => {
  const fileUrls = data.uploadFiles.fileUrls;
  if (Array.isArray(fileUrls) && fileUrls.length > 0) {
    const newUrls = fileUrls.map((url) => {
      // console.log("URL:", url);
      return url;
    });
    console.log("fileUrls", newUrls[0]);
    // Add new URLs to the existing imageUrls array
    imageUrls.value = newUrls[0];

    emit("update:modelValue", newUrls[0]);
  }
});
</script>
<template>
  <div>
    <div class="flex items-center gap-x-1">
      <CommonFileUpload
        name="log"
        file-type="image"
        v-model="base64File"
        :uploaded="modelValue"
        image-class="w-[300px] h-[300px]"
        @upload="uploadFile"
        :crop-max-hight="10000"
        :crop-max-width="10000"
        rules="required"
        :loading="uploadingId"
      ></CommonFileUpload>
      <div class="space-y-2">
        <p class="text-base font-medium">Upload Profile Picture</p>
        <p class="text-sm text-gray-500">Select a picture that is max(10MB)</p>
      </div>
    </div>
  </div>
</template>
