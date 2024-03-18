<script setup>
import Editor from "primevue/editor";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
});

const currentTabIndex = ref(0);

const tabs = ref([
	{
		name: "Users",
		value: "USERS",
		icon: "tabler:users",
	},
	{
		name: "Place Owners",
		value: "PLACEOWNERS",
		icon: "bi:building-fill",
	},
]);

const open = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emits("update:modelValue", newVal);
	},
});

const items = [
	{
		name: "New Review Added",
		id: "new_review_added",
	},
	{
		name: "New Review Added",
		id: "new_review_added",
	},
	{
		name: "New Review Added",
		id: "new_review_added",
	},
];
const value = ref("");
</script>

<template>
	<ModalsModal body-class="max-w-[700px] !p-6" v-model="open">
		<template #header>
			<h2 class="leading-6 text-gray-900">Compose Email</h2>
		</template>
		<template #content>
			<div class="mt-4 space-y-4">
				<H-Tab v-model:current-tab-index="currentTabIndex" :tabs="tabs">
					<template v-slot:tab="{ tabData }">
						<div class="secondary-flex-row">
							<span class="text-base">{{ tabData.tab?.name }}</span>
							<Icon class="text-lg" :name="tabData.tab.icon" />
						</div>
					</template>
				</H-Tab>

				<div>
					<HSingleSelect :items="items" label="Type" />

					<div class="h-[100px] rounded-t-lg bg-primary-50/90"></div>
				</div>
				<Editor
					v-model="value"
					editorStyle="height: 250px"
					:pt="{
						content: 'rounded-b-md border border-gray-300',
						toolbar: 'rounded-t-md border border-gray-300',
					}"
				/>

				<div class="text-gray-600">
					<p>Regards.</p>
					<p>Sheger Gebeta Team</p>
				</div>

				<div class="flex gap-x-4">
					<button class="w-full py-3 border border-gray-300 rounded-md">
						Save as Draft
					</button>
					<button
						class="flex items-center justify-center w-full py-3 text-white rounded-md gap-x-4 bg-primary-600"
					>
						<Icon name="lucide:send" />
						<span>Send Now</span>
					</button>
				</div>
			</div>
		</template>
	</ModalsModal>
</template>
