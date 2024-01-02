<script setup>
/***---------------------Tab--------------------- */

const tabs = [
  {
    name: "Weekly Recommended",
    value: "WeeklyRecommended",
    length: 12,
  },
  {
    name: "Seasonal",
    value: "Seasonal",
    length: 12,
  },
  {
    name: "Recently Opened",
    value: "RecentlyOpened",
    length: 1,
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
      
      <template #WeeklyRecommended>
        <div>
          <PlacesFeaturedList />
        </div>
      </template>
      <template #Seasonal>
        <div>
          <PlacesFeaturedList />
        </div>
      </template>
      <template #RecentlyOpened>
        <div>
          <PlacesFeaturedList />
        </div>
      </template>
    </H-Tab>
  </div>
</template>
