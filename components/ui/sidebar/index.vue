<script setup>
const navs = ref([
	{
		name: "Dashboard",
		icon: "material-symbols:dashboard-outline",
		to: "/app/dashboard",
	},
	{
		name: "Place",
		icon: "uil:shop",
		to: "/app/places",
	},
	{
		name: "Featured Places",
		icon: "lucide:building",
		to: "/app/featured-places",
	},
	{
		name: "Sheger Reviews",
		icon: "ri:menu-unfold-fill",
		to: "/app/sheger-reviews",
	},
	{
		name: "Ad Space",
		icon: "icons8:advertising",
		to: "/app/ad_space",
	},
	{
		name: "User",
		icon: "tabler:users",
		to: "/app/users",
	},
	{
		icon: "fa6-solid:martini-glass-empty",
		name: "Sponsored drinks",
		to: "/app/sponsored_drinks",
	},
	{
		name: "Administrators",
		icon: "bi:shield",
		to: "/app/administrators",
	},
	{
		name: "Reports",
		icon: "ph:flag-light",
		to: "/app/reports",
	},
	{
		name: "Billings",
		icon: "solar:bill-list-bold",
		to: "/app/billings",
	},
	{
		name: "Configurations",
		icon: "streamline:insert-side",
		to: "/app/configurations",
	},
]);
</script>
<template>
	<div class="flex flex-col space-y-4 text-sheger-gray-100 pb-14">
		<!-- Dashbord -->
		<UiSidebarItem v-for="(nav, index) in navs" :key="index" :name="nav.to">
			<template #icon>
				<Icon :name="nav.icon" size="24" color="" />
			</template>
			<template #title>
				<p>{{ nav.name }}</p>
			</template>
		</UiSidebarItem>
		<!-- Places -->

		<nuxt-link
			to="/app/places/register-new-place"
			class="flex flex-col items-center px-6 py-8 mx-auto border rounded-lg cursor-pointer w-fit hover:bg-primary-600 hover:text-white"
		>
			<Icon name="lucide:building-2" class="text-xl" color="" />
			<div>
				<p>Register New Place</p>
			</div>
		</nuxt-link>
	</div>
</template>
