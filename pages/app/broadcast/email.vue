<script setup>
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
const value = ref("");
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
			<BroadCastActions />
		</div>

		<div class="grid flex-grow grid-cols-3 gap-6">
			<Ui-Cards-Email v-for="i in 9" :key="i" />
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
