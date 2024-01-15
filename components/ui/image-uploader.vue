<script setup>
import { useAuthStore } from "@/stores/auth.js";
import UploadProfilePictureMutation from "@/graphql/mutations/file-upload/upload-profile-picture.gql";
import useNotify from "@/use/notify";

defineProps({
  modelValue: {
    type: String,
    default: undefined,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "close"]);
const { notify } = useNotify();
const authStore = useAuthStore();
const router = useRouter();
const handleLogin = () => {
  authStore.login();
  emit("close");
};

// Upload Profile Picture
const {
  mutate: uploadProfilePictureMutation,
  onDone: uploadProfilePictureDone,
  onError: uploadProfilePictureError,
  loading: uploadProfilePictureLoading,
} = anonymousMutation(UploadProfilePictureMutation);

uploadProfilePictureDone((result) => {
  console.log(result.data, "result.data");
  emit("update:modelValue", result.data?.uploadFiles.fileUrls[0]);
});

uploadProfilePictureError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

const uploadProfilePicture = (base64Image) => {
  uploadProfilePictureMutation({ base64Image });
};
</script>

<template>
  <div
    class="iphone5:w-full iphone5:px-5 z-20 md:px-10 lg:max-w-2xl lg:px-16 lg:pb-10 mx-auto iphone5:my-5 md:mt-20 lg:mt-0 lg:relative"
  >
    <div class="flex justify-between my-8">
      <div class="flex flex-col space-y-4">
        <p class="whitespace-nowrap lg:text-xl font-medium">
          {{ title }}
        </p>
        <p
          class="whitespace-nowrap font-medium text-sheger_brown-200 dark:text-sheger_light_gray-400"
        >
          {{ description }}
        </p>
      </div>
      <button class="self-start">
        <Icon
          @click="emit('close')"
          name="heroicons:x-mark-20-solid"
          class="text-2xl cursor-pointer"
        />
      </button>
    </div>
    <HFileUploadSingleImgCropper
      name="profile"
      @upload="uploadProfilePicture"
      :loading="uploadProfilePictureLoading"
    />
  </div>
</template>
