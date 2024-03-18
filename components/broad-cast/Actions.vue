<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

const openComposeSms = ref(false);
const openComposeEmail = ref(false);
const openComposeNotification = ref(false);
</script>
<template>
	<ModalsComposeSMS v-model="openComposeSms" />
	<ModalsComposeEmail v-model="openComposeEmail" />
	<ModalsComposeNotification v-model="openComposeNotification" />
	<div class="absolute right-0 -top-2">
		<Menu>
			<MenuButton
				><button class="text-white bg-primary-600 primary-button">
					<Icon class="text-xl" name="codicon:megaphone" />
					<span>Compose New Post</span>
					<Icon class="text-xl" name="tabler:chevron-down" /></button
			></MenuButton>
			<MenuItems
				class="absolute space-y-2 z-10 p-4 mt-1.5 bg-white rounded-lg shadow-lg class"
			>
				<MenuItem @click="openComposeSms = true" v-slot="{ active }">
					<li class="flex items-center text-base cursor-pointer gap-x-4">
						<Icon class="text-xl" name="nimbus:mobile" />
						<span>SMS Message</span>
					</li>
				</MenuItem>
				<MenuItem @click="openComposeEmail = true" v-slot="{ active }">
					<li class="flex items-center text-base cursor-pointer gap-x-4">
						<Icon class="text-xl" name="heroicons-outline:mail-open" />
						<span>Email Notification</span>
					</li>
				</MenuItem>
				<MenuItem @click="openComposeNotification = true" v-slot="{ active }">
					<li class="flex items-center text-base cursor-pointer gap-x-4">
						<Icon class="text-xl" name="mdi:bell-outline" />
						<span>Push Notification</span>
					</li>
				</MenuItem>
			</MenuItems>
		</Menu>
	</div>
</template>
