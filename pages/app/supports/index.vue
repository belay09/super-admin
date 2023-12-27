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
  layout: "message",
});
</script>
<template>
  <div class="w-full">
    <!-- ----------------Tab------------------ -->

    <H-Tab :tabs="tabs">
      <template v-slot:tab="{ tabData }">
        <div class="secondary-flex-row">
          <span class="text-xl">{{ tabData.tab?.name }}</span>
          <span
            :class="{ 'bg-primary-100': tabData.isActive }"
            class="px-1.5 py-0.5 rounded-lg border bg-gray-200"
            >{{ tabData.tab?.length }}</span
          >
        </div>
      </template>

      <template #Addressed>
        <div>
          <Supports-List></Supports-List>
        </div>
      </template>
      <template #Pending>
        <div>
          <Supports-List></Supports-List>
        </div>
      </template>
    </H-Tab>
  </div>
</template>
