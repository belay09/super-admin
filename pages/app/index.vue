<script setup>
const engagement = ref([
	{
		name: "Places Management",
		icon: "uil:shop",
	},

	{
		name: "Sheger Reviews",
		icon: "ri:menu-unfold-fill",
	},
	{
		name: "Moderation",
		icon: "ph:flag-light",
	},
	{
		name: "Support & Contact",
		icon: "mingcute:service-fill",
	},
	{
		name: "Broadcast",
		icon: "ri:megaphone-line",
	},
]);

const advertisement = ref([
	{
		name: "Featured Places",
		icon: "lucide:building",
	},

	{
		name: "Ad Space",
		icon: "icons8:advertising",
	},
	{
		icon: "fa6-solid:martini-glass-empty",
		name: "Sponsored drinks",
	},
]);

const billing = ref([
	{
		name: "Payment Management",
		icon: "solar:bill-list-bold",
	},
	{
		name: "Pricing Packages",
		icon: "tabler:box",
	},
]);

const configuration = ref([
	{
		name: "Administrators",
		icon: "bi:shield",
	},
	{
		name: "User Management",
		icon: "tabler:users",
	},
	{
		name: "System Configuration",
		icon: "streamline:insert-side",
	},
]);
</script>
<template>
	<div class="flex flex-col justify-between min-h-screen pb-6">
		<div class="relative">
			<div class="absolute z-50 flex items-center top-4 left-12">
				<img
					class="w-auto h-12"
					src="/images/static/logo.png"
					alt="Sheger Admin Logo"
				/>
				<div>
					<p class="text-lg font-semibold text-primary-600">Sheger</p>
					<p class="text-lg font-semibold text-primary-600">Gebeta</p>
				</div>
			</div>
			<CommonTopNavBar />
		</div>
		<div class="flex-grow py-8 space-y-28">
			<h1 class="text-2xl font-medium text-center">Sheger Gebeta</h1>
			<div class="flex items-center justify-center gap-x-8">
				<UiCardsIntroduction
					link="/app/dashboard"
					:layout="{
						name: 'Engagement',
						icon: 'solar:chat-round-like-linear',
					}"
					:content="engagement"
				/>
				<UiCardsIntroduction
					link="/app/featured-places"
					:layout="{
						name: 'Advertisement',
						icon: 'formkit:megaphone',
					}"
					:content="advertisement"
				/>
				<UiCardsIntroduction
					link="/app/billings"
					:layout="{
						name: 'Billings',
						icon: 'solar:bill-check-broken',
					}"
					:content="billing"
				/>
				<UiCardsIntroduction
					link="/app/administrators"
					:layout="{
						name: 'Configuration',
						icon: 'icon-park-outline:config',
					}"
					:content="configuration"
				/>
			</div>
		</div>
		<p class="text-xl font-medium text-center">&copy; Minab it Solution</p>
	</div>
</template>
