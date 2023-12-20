<template>
  <div class="text-sheger-gray-100">
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
    <UiSidebarItem name="/app/administrators">
      <template #icon>
        <Icon name="streamline:insert-side" size="24" color="" />
      </template>
      <template #title>
        <p>Administrators</p>
      </template>
    </UiSidebarItem>
  </div>
</template>
