<template>
  <div class="text-sheger-gray-100">
    <!-- Dashbord -->
    <UiSidebarItem name="/">
      <template #icon>
        <Icon name="material-symbols:dashboard-outline" size="24" color="" />
      </template>
      <template #title>
        <p>Dashboard</p>
      </template>
    </UiSidebarItem>
    <!-- Places -->
    <UiSidebarItem name="/app/places">
      <template #icon>
        <Icon name="uil:shop" size="24" color="" />
      </template>
      <template #title>
        <p>Place</p>
      </template>
    </UiSidebarItem>
    <!-- Featured Places -->
    <UiSidebarItem name="/app/featured-places">
      <template #icon>
        <Icon name="lucide:building" size="24" color="" />
      </template>
      <template #title>
        <p>Featured Places</p>
      </template>
    </UiSidebarItem>
    <!-- Sheger Reviews -->
    <UiSidebarItem name="/app/sheger-reviews">
      <template #icon>
        <Icon name="lucide:building" size="24" color="" />
      </template>
      <template #title>
        <p>Sheger Reviews</p>
      </template>
    </UiSidebarItem>
  </div>
</template>
