<script setup></script>

<template>
  <div class="flex flex-col space-y-5 px-5 py-6 border rounded-lg">
    <!-- -------------------Pricing header--------------------- -->
    <div class="flex justify-between">
      <p class="text-2xl text-sheger-gray-100 font-semibold">Sheger Pro</p>
    </div>

    <p class="text-sheger-gray-100">For Small Business</p>
    <p class="text-sheger-gray-100 font-medium text-xl">ETB 500 / Monthly</p>

    <!-------------------------Subscribe--------------------------------------->
    <div class="w-full">
      <button
        class="primary-button text-sheger-gray-100 border rounded-lg font-medium w-full hover:bg-primary-600 hover:text-white active:scale-95 transition-transform ease-in-out duration-200"
      >
        Subscribe
      </button>
    </div>
    <!-- ------------------Plan futures------------- -->

    <div class="flex flex-col space-y-4 secondary-text">
      <div v-for="(item, index) in 6" :key="index" class="secondary-flex-row">
        <Icon name="uil:check" class="text-2xl" />
        <p>Urna augue sit tortor iaculis nulla dui id venenatis nunc.</p>
      </div>
    </div>
  </div>
</template>
