<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import { useAuthStore } from "~/stores/auth";
const router = useRouter();
function gotoMessage() {
  router.push("/app/supports");
}

const { logout } = useAuthStore();

const showLogoutConformationModal = ref(false);

const { onLogout } = useApollo();

const handleLogout = () => {
  onLogout("authClient");
  onLogout("authorizerClient");
  logout();
  showLogoutConformationModal.value = true;
  window.location.reload();
};
</script>

<template>
  <ModalsConfirmation
    v-model="showLogoutConformationModal"
    title="Log out"
    description="Are you sure you want to log out?"
    confirm-button="Log out"
    @confirm="handleLogout"
    icon="mdi:warning-box"
  />
  <HNotification />
  <div class="">
    <div class="flex">
      <div
        class="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col"
      >
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div
          class="fixed top-0 left-0 flex flex-col h-screen px-6 overflow-y-auto border-r border-gray-200 grow gap-y-5 bg-primary-50 scroll"
        >
          <div class="flex items-center h-16 shrink-0">
            <img
              class="w-auto h-12"
              src="/images/static/sheger-admin-logo.png"
              alt="Sheger Admin Logo"
            />
          </div>
          <nav class="flex flex-col flex-1">
            <ul role="list" class="flex flex-col flex-1 gap-y-7">
              <li>
                <ul role="list" class="mx-2 space-y-1">
                  <UiSidebar />
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main class="relative flex flex-col w-full">
        <!-- top bar -->
        <div
          class="sticky top-0 z-50 flex items-center justify-between py-4 ml-10 mr-16 border-b border-sheger-gray-300"
        >
          <div class="text-xl font-semibold text-primary-600">Dashboard</div>

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
            <div class="relative">
              <Menu>
                <MenuButton>
                  <!-- -----------------Clickable Profile Data with chevron icon------------------------- -->
                  <div
                    @click="toggleUserSetting"
                    class="flex items-center justify-between px-3 py-2 space-x-4 rounded-full cursor-pointer bg-primary-100 dark:text-white dark:bg-sheger_brown-100"
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
                </MenuButton>
                <MenuItems
                  class="absolute right-0 flex flex-col items-start justify-start w-full max-w-[247px] mt-3 overflow-hidden bg-white rounded shadow-lg"
                >
                  <MenuItem
                    v-slot="{ active }"
                    class="w-full px-5 py-2 text-base hover:bg-primary-600/60 hover:text-white"
                  >
                    <button class="flex items-center w-full gap-3">
                      <Icon name="uil:setting" class="text-2xl" />
                      Settings & Profile
                    </button>
                  </MenuItem>
                  <MenuItem
                    v-slot="{ active }"
                    class="w-full px-5 py-2 text-base hover:bg-primary-600/60 hover:text-white"
                  >
                    <button
                      @click="showLogoutConformationModal = true"
                      class="flex items-center w-full gap-3"
                    >
                      <icon name="uil:power" class="text-2xl" />Log out
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>
        <div class="h-full px-10 py-6 pr-16 overflow-y-scroll">
          <!-- Main area -->
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
