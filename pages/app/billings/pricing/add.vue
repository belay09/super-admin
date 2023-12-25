<script setup>
/***---------------------Tab--------------------- */
const router = useRouter();

const frequencies = ref([
  {
    name: "Monthly",
    id: "Monthly",
  },
  {
    name: "Yearly",
    id: "Yearly",
  },
  {
    name: "Quarterly",
    id: "Quarterly",
  },
  {
    name: "Bi-Annually",
    id: "Bi-Annually",
  },
]);

const frequency = ref();
const lampSumPrice = ref(0);

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div
      @click="router.back()"
      class="primary-flex-row text-sheger-gray-100 hover:cursor-pointer py-4"
    >
      <Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
      <p class="text-4xl font-semibold">Add Pricing Plan</p>
    </div>

    <!-- -------------------Add pricing plan-------------------- -->

    <div class="grid grid-cols-3 gap-8">
      <!-- -----------------Basic info---------------- -->
      <div>
        <p class="text-sheger-gray-100 font-medium text-lg py-4">Basic Info</p>
        <!-- -----------------Plan name---------------- -->
        <H-Textfield
          id="plan_name"
          name="plan_name"
          label="Plan Name"
          placeholder="Write here"
        ></H-Textfield>

        <!-- ---------------------Description---------------- -->

        <H-Textarea
          id="description"
          name="description"
          label="Description"
          class="pt-4"
        ></H-Textarea>

        <!-- -----------------Frequency and Lamp Sum Price---------------- -->
        <div class="grid grid-cols-2 pt-6 gap-x-6">
          <H-SingleSelect
            name="frequency"
            id="frequency"
            label="Frequency"
            :items="frequencies"
            v-model="frequency"
          ></H-SingleSelect>
          <H-Textfield
            id="lamp_sum_price"
            name="lamp_sum_price"
            label="Lamp Sum Price"
            type="number"
            v-model="lampSumPrice"
          ></H-Textfield>
        </div>

        <!-- --------------------Plan visibility---------------- -->
        <div class="w-full">
          <img
            src="/images/temporary/pricing-plan-visibility.png"
            class="w-full py-2"
            alt="upload temprary image"
          />
        </div>
      </div>

      <!-- -----------------Features---------------- -->
      <div class="px-8 border-x">
        <p class="text-sheger-gray-100 font-medium text-lg py-4">Features</p>
        <!-- -----------------Plan name---------------- -->
        <H-Textfield
          id="title"
          name="title"
          label="Title"
          placeholder="Title"
        ></H-Textfield>

        <!-- -----------------Frequency and Lamp Sum Price---------------- -->
        <div class="grid grid-cols-2 pt-6 gap-x-6">
          <H-Textfield
            id="lamp_sum_price"
            name="lamp_sum_price"
            label="Limit"
            type="number"
            v-model="lampSumPrice"
          ></H-Textfield>

          <H-SingleSelect
            name="frequency"
            id="frequency"
            label="Type"
            :items="frequencies"
            v-model="frequency"
          ></H-SingleSelect>
        </div>

        <!-- -----------------Frequency and Price---------------- -->
        <div class="grid grid-cols-2 pt-3 gap-x-6">
          <H-Textfield
            id="price"
            name="price"
            label="Price"
            type="number"
            v-model="lampSumPrice"
          ></H-Textfield>
          <H-SingleSelect
            name="frequency"
            id="frequency"
            label="Frequency"
            :items="frequencies"
            v-model="frequency"
          ></H-SingleSelect>
        </div>

        <!-- ---------------------Description---------------- -->

        <H-Textarea
          id="description"
          name="description"
          label="Description"
          class="pt-2"
        ></H-Textarea>

        <!-- ----------------------Submit------------------- -->
        <button
          type="submit"
          class="primary-button secondary-border py-3 mt-4 block w-full"
        >
          <Icon name="heroicons:plus-small-solid" class="text-2 xl"></Icon>

          <span>Add</span>
        </button>
      </div>

      <!-- -------------------------------Preview -->
      <div class="flex flex-col space-y-5 px-5 py-6 border rounded-lg">
        <!-- -------------------Pricing header--------------------- -->
        <p class="text-2xl text-sheger-gray-100 font-semibold">Sheger Pro</p>

        <p class="text-sheger-gray-100">For Small Business</p>
        <p class="text-sheger-gray-100 font-medium text-xl">
          ETB 500 / Monthly
        </p>

        <!-- ------------------Plan futures------------- -->

        <div class="flex flex-col space-y-4 secondary-text">
          <div
            v-for="(item, index) in 3"
            :key="index"
            class="secondary-flex-row"
          >
            <Icon name="uil:check" class="text-2xl" />
            <p>Urna augue sit tortor iaculis nulla dui id venenatis nunc.</p>
          </div>
        </div>

        <!-- ----------------------Submit------------------- -->
        <div class="h-full flex items-end">
          <button
            type="submit"
            class="primary-button secondary-border py-3 mt-4 block w-full"
          >
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
