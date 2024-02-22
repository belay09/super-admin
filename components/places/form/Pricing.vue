<script setup>
/**-----------------------Navigation----------------------------- */
const emit = defineEmits(["next", "prev"]);
const route = useRoute();
const next = () => {
  emit("next");
};
const prev = () => {
  emit("prev");
};
const status = ref(["Monthly", "Yearly", "Quarterly", "Bi-Annually"]);
/**----------------Billing status--------------------------- */
const currentStatus = ref("Monthly");
</script>
<template>
  <div>
    <div class="flex flex-col gap-5">
      <!-- --------------------Header ---------------------- -->
      <div class="text-xl font-medium">Select Pricing Plan</div>

      <!-- --------------------Filter ---------------------- -->
      <div>
        <Billings-Filter
          :status="status"
          v-model:model-value="currentStatus"
          class="w-fit"
        />
      </div>

      <!---------------------------------Pricing Card List --------------------->

      <div class="grid grid-cols-3 gap-6">
        <UiCardsPricing v-for="(index, value) in 3" :key="index" />
      </div>
    </div>
    <!-- --------------------------------------navigation-------------------------------- -->
    <div class="flex items-center justify-between my-2">
      <button
        class="primary-button border flex items-center gap-4"
        @click="prev()"
      >
        <Icon name="uil:arrow-left" class="w-6 h-6" />
        Previous
      </button>

      <button
        class="primary-button border flex items-center gap-4 text-white bg-primary-600"
        @click="next()"
      >
        Finish
      </button>
    </div>
  </div>
</template>
