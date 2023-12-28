<script setup>
const status = ref(["Monthly", "Yearly", "Quarterly", "Bi-Annually"]);
/**----------------Billing status--------------------------- */
const currentStatus = ref("Monthly");
</script>
<template>
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
</template>
