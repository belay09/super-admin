<script setup>
const props = defineProps({
	content: {
		type: Array,
		required: true,
	},
	layout: {
		type: Object,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<NuxtLink
		class="border-2 ease-in-out flex flex-col justify-center group h-[310px] w-[330px] border-primary-600 overflow-clip rounded-2xl"
		:to="link"
	>
		<div
			class="flex flex-col items-center justify-center w-[330px] h-[310px] text-white group-hover:text-gray-900 ease-out duration-500 rounded-xl bg-primary-600 group-hover:bg-white group-hover:h-[40%] gap-y-4"
		>
			<Icon
				:name="layout.icon"
				class="duration-500 ease-out group-hover:text-4xl text-8xl"
			/>
			<p class="text-3xl font-medium duration-500 ease-out group-hover:text-lg">
				{{ layout.name }}
			</p>
		</div>
		<div
			class="h-0 px-6 group-hover:pb-4 space-y-6 text-gray-900 duration-500 ease-out group-hover:h-[60%]"
		>
			<ul class="space-y-3">
				<li
					class="flex items-center text-gray-800 gap-x-4"
					v-for="item in content"
					:key="item"
				>
					<Icon class="text-xl" :name="item.icon" />
					<span>{{ item.name }}</span>
				</li>
			</ul>
		</div>
	</NuxtLink>
</template>
