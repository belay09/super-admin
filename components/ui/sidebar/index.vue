<template>
  <div class="text-sheger-gray-100 flex flex-col space-y-4">
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
    <UiSidebarItem name="/app/users">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>User</p>
      </template>
    </UiSidebarItem>
    <UiSidebarItem name="/app/ad_space">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Ad Space</p>
      </template>
    </UiSidebarItem>

    <UiSidebarItem name="/app/sponsored_drinks">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Sponsored drinks</p>
      </template>
    </UiSidebarItem>

    <UiSidebarItem name="/app/administrators">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Administrators</p>
      </template>
    </UiSidebarItem>
    <UiSidebarItem name="/app/reports">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Reports</p>
      </template>
    </UiSidebarItem>
    <UiSidebarItem name="/app/billings">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Billings</p>
      </template>
    </UiSidebarItem>

    <nuxt-link to="/app/places/register-new-place" class="flex flex-col items-center w-fit mx-auto px-6 py-8 border rounded-lg cursor-pointer hover:bg-primary-600 hover:text-white">
      <Icon name="lucide:building-2" class="text-xl" color="" />
      <div>
        <p>Register New Place</p>
      </div>
    </nuxt-link>
  </div>
</template>
