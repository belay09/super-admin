<script setup>
/***---------------------Tab--------------------- */

const tabs = [
  {
    name: "Pending",
    value: "Pending",
    length: 12,
  },
  {
    name: "Addressed",
    value: "Addressed",
    length: 5,
  },
];

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="w-full pl-10 pr-16 py-6">
    <!-- ---------search and filter--------- -->

    <div class="flex items-center justify-between">
      <h3 class="text-5xl font-medium">Invoices</h3>
      <div class="secondary-flex-row">
        <H-Textfield
          name="search"
          type="text"
          placeholder="Search here"
          trailing-icon="uil:search"
        ></H-Textfield>
        <div class="border rounded-md py-3 px-4">
          <Icon
            name="heroicons-outline:adjustments"
            class="text-2xl cursor-pointer z-30"
          />
        </div>

        <NuxtLink to="/app/billings/pricing">
          <Icon
            name="system-uicons:settings"
            class="text-3xl cursor-pointer z-30"
          />
        </NuxtLink>
      </div>
    </div>

    <!-- ----------------Table------------------ -->

    <div>
      <Billings-List></Billings-List>
    </div>
  </div>
</template>
