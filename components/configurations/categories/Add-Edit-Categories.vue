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
const type = ref("PLACE_CATEGORY");
const noImageIsSelected = ref(false);
const categoryTypes = ref([
  {
    id: "PLACE_CATEGORY",
    name: "Place Category",
  },
  {
    id: "MENU_CATEGORY",
    name: "Menu Category",
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
      console.log(newVal);
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
          <button
            type="button"
            @click="open"
            class="z-20 absolute inset-y-0 left-0 flex items-center px-8 bg-gray-300 w-24"
          >
            <Icon
              v-if="url == ''"
              name="heroicons:cloud-arrow-up"
              class="text-2xl"
            />
            <div v-else>
              <CommonSVG
                defaultIcon="heroicons:cloud-arrow-up"
                :url="url"
              ></CommonSVG>
            </div>
          </button>
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
        :items="categoryTypes"
        rules="required"
      >
      </H-SingleSelect>
    </div>

    <button
      :disabled="loading"
      class="primary-button block bg-primary-600 lg:px-8 w-36"
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
