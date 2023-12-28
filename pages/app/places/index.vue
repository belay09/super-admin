<script setup>
/***---------------------Tab--------------------- */

const tabs = [
  {
    name: "Active",
    value: "Active",
    length: 121,
  },
  {
    name: "Pending",
    value: "Pending",
    length: 12,
  },
  {
    name: "Draft",
    value: "Draft",
    length: 1,
  },
  {
    name: "Closed",
    value: "Closed",
    length: 9,
  },
  {
    name: "Suspended",
    value: "Suspended",
    length: 9,
  },
];

definePageMeta({
  layout: "home",
});
</script>
<template>
  <div class="w-full">
    <!-- ---------search and filter and btn--------- -->

    <div class="relative">
      <div class="flex absolute top-2 right-0">
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
          <nuxt-link to="places/register-new-place" class="primary-button block bg-primary-600">
            <Icon
              name="lucide:building-2"
              class="text-xl text-white"
              color=""
            />
            <span class="text-white">Register New Place</span>
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="pt-10"></div>
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
      <template #Active>
        <div>
          <PlacesList />
        </div>
      </template>
      <template #Pending>
        <div>
          <PlacesList />
        </div>
      </template>
      <template #Draft>
        <div>
          <PlacesList />
        </div>
      </template>
      <template #Closed>
        <div>
          <PlacesList />
        </div>
      </template>
      <template #Suspended>
        <div>
          <PlacesList />
        </div>
      </template>
    </H-Tab>
  </div>
</template>
