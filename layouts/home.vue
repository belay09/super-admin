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
	<!-- ----------------To use notify inside the pages------------ -->
	<HNotification />
	<div class="">
		<div class="flex">
			<div
				class="hidden h-screen lg:inset-y-0 lg:z-50 lg:flex lg:w-96 lg:flex-col"
			>
				<!-- Sidebar component, swap this element with another sidebar if you like -->
				<div
					class="fixed top-0 left-0 flex flex-col h-screen px-6 overflow-y-auto border-r border-gray-200 grow gap-y-5 bg-primary-600 scroll"
				>
					<div class="flex items-center h-16 gap-x-2 shrink-0">
						<img
							class="w-auto h-12"
							src="/images/static/logo.png"
							alt="Sheger Admin Logo"
						/>
						<div>
							<p class="text-lg font-semibold text-white">Sheger</p>
							<p class="text-lg font-semibold text-white">Gebeta</p>
						</div>
					</div>
					<nav class="flex flex-col flex-1">
						<ul role="list" class="flex flex-col flex-1 gap-y-7">
							<li>
								<ul role="list" class="mx-2 space-y-1">
									<UiSidebar
										:navs="navs"
										:layout="{
											name: 'Dashboard',
											icon: 'material-symbols:dashboard-outline',
										}"
									/>
								</ul>
							</li>
						</ul>
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
