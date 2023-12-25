<script setup>
/***---------------------Tab--------------------- */
const router = useRouter();

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="flex items-center justify-between">
      <div
        @click="router.back()"
        class="primary-flex-row text-sheger-gray-100 hover:cursor-pointer"
      >
        <Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
        <p class="text-4xl font-semibold">Pricing Plans</p>
      </div>
      <button
        @click="router.push('/app/billings/pricing/add')"
        class="primary-button block bg-primary-600"
      >
        <Icon name="uil:plus" class="text-xl text-white" color="" />
        <span class="text-white">New Plan</span>
      </button>
    </div>

    <Billings-Pricing-List></Billings-Pricing-List>

    <!-- -------------------------Pricing lists-------------- -->
  </div>
</template>
