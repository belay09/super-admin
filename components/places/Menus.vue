<script setup>
/***---------------------Tab--------------------- */

const tabs = [
  {
    name: "Available",
    value: "Available",
  },
  {
    name: "Unavailable",
    value: "Unavailable",
  },
];
</script>

<template>
  <div class="flex flex-col space-y-4">
    <!-- -----------------Header------------------- -->
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium">12 Menu Items</p>
      <button
        @click="showAddAdministratorModal = true"
        class="primary-button block secondary-border"
      >
        <Icon
          name="mingcute:user-add-line"
          class="text-xl text-white"
          color=""
        />
        <span class="">Add Menu Item</span>
      </button>
    </div>

    <!-- -----------------Body------------------- -->

    <H-Tab :tabs="tabs" tab-class="text-xl">
      <template #Available>
        <div class="grid grid-cols-2 gap-6 py-8">
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
        </div>
      </template>

      <template #Unavailable>
        <div class="grid grid-cols-2 gap-6 py-8">
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
          <Ui-Cards-Menu> </Ui-Cards-Menu>
        </div>
      </template>
    </H-Tab>
  </div>
</template>
