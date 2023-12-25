<script setup>
const router = useRouter();

/**----------------Billing status--------------------------- */
const currentStatus = ref("Monthly");
const status = ref(["Monthly", "Yearly", "Quarterly", "Bi-Annually"]);
</script>

<template>
  <div class="flex flex-col space-y-8 py-6">
    <Billings-Filter v-model:model-value="currentStatus" :status="status" />

    <div class="grid grid-cols-3 gap-6">
      <div
        class="flex flex-col space-y-5 px-5 py-6 border rounded-lg"
        v-for="(index, value) in 3"
        :key="index"
      >
        <!-- -------------------Pricing header--------------------- -->
        <div class="flex justify-between">
          <p class="text-2xl text-sheger-gray-100 font-semibold">Sheger Pro</p>
          <div class="flex items-center space-x-4">
            <Icon name="uil:trash-alt" class="text-2xl" />
            <Icon name="uil:edit-alt" class="text-2xl" />
          </div>
        </div>

        <p class="text-sheger-gray-100">For Small Business</p>
        <p class="text-sheger-gray-100 font-medium text-xl">
          ETB 500 / Monthly
        </p>

        <!-- ------------------Plan futures------------- -->

        <div class="flex flex-col space-y-4 secondary-text">
          <div
            v-for="(item, index) in 6"
            :key="index"
            class="secondary-flex-row"
          >
            <Icon name="uil:check" class="text-2xl" />
            <p>Urna augue sit tortor iaculis nulla dui id venenatis nunc.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
