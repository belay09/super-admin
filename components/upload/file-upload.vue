<script setup>
import { useField } from "vee-validate";
import { Cropper, CircleStencil, RectangleStencil } from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
const emit = defineEmits(["update:modelValue", "upload", "select"]);
const props = defineProps({
  modelValue: {
    type: [Array, Object, String],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  uploaded: {
    type: [Array, Object, String],
  },
  cropperClass: {
    type: String,
    default: "",
  },
  cropMaxWidth: {
    type: Number,
    default: 1100,
  },
  cropMaxHight: {
    type: Number,
    default: 1100,
  },
  cropMinWidth: {
    type: Number,
    default: 100,
  },
  cropMinHight: {
    type: Number,
    default: 100,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxFileSize: {
    type: Number,
    required: false,
    default: 10485760, // In byte
  },
  inputClass: {
    type: String,
    default: "",
    required: false,
  },
  imageClass: {
    type: String,
    default: "",
  },
  stencilComponent: {
    type: String,
    default: "rectangle",
  },
  name: {
    type: String,
    default: undefined,
    required: true,
  },
  fileType: {
    type: String,
    default: "image",
    required: false,
  },
  fileTypesMessage: {
    type: String,
    default: "PNG, JPG, GIF, upto 10MB",
    required: false,
  },
  rules: {
    type: String,
    default: "required",
    required: false,
  },
  text: { type: String },
  fileTypes: { type: String },
  wrapperClass: String,
});

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.uploaded,
});
const errorMessage2 = ref("");
const fileInput = ref(null);
const files = ref([]);
const type = ref("");
const base64Files = ref([]);
const base64String = ref("/*");
const fileInfo = ref({});
const open = () => {
  fileInput.value.click();
};
function getFileSize(bytes) {
  if (bytes === 0) {
    return "0 B";
  }

  let k = 1000,
    dm = 1,
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}
const onFileSelect = async (event) => {
  errorMessage.value = "";
  event.preventDefault();
  let _files = event.dataTransfer
    ? event.dataTransfer.files
    : event.target.files;

  for (let file of _files) {
    file.objectURL = window.URL.createObjectURL(file);
    fileInfo.value.name = file.name;
    fileInfo.value.size = getFileSize(file.size);
    fileInfo.value.type = file.type;
    console.log(file.type);
    if (props.fileType == "pdf") {
      if (file.type != "application/pdf") {
        errorMessage2.value = "Please upload a pdf file";
        return;
      }
    } else {
      if (
        file.type != "image/jpeg" &&
        file.type != "image/png" &&
        file.type != "image/gif" &&
        file.type != "image/jpg" &&
        file.type != "image/svg+xml"
      ) {
        errorMessage2.value = "Please upload a image file";
        return;
      }
    }

    if (file.size > props.maxFileSize) {
      errorMessage2.value = "Please, upload a file less than 10 MB";
      return;
    }

    errorMessage2.value = "";

    createImage(file);
    files.value[0] = file;
  }
  openModal.value = true;
};

function createImage(file) {
  var reader = new FileReader();
  reader.onload = (e) => {
    base64Files.value[0] = e.target.result;
    // props.modelValue = base64Files.value[0];
    console.log(base64Files.value[0]);
    if (props.fileType = "image") {
      type.value = getMimeType(e.target.result, "image/jpeg");
      emit("upload", base64Files.value[0]);
    } else {
      type.value = getMimeType(e.target.result, "application/pdf");
    }
  };
  reader.readAsDataURL(file);
}
const handleDragOver = (event) => {
  event.preventDefault();
};

watch(
  () => props.modelValue,
  (newVal) => {
    // inputValue.value = newVal;
  }
);
watch(
  () => props.uploaded,
  (newVal) => {
    inputValue.value = newVal;
  }
);
const openModal = ref(false);
function getMimeType(file, fallback = null) {
  const byteArray = new Uint8Array(file).subarray(0, 4);
  let header = "";
  for (let i = 0; i < byteArray.length; i++) {
    header += byteArray[i].toString(16);
  }
  switch (header) {
    case "89504e47":
      return "image/png";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
      return "image/jpeg";
    default:
      return fallback;
  }
}
function change({ coordinates, image, visibleArea, canvas }) {
  canvas.toBlob((blob) => {
    const reader = new FileReader();
    reader.onload = () => {
      base64String.value = reader.result; // This is the base64-encoded string

      // You can now do something with the base64 string, like uploading it to a server or using it in your application.
    };

    reader.readAsDataURL(blob);
    // Do something with blob: upload to a server, download and etc.
  }, type.value);
}
const crop = () => {
  openModal.value = false;
  emit("upload", base64String.value);
};
</script>
<template>
  <!-- <CommonModal :modelValue="openModal">
    <template #content>
      :maxWidth="cropMaxWidth"
        :maxHeight="cropMaxHight"
      <cropper
        :class="['h-[600px] w-[600px] bg-slate-100', props.cropperClass]"
        :src="files[0].objectURL"
        :stencil-component="
          stencilComponent == 'rectangle' ? RectangleStencil : CircleStencil
        "
        @change="change"
      />
      <div class="flex justify-center space-x-10 mt-2">
        <button
          @click="crop"
          class="flex items-center p-2 space-x-2 text-white rounded-md bg-primary-400"
        >
          <Icon name="material-symbols:crop" class="text-2xl"></Icon>
          <p>Crop</p>
        </button>
        <button
          @click="openModal = false"
          class="flex items-center p-2 space-x-1 text-white bg-red-400 rounded-md"
        >
          <Icon name="material-symbols:close" class="text-2xl"></Icon>
          <p>Close</p>
        </button>
      </div>
    </template>
  </CommonModal> -->
  <div
    class="flex flex-col w-24 h-24"
    @dragover="handleDragOver"
    @drop="onFileSelect"
  >
    <div class="flex flex-wrap items-center gap-y-5 gap-x-10 rounded-t-md">
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :class="[props.inputClass]"
        :accept="props.accept"
        @change="onFileSelect"
        :disabled="disabled"
      />
    </div>
    <div
      v-if="uploaded && !loading"
      class="relative flex items-center justify-center w-auto gap-3 px-1 rounded-md"
    >
      <div
        v-if="fileType == 'image'"
        class="flex justify-center overflow-hidden w-5 h-5"
        :class="imageClass"
      >
        <img
          role="presentation"
          alt="logo"
          :src="uploaded"
          class="object-cover bg-white w-24 h-24 rounded-full"
        />
      </div>
      <div v-else class="w-full">
        <Icon name="uiw:file-pdf" class="text-red-500 text-8xl"></Icon>
        <div>
          <p>{{ fileInfo.name }}</p>
          <p>{{ fileInfo.size }}</p>
        </div>
      </div>
      <div
        @click="open"
        class="absolute top-[75px] capitalize cursor-pointer right-1"
      >
        <Icon name="tdesign:refresh" class="text-xl text-primary-600"></Icon>
      </div>
    </div>
    <div
      v-else-if="loading"
      class="flex flex-col w-full justify-center items-center h-[500px]"
    >
      <Icon name="eos-icons:bubble-loading" class="text-6xl text-primary-600" />
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center w-full space-y-4 mt-2"
    >
      <p
        class="w-auto px-4 py-4 text-center text-new-tale items-center border border-primary-600 border-dashed rounded-full shadow"
      >
        <span @click="open" class="text-primary-600 cursor-pointer"
          ><Icon
            name="ic:baseline-plus"
            class="text-3xl text-primary-600 my-auto self-center"
          />
        </span>
      </p>
      <!-- <p class="text-sm font-thin font-poppins text-secondary-text :text-white">
        {{ fileTypesMessage }}
      </p> -->
    </div>
  </div>
  <p
    class="col-span-5 mt-1 text-sm text-left text-red-600 transition-all duration-300 font-body"
    :class="errorMessage2 ? 'h-5' : 'h-0'"
    id="email-error"
    :visible="errorMessage2"
  >
    {{ errorMessage2 }} &nbsp;
  </p>
  <p
    class="col-span-5 mt-1 text-sm text-left text-red-600 transition-all duration-300 font-body"
    :class="errorMessage ? 'h-5' : 'h-0'"
    id="email-error"
    :visible="errorMessage"
  >
    {{ errorMessage }} &nbsp;
  </p>
</template>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.cropper {
  height: 600px;
  width: 600px;
  background: #ddd;
}
</style>
