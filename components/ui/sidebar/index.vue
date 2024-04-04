<script setup>
const props = defineProps({
	navs: {
		type: Array,
		required: true,
	},
	layout: {
		type: Object,
		required: true,
	},
});
</script>
<template>
	<div class="flex flex-col justify-between h-full space-y-4 pb-14">
		<!-- Dashbord -->
		<div class="space-y-4">
			<UiSidebarItem v-for="(nav, index) in navs" :key="index" :name="nav.to">
				<template #icon>
					<Icon :name="nav.icon" size="24" color="" />
				</template>
				<template #title>
					<p>{{ nav.name }}</p>
				</template>
			</UiSidebarItem>
		</div>
		<!-- Places -->

		<nuxt-link
			to="/app"
			class="flex flex-col space-y-3 items-center px-6 w-full py-8 mx-auto border-2 border-white rounded-lg cursor-pointer hover:shadow-2xl duration-100 bg-white !text-gray-950"
		>
			<Icon :name="layout.icon" class="text-5xl" color="" />
			<div>
				<p class="text-xl">{{ layout.name }}</p>
			</div>
		</nuxt-link>
	</div>
</template>
