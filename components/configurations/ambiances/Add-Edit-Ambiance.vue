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
const noImageIsSelected = ref(false);

const handleAddOrEdit = handleSubmit(() => {
  if (url.value === "") {
    noImageIsSelected.value = true;
    return;
  }
  const input = {
    title: title.value,
    url: url.value,
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


watch(
  () => props.item,
  (newVal, oldVal) => {
    title.value = newVal?.title ;
    url.value = newVal?.icon?.lightIconUrl ;
    resetForm();
    if (props.isAdd && !newVal) {
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
        No icon is selected
      </p>
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
</template>
