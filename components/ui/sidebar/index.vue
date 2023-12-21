<template>
  <div class="text-sheger-gray-100 flex flex-col gap-y-4">
    <!-- Dashbord -->
    <UiSidebarItem name="/">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Dashboard</p>
      </template>
    </UiSidebarItem>
    <!-- Place -->
    <UiSidebarItem name="/place">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Place</p>
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
  </div>
</template>
