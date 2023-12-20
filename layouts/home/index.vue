<template>
  <div class="flex">
    <div
      class="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col"
    >
      <!-- Sidebar component, swap this element with another sidebar if you like -->
      <div
        class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-primary-50 px-6"
      >
        <div class="flex h-16 shrink-0 items-center">
          <img
            class="h-8 w-auto"
            src="/images/static/sheger-admin-logo.png"
            alt="Shager Admin Logo"
          />
        </div>
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                <UiSidebar />
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <main class="w-full">
      <div
        class="flex items-center justify-between mx-7 py-4 border-b border-sheger-gray-300"
      >
        <div class="text-xl text-primary-600 font-semibold">Dashboard</div>

        <!----------------------------- Right----------------------- -->
        <div class="flex items-center gap-4">
          <!-- -----------------Message ---------------------------- -->
          <div class="flex items-center space-x-4 cursor-pointer">
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
              src="/images/temprary/default-profile.png"
              alt="profile image"
            />
            <p>yonitesfu@gmail.com</p>

            <Icon name="octicon:chevron-down-16" class="text-2xl" />
          </div>
        </div>
      </div>
      <div class="">
        <!-- Main area -->
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
</script>
