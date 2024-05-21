<script setup>
const tags = [
  { name: "Burger spot", id: "nearby", icon: "uil:location-point" },
  { name: "Date night", id: "recommended", icon: "grommet-icons:like" },
  { name: "Affordable", id: "affordable", icon: "uil:location-point" },
  { name: "Breakfast", id: "birthdate", icon: "heroicons:cake-20-solid" },
];
</script>

<template>
  <div class="overflow-hidden w-full">
    <div
      class="flex items-center justify-start space-x-4 overflow-x-scroll z-30 scroll"
    >
      <button
        v-for="item in tags"
        :key="item.id"
        class="flex items-center px-4 py-1.5 text-sheger_dark_gray-200 space-x-2 bg-gray-100 rounded-full"
      >
        <Icon :name="item.icon" class="text-black" />
        <p class="whitespace-nowrap">{{ item.name }}</p>
      </button>
    </div>
  </div>
</template>
