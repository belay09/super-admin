<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const tabs = ref([
	{
		name: "Draft",
		value: "Draft",
		length: 12,
	},
	{
		name: "Published",
		value: "Published",
		length: 5,
	},
]);

const currentTabIndex = ref(0);

const offset = ref([]);
const limit = ref(20);
const length = ref(100);

definePageMeta({
	layout: "broadcast",
});
</script>

<template>
	<div class="flex flex-col w-full h-full gap-y-5">
		<!-- ----------------Tab------------------ -->
		<div class="relative">
			<H-Tab v-model:currentTabIndex="currentTabIndex" :tabs="tabs">
				<template v-slot:tab="{ tabData }">
					<div class="secondary-flex-row">
						<span class="text-xl">{{ tabData.tab?.name }}</span>
						<span
							:class="{ 'bg-primary-100': tabData.isActive }"
							class="px-2 py-1 bg-gray-200 rounded-lg"
							>{{ tabData.tab?.length }}</span
						>
					</div>
				</template>
			</H-Tab>
			<Popover class="absolute right-0 -top-2">
				<PopoverButton>
					<button class="text-white bg-primary-600 primary-button">
						<Icon class="text-xl" name="codicon:megaphone" />
						<span>Compose New Post</span>
						<Icon class="text-xl" name="tabler:chevron-down" />
					</button>
				</PopoverButton>

				<PopoverPanel
					class="absolute z-10 p-4 mt-1.5 bg-white rounded-lg shadow-lg class"
				>
					<ul class="space-y-2">
						<li class="flex items-center text-base cursor-pointer gap-x-4">
							<Icon class="text-xl" name="nimbus:mobile" />
							<span>SMS Message</span>
						</li>
						<li class="flex items-center text-base cursor-pointer gap-x-4">
							<Icon class="text-xl" name="heroicons-outline:mail-open" />
							<span>Email Notification</span>
						</li>
						<li class="flex items-center text-base cursor-pointer gap-x-4">
							<Icon class="text-xl" name="mdi:bell-outline" />
							<span>Push Notification</span>
						</li>
					</ul>
				</PopoverPanel>
			</Popover>
		</div>
		<div class="grid flex-grow grid-cols-3 gap-6">
			<Ui-Cards-Sms v-for="i in 9" :key="i" />
		</div>
		<div class="flex flex-col py-6 space-y-8">
			<div class="mt-5">
				<HPaginate
					v-model:offset="offset"
					:items-per-page="limit"
					:total-data="length"
				/>
			</div>
		</div>
	</div>
</template>
