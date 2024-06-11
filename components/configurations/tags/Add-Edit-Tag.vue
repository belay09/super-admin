<script setup>
const { handleSubmit, resetForm } = useForm({});

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  isAdd: {
    type: Boolean,
    default: true,
  },
  item: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["add", "edit"]);
const title = ref("");
const url = ref("");
const type = ref("PLACE_TAG");
const noImageIsSelected = ref(false);
const tagTypes = ref([
  {
    id: "PLACE_TAG",
    name: "Place Tag",
  },
  {
    id: "MENU_TAG",
    name: "Menu Tag",
  },
  {
    id: "REVIEW_TAG",
    name: "Review Tag",
  },
]);

const handleAddOrEdit = handleSubmit(() => {
  if (url.value === "") {
    noImageIsSelected.value = true;
    return;
  }

  const input = {
    title: title.value,
    url: url.value,
    type: type.value,
  };

  if (props.isAdd) {
    emit("add", input);
  } else {
    emit("edit", input);
  }
});

watch(url, (value) => {
  if (value != "") {
    noImageIsSelected.value = false;
  } else {
    noImageIsSelected.value = true;
  }
});

const showUploadImageModal = ref(false);
const open = (event) => {
  event.stopPropagation();
  showUploadImageModal.value = !showUploadImageModal.value;
};


watch(
  () => props.item,
  (newVal, oldVal) => {
    if (newVal) {
      title.value = newVal.title;
      url.value = newVal.icon?.lightIconUrl;
      type.value = newVal.type;
    } else if (props.isAdd) {
      resetForm();
    }
  },
  { deep: true }
);
</script>

<template>
  <!-- ------------------Add tag section---------------- -->
  <form
    @submit.prevent="handleAddOrEdit"
    class="grid grid-cols-4 gap-6 items-center"
  >
    <!---------------------------------Tag Name------------------------------------>
    <div class="col-span-2">
      <HTextfield
        name="name"
        id="name"
        type="text"
        placeholder="Title"
        v-model="title"
        rules="required"
        error-class="lg:pl-28"
        icon-leading-class=" pl-28 lg:focus:border-sheger-gray-300"
      >
        <template #leading>
          <ConfigurationsUploadIcon v-model="url" />
        </template>
      </HTextfield>
      <p v-if="noImageIsSelected" class="text-red-500 text-sm">
        No image is selected
      </p>
    </div>
    <!-- -----------------------Category Type---------------------- -->

    <div class="w-64">
      <H-SingleSelect
        class="w-40"
        name="type"
        v-model="type"
        :items="tagTypes"
        rules="required"
      >
      </H-SingleSelect>
    </div>

    <button
      :disabled="loading"
      class="primary-button block bg-primary-600 lg:px-4 w-36"
    >
      <Icon
        :name="isAdd ? 'heroicons:plus-small-solid' : 'uil:edit'"
        class="text-white text-2xl"
      />

      <span class="text-white">{{ isAdd ? "Add" : "Update" }}</span>
      <Icon
        v-if="loading"
        name="eos-icons:bubble-loading"
        class="text-3xl text-red-600"
      />
    </button>
  </form>
  <!-- ----------------Modal---------------- -->
  <Common-UploadSvg
    v-if="showUploadImageModal"
    folder=""
    v-model="url"
    @close="showUploadImageModal = false"
  ></Common-UploadSvg>
</template>
