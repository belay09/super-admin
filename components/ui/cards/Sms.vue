<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
</script>
<template>
	<div class="p-4 space-y-3 border border-gray-300 rounded-lg">
		<div class="flex items-center justify-between">
			<p class="text-lg font-medium leading-7">
				New Must Place to Visit in Addis
			</p>
			<Popover class="relative">
				<PopoverButton>
					<Icon
						class="text-2xl cursor-pointer"
						name="ph:dots-three-outline-vertical-fill"
					/>
				</PopoverButton>

				<PopoverPanel
					class="absolute right-0 z-10 min-w-[230px] p-4 mt-1.5 bg-white rounded-lg shadow-lg class"
				>
					<ul class="space-y-2">
						<li class="flex items-center text-base cursor-pointer gap-x-4">
							<Icon class="text-xl" name="carbon:edit" />
							<span>Edit Message</span>
						</li>
						<li class="flex items-center text-base cursor-pointer gap-x-4">
							<Icon class="text-xl" name="bi:check-all" />
							<span>Publish Message</span>
						</li>
						<li
							class="flex items-center text-base cursor-pointer text-primary-500 gap-x-4"
						>
							<Icon class="text-xl" name="ph:trash-bold" />
							<span>Delete Message</span>
						</li>
					</ul>
				</PopoverPanel>
			</Popover>
		</div>
		<div class="flex gap-x-2">
			<Icon class="text-xl" name="tabler:calendar-clock" />
			<span class="text-sm text-gray-600">Jan 12 2024 , 12:09 PM</span>
		</div>
		<div class="space-x-2">
			<span
				class="px-2 py-1 text-xs font-medium bg-sheger-blue-50 rounded-xl text-sheger-blue-800"
			>
				Pending
			</span>
			<span
				class="px-2 py-1 text-xs font-medium bg-sheger-gray-100/5 rounded-xl"
			>
				<Icon name="ph:users" />
				User
			</span>
			<span
				class="px-2 py-1 text-xs font-medium bg-sheger-gray-100/5 rounded-xl"
			>
				<Icon name="nimbus:mobile" />
				Sms
			</span>
		</div>
		<p class="text-base text-gray-700">
			Lacus morbi commodo nunc dui amet consequat pulvinar volutpat aliquam. Sed
			tortor nibh posuere egestas suspendisse. Donec venenatis arcu quis sed
			sed.
		</p>
	</div>
</template>
