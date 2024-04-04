<script setup>
const navs = ref([
	{
		name: "Billings",
		icon: "solar:bill-list-bold",
		to: "/app/billings",
	},
	{
		name: "Pricing",
		icon: "tabler:box",
		to: "/app/pricing",
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
					class="fixed top-0 left-0 flex flex-col h-screen min-w-[300px] px-6 space-y-12 overflow-y-auto border-r border-gray-200 grow gap-y-5 bg-primary-600 scroll"
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
						<UiSidebar
							:navs="navs"
							:layout="{
								name: 'Billings',
								icon: 'solar:bill-check-broken',
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
