<script setup>
import InsertCategory from "@/graphql/mutations/configurations/place-service/insertBasicsReviewCategory.gql";
import mutator from "@/composables/auth-mutation.js";

import useNotify from "@/use/notify.js";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "refetch"]);

const { notify } = useNotify();

const openModal = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const types = ref([
  {
    name: "Hotels",
    id: "HOTELS",
  },
  {
    name: "Restaurants",
    id: "RESTAURANTS",
  },
  {
    name: "Cafes",
    id: "CAFES",
  },
  {
    name: "Caterings",
    id: "CATERINGS",
  },
]);

const category = ref({
  type: "HOTELS",
});

const iconUrl = ref("");

/*--------------- Insert Category ----------------*/
const {
  mutate: insertCategory,
  loading: insertCategoryLoading,
  onDone: onInsertCategoryDone,
} = mutator(InsertCategory);

const { handleSubmit } = useForm({});
const handleAddSubmit = handleSubmit(() => {
  insertCategory({
    data: {
      ...category.value,
      icon: {
        data: {
          lightIconUrl: iconUrl.value,
          darkIconUrl: "",
        },
      },
    },
  });
});

onInsertCategoryDone(() => {
  openModal.value = false;

  notify({
    title: "Success",
    description: "Category added successfully",
    cardClass: "bg-green-100",
  });

  emit("refetch");
});
</script>
<template>
  <Modals-Modal v-model="openModal" :autoClose="false">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="">
          <h2 class="text-xl font-medium">Add new category</h2>
        </div>
        <button
          @click="openModal = false"
          class="flex items-center justify-center w-8 h-8 text-2xl border border-gray-300 rounded hover:text-white hover:bg-primary-400"
        >
          <Icon name="material-symbols:close" />
        </button>
      </div>
    </template>
    <template #content>
      <div class="mt-5">
        <form @submit.prevent="handleAddSubmit">
          <!-- Name field -->
          <div>
            <H-Textfield
              rules="required"
              placeholder="Enter Name"
              name="name"
              v-model="category.name"
            >
              <template #label>
                <h2 class="my-3">
                  Name <span class="text-primary-500">*</span>
                </h2>
              </template>
            </H-Textfield>
          </div>

          <!-- ------------------Icon------------------- -->
          <p class="py-4">Icon</p>

          <CommonUploadSingleImage
            folder=""
            v-model:model-value="iconUrl"
            rules="required"
            name="categoryIcon"
          ></CommonUploadSingleImage>

          <!-- Types Field -->
          <div>
            <H-Listselect
              :items="types"
              class="!p-3.5 cursor-pointer"
              placeholder="Select Type"
              name="type"
              rules=""
              v-model="category.type"
            >
              <template #label>
                <h2 class="my-3">
                  Place Type <span class="text-primary-500">*</span>
                </h2>
              </template>
            </H-Listselect>
          </div>

          <!-- Description Field -->
          <div>
            <H-Textarea
              placeholder="Write the description"
              v-model="category.description"
              name="description"
              rules="required"
            >
              <template #label>
                <h2 class="my-3">
                  Description <span class="text-primary-500">*</span>
                </h2>
              </template>
            </H-Textarea>
          </div>
          <div class="flex items-center justify-center mt-5">
            <button
              class="flex items-center justify-center px-5 py-2 mx-auto text-white rounded-md bg-primary-600 gap-x-2 hover:bg-primary-400"
              :disabled="insertCategoryLoading"
            >
              <icon
                name="line-md:loading-loop"
                v-if="insertCategoryLoading"
                class="text-lg"
              />
              Submit
            </button>
          </div>
        </form>
      </div>
    </template>
  </Modals-Modal>
</template>
