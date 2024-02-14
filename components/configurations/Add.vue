<script setup>
const { handleSubmit, isSubmitting } = useForm({});

const emit = defineEmits(["add"]);
const title = ref("");
const url = ref("");
const noImageIsSelected = ref(false);

const handleAdd = handleSubmit(() => {
  // if (url.value === "") {
  //   noImageIsSelected.value = true;
  //   return;
  // }
  emit("add", {
    name: title.value,
    icon: url.value,
  });
});

watch(
  () => url,
  (value) => {
    if (value != "") {
      noImageIsSelected.value = false;
    } else {
      noImageIsSelected.value = true;
    }
  }
);

function uploadDone(svgUrl) {
  url.value = svgUrl;
}

const showUploadImageModal = ref(false);
const open = (event) => {
  event.stopPropagation();
  showUploadImageModal.value = true;
};
</script>

<template>
  <!-- ------------------Add tag section---------------- -->
  <form @submit.prevent="handleAdd" class="flex space-x-6 items-center">
    <!---------------------------------Tag Name------------------------------------>
    <div>
      <HTextfield
        name="name"
        id="name"
        type="text"
        placeholder="Icon Name"
        v-model="title"
        rules="required"
        error-class="lg:pl-28"
        icon-leading-class=" pl-28 lg:focus:border-sheger-gray-300"
      >
        <template #leading>
          <button
            type="button"
            @click="open"
            class="z-40 absolute inset-y-0 left-0 flex items-center px-8 bg-gray-300 w-24"
          >
            <Icon
              v-if="url == ''"
              name="heroicons:cloud-arrow-up"
              class="text-2xl"
            />
            <div v-else>
              <CommonSVG :url="url"></CommonSVG>
            </div>
          </button>
        </template>
      </HTextfield>
      <p v-if="noImageIsSelected" class="text-red-500 text-sm">
        No image is selected
      </p>
    </div>
    <button class="primary-button block bg-primary-600 lg:px-8 mb-1">
      <Icon name="heroicons:plus-small-solid" class="text-white text-2xl" />
      <span class="text-white">Add </span>
    </button>
  </form>
  <!-- ----------------Modal---------------- -->
  <Common-UploadSvg
    v-if="showUploadImageModal"
    folder=""
    v-model="url"
    v-model:showModal="showUploadImageModal"
    @uploadDone="uploadDone"
  ></Common-UploadSvg>
</template>
