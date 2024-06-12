<script setup>
import { useForm } from "vee-validate";
import updatePricingQuery from "@/graphql/mutations/pricing/updatePricingItem.gql";
import insertPricingQuery from "@/graphql/mutations/pricing/insertPricingItem.gql";
import deletePricingQuery from "@/graphql/mutations/pricing/deletePricingItem.gql";

import useNotify from "@/use/notify";

const { notify } = useNotify();
const { handleSubmit, resetField } = useForm();
const route = useRoute();
const deleteIndex = ref();
const editItemId = ref();
const props = defineProps({
  modelValue: Array,
  singleFeature: Object,
});

const frequencies = ref([
  {
    name: "Monthly",
    id: "MONTHLY",
  },
  {
    name: "Annually",
    id: "ANNUALLY",
  },
  {
    name: "Quarterly",
    id: "QUARTERLY",
  },
]);
const emit = defineEmits(["update:modelValue"]);

const title = ref("");
const placeAddLimit = ref({});
const reviewAddLimit = ref({});
const placeBadge = ref({});
const featuredPlace = ref({});
const rules = ref({});
const freqPrice = ref({});

const features = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

/*---------------------------------Return single feature------------------------------*/

const singleFeature = computed(() => {
  return {
    ...freqPrice.value,
    pricing_plan_frequency_items: {
      data: {
        item: {
          data: {
            title: title.value,
            name: title.value,
            rules: {
              menu_limit: Number(rules.value.menu_limit),
              place_profile_limit: Number(rules.value.place_profile_limit),
              branch_address_limit: Number(rules.value.branch_address_limit),
              review_limit: Number(rules.value.review_limit),
              place_add: {
                ...Object.fromEntries(
                  Object.entries(placeAddLimit.value).map(([key, val]) => [
                    key,
                    Number(val),
                  ])
                ),
              },
              review_add: {
                ...Object.fromEntries(
                  Object.entries(reviewAddLimit.value).map(([key, val]) => [
                    key,
                    Number(val),
                  ])
                ),
              },
              place_badge: {
                ...Object.fromEntries(
                  Object.entries(placeBadge.value).map(([key, val]) => [
                    key,
                    Number(val),
                  ])
                ),
              },
              featured_place: {
                ...Object.fromEntries(
                  Object.entries(featuredPlace.value).map(([key, val]) => [
                    key,
                    Number(val),
                  ])
                ),
              },
            },
          },
        },
      },
    },
  };
});
const isEdit = ref(false);
const editIndex = ref(0);

/*---------------------------------Add  Items Function------------------------------*/

const addFeature = handleSubmit(() => {
  let pricingPlanId = route.params.id;
  let newSingleFeature = {
    pricingPlanId,
    ...singleFeature.value,
  };
  addMutation({
    frequency_price: newSingleFeature,
  });
});
const initiateEdit = (index) => {
  editIndex.value = index;
  isEdit.value = true;
  const editItem = features.value[index];
  editItemId.value = editItem?.item_id;
  title.value = editItem?.pricing_plan_frequency_items?.data?.item?.data?.title;
  
  placeAddLimit.value =
    editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules?.place_add;
  reviewAddLimit.value =
    editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules?.review_add;
  placeBadge.value =
    editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules?.place_badge;
  featuredPlace.value =
    editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules?.featured_place;
  freqPrice.value = {
    price: editItem?.price,
    frequency: editItem?.frequency,
    id: editItem.id,
    item_id: editItem?.item_id,
  };
  rules.value = {
    branch_address_limit:
      editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules
        ?.branch_address_limit,
    place_profile_limit:
      editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules
        ?.place_profile_limit,
    review_limit:
      editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules
        ?.review_limit,
    menu_limit:
      editItem?.pricing_plan_frequency_items?.data?.item?.data?.rules
        ?.menu_limit,
  };
};

/*---------------------------------Edit Items Function------------------------------*/
const editFeature = handleSubmit(() => {
  console.log("singleFeature", singleFeature.value);
  editMutation({
    _set: {
      title:
        singleFeature.value.pricing_plan_frequency_items.data.item.data.title,
      name: singleFeature.value.pricing_plan_frequency_items.data.item.data
        .name,
      rules:
        singleFeature.value.pricing_plan_frequency_items.data.item.data.rules,
    },
    id: editItemId.value,
    _setFreq:{
      price: singleFeature.value.price,
      frequency: singleFeature.value.frequency,
    },freqId: singleFeature.value.id
  });
});

const {
  mutate: editMutation,
  loading: editLoading,
  onError: onEditError,
  onDone: onEditDone,
} = authMutation(updatePricingQuery);

onEditDone(() => {
  notify({
    title: "Pricing Plan",
    description: "Pricing plan item updated successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300 bg-primary-200",
  });
  features.value[editIndex.value] = singleFeature.value;
  singleFeature.value = {};
  isEdit.value = false;
  title.value = "";
  placeAddLimit.value = {};
  reviewAddLimit.value = {};
  placeBadge.value = {};
  featuredPlace.value = {};
  rules.value = {};
  freqPrice.value = {};
  // router.push("/app/pricing");
});

onEditError(() => {
  notify({
    title: "Pricing Plan",
    description: "Pricing plan item updated failed",
    type: "error",
    borderClass: "border-l-8 border-red-300 bg-primary-200",
  });
});
const {
  mutate: addMutation,
  loading: addLoading,
  onError: onAddError,
  onDone: onAddDone,
} = authMutation(insertPricingQuery);
onAddDone(async (result) => {
  freqPrice.value = {
    item_id:
      result.data.insertBillingsPricingPlanFrequencies.returning[0]
        .pricing_plan_frequency_items[0].itemId,
    id: result.data.insertBillingsPricingPlanFrequencies.returning[0].id,
    price: result.data.insertBillingsPricingPlanFrequencies.returning[0].price,
    frequency:
      result.data.insertBillingsPricingPlanFrequencies.returning[0].frequency,
  };

  // Wait for next tick to ensure reactivity system has updated freqPrice
  await nextTick();

  features.value = [...features.value, { ...singleFeature.value }];

  notify({
    title: "Pricing Plan",
    description: "Pricing plan item added successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300 bg-primary-200",
  });

  title.value = "";
  placeAddLimit.value = {};
  reviewAddLimit.value = {};
  placeBadge.value = {};
  featuredPlace.value = {};
  rules.value = {};
  freqPrice.value = {};
  // router.push("/app/pricing");
});

onAddError(() => {
  notify({
    title: "Pricing Plan",
    description: "Pricing plan item addition failed",
    type: "error",
    borderClass: "border-l-8 border-red-300 bg-primary-200",
  });
});
const {
  mutate: deleteMutation,
  loading: deleteLoading,
  onError: onDeleteError,
  onDone: onDeleteDone,
} = authMutation(deletePricingQuery);

onDeleteDone(() => {
  notify({
    title: "Pricing Plan item",
    description: "Pricing plan item delete successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300 bg-primary-200",
  });
  features.value.splice(deleteIndex.value, 1);
});

onDeleteError((error) => {
  let message = "Pricing plan item deletion failed";
  let title = "Pricing item";
  let borderClass = "border-l-8 border-red-300 bg-primary-200";
  if (
    error.message.includes(
      'Foreign key violation. update or delete on table "pricing_plan_frequencies" violates foreign key constraint "payments_pricing_plan_frequency_id_fkey" on table "payments"'
    )
  ) {
    message = "Pricing plan item is in use and cannot be deleted";
    title = "warning";
    borderClass = "border-l-8 border-yellow-300 bg-white";
  }
  notify({
    title: title,
    description: message,
    type: "error",
    borderClass: borderClass,
  });
});
const deleteFunction = (index, id) => {
  deleteIndex.value = index;
  deleteMutation({
    id: id,
  });
};
</script>

<template>
  <form id="features" class="px-8 overflow-y-auto border-l">
    <p class="py-4 text-lg font-medium text-sheger-gray-100">Pricing Items</p>
    <!-- -----------------Plan name---------------- -->

    <H-Textfield
      id="title"
      name="title"
      label="Title"
      placeholder="Title"
      v-model="title"
      rules="required"
    ></H-Textfield>

    <!-- -----------------Frequency and Lamp Sum Price---------------- -->
    <div class="grid grid-cols-2 pt-6 gap-x-6">
      <H-Textfield
        id="price"
        name="price"
        label="Lump Sum Price"
        type="number"
        v-model="freqPrice.price"
        rules="required"
      ></H-Textfield>

      <H-SingleSelect
        name="frequency"
        id="frequency"
        label="Frequency"
        :items="frequencies"
        v-model="freqPrice.frequency"
        rules="required"
      ></H-SingleSelect>
    </div>

    <div class="grid grid-cols-2 border-t gap-x-4 gap-y-2 mt-6 pt-4">
      <H-Textfield
        id="place add"
        name="place add"
        label="Place Add Week Limit"
        type="number"
        v-model="placeAddLimit.week_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Menu Limit"
        name="Menu Limit"
        label="Menu Limit"
        type="number"
        v-model="rules.menu_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Review Add"
        name="Review Add"
        label="Review Week Limit"
        type="number"
        v-model="reviewAddLimit.week_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Place Badge"
        name="Place Badge"
        label="Badge Week Limit"
        type="number"
        v-model="placeBadge.week_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Review Limit"
        name="Review Limit"
        label="Review Limit"
        type="number"
        v-model="rules.review_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Featured Place"
        name="Featured Place"
        label="Featured  Week Limit"
        type="number"
        v-model="featuredPlace.week_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Place Profile Limit"
        name="Place Profile Limit"
        label="Place Profile Limit"
        type="number"
        v-model="rules.place_profile_limit"
        rules="required"
      ></H-Textfield>
      <H-Textfield
        id="Branch Address Limit"
        name="Branch Address Limit"
        label="Branch Address Limit"
        type="number"
        v-model="rules.branch_address_limit"
        rules="required"
      ></H-Textfield>
    </div>
    <!-- ----------------------Submit------------------- -->
    <button
      form="features"
      type="submit"
      class="block w-full py-3 mt-4 primary-button secondary-border"
      @click.prevent="isEdit ? editFeature() : addFeature()"
    >
      <Icon
        :name="isEdit ? 'tabler:edit' : 'heroicons:plus-small-solid'"
        class="text-2 xl"
      ></Icon>
      <span
        >{{ isEdit ? "Edit" : "Add" }}
        <Icon
          v-if="addLoading || editLoading"
          name="eos-icons:bubble-loading"
          class="text-2xl text-primary-600"
        />
      </span>
    </button>
    <div class="flex flex-wrap mt-2 gap-x-4 gap-y-3">
      <div
        v-for="(item, index) in features"
        :key="index"
        class="relative flex flex-col items-start w-full p-2 overflow-hidden text-sm border border-gray-300 rounded-lg gap-y-1 group"
      >
        <p class="text-lg font-semibold text-sheger-gray-950">
          {{ item.pricing_plan_frequency_items.data.item.data.title }}
        </p>
        <p class="text-gray-950">
          <span class="font-medium text-gray-950">Frequency:</span>
          {{ item.frequency }}
        </p>
        <p>
          <span class="font-medium text-gray-950">Price:</span>{{ item.price }}
        </p>

        <div
          v-if="!deleteLoading"
          class="absolute hidden items-center justify-center gap-x-4 group-hover:flex top-0 left-0 w-full h-full group-hover:bg-slate-100/10 group-hover:backdrop-blur-[2px]"
        >
          <Icon
            @click="initiateEdit(index)"
            class="text-3xl cursor-pointer"
            name="tdesign:edit"
          />
          <Icon
            @click="deleteFunction(index, item.id)"
            class="text-3xl font-semibold text-red-600 cursor-pointer"
            name="mi:delete"
          />
        </div>
        <div
          v-else
          class="absolute hidden items-center justify-center gap-x-4 group-hover:flex top-0 left-0 w-full h-full group-hover:bg-slate-100/10 group-hover:backdrop-blur-[2px]"
        >
          deleting
          <Icon
            name="eos-icons:three-dots-loading"
            class="text-4xl text-primary-600"
          />
        </div>
      </div>
    </div>
  </form>
</template>
