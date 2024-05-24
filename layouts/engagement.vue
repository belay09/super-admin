<script setup>
const navs = ref([
	{
		name: "Dashboard",
		icon: "material-symbols:dashboard-outline",
		to: "/app/dashboard",
	},
	{
		name: "Entity",
		icon: "mdi:company",
		to: "/app/entity",
	},
	{
		name: "Place",
		icon: "uil:shop",
		to: "/app/places",
	},

	{
		name: "Sheger Reviews",
		icon: "ri:menu-unfold-fill",
		to: "/app/sheger-reviews",
	},
	{
		name: "Moderation",
		icon: "ph:flag-light",
		to: "/app/reports",
	},
	{
		name: "Support & Contact",
		icon: "mingcute:service-fill",
		to: "/app/support-contact",
	},
	// {
	// 	name: "Broadcast",
	// 	icon: "ri:megaphone-line",
	// 	to: "/app/broadcast",
	// },
]);
</script>

<template>
	<!-- ----------------To use notify inside the pages------------ -->
	<HNotification />
	<div class="">
		<div class="flex">
			<div
				class="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col"
			>
				<!-- Sidebar component, swap this element with another sidebar if you like -->
				<div
					class="fixed top-0 left-0 flex flex-col h-screen px-6 overflow-y-auto border-r border-gray-200 grow gap-y-32 bg-primary-600 scroll"
				>
					<NuxtLink
						to="/app"
						class="flex flex-col items-center justify-center h-16 gap-2 pt-20 mt-8 shrink-0"
					>
						<img
							class="object-contain w-auto h-24"
							src="/images/static/sheger-logo.png"
							alt="Sheger Admin Logo"
						/>
						<div>
							<p class="text-lg font-semibold text-white">Sheger Gebeta</p>
							<!-- <p class="text-lg font-semibold text-white"></p> -->
						</div>
					</NuxtLink>
					<nav class="flex flex-col flex-1">
						<UiSidebar
							:navs="navs"
							:layout="{
								name: 'Engagement',
								icon: 'solar:chat-round-like-linear',
							}"
						/>
					</nav>
				</div>
			</div>

			<main class="relative flex flex-col w-full">
				<!-- ------------------------------Top bar -------------------->
				<CommonTopNavBar />
				<div class="h-full px-10 py-6 pr-16 overflow-y-scroll">
					<!-- Main area -->
					<slot />
				</div>
			</main>
		</div>
	</div>
</template>
