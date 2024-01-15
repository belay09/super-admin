<script setup>
const router = useRouter();
function gotoMessage() {
  router.push("/app/supports");
}
</script>

<template>
  <HNotification />
  <div class="">
    <div class="flex">
      <div
        class="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col"
      >
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div
          class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-primary-50 px-6 fixed top-0 left-0 h-screen scroll"
        >
          <div class="flex h-16 shrink-0 items-center">
            <img
              class="h-8 w-auto"
              src="/images/static/sheger-admin-logo.png"
              alt="Sheger Admin Logo"
            />
          </div>
          <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="mx-2 space-y-1">
                  <UiSidebar />
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main class="w-full relative">
        <!-- top bar -->
        <div
          class="flex items-center justify-between ml-10 mr-16 py-4 border-b border-sheger-gray-300 sticky top-0 bg-white z-50"
        >
          <div class="text-xl text-primary-600 font-semibold">Dashboard</div>

          <!----------------------------- Right----------------------- -->
          <div class="flex items-center gap-4">
            <!-- -----------------Message ---------------------------- -->
            <div
              @click="gotoMessage"
              class="flex items-center space-x-4 cursor-pointer"
            >
              <Icon name="ant-design:message-outlined" class="text-2xl" />
            </div>
            <!-- -----------------Notifcation ---------------------------- -->
            <div class="flex items-center space-x-4 cursor-pointer">
              <Icon name="heroicons:bell" class="text-2xl" />
            </div>

            <!-- -----------------Clickable Profile Data with chevron icon------------------------- -->
            <div
              @click="toggleUserSetting"
              class="cursor-pointer flex py-2 px-3 justify-between items-center space-x-4 bg-primary-100 dark:text-white dark:bg-sheger_brown-100 rounded-full"
            >
              <!-- -----------------Default profile image------------------------- -->
              <img
                class="w-8 h-8 rounded-full"
                src="/images/temporary/default-profile.png"
                alt="profile image"
              />
              <p>yonitesfu@gmail.com</p>

              <Icon name="octicon:chevron-down-16" class="text-2xl" />
            </div>
          </div>
        </div>
        <div class="overflow-y-scroll px-10 pr-16 py-6">
          <!-- Main area -->
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
