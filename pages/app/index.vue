<script setup>
import aggregates from "@/graphql/query/aggregate/inroduction.gql";
const engagement = ref({
	heading: {
		name: "Engagement",
		icon: "solar:chat-round-like-linear",
		totalNotification: 0,
	},
	content: [
		{
			name: "Places Management",
			icon: "uil:shop",
			notifications: 0,
		},

		{
			name: "Sheger Reviews",
			icon: "ri:menu-unfold-fill",
			notifications: 0,
		},
		{
			name: "Moderation",
			icon: "ph:flag-light",
			notifications: 0,
		},
		{
			name: "Support & Contact",
			icon: "mingcute:service-fill",
			notifications: 0,
		},
		{
			name: "Broadcast",
			icon: "ri:megaphone-line",
			notifications: 0,
		},
	],
});

const advertisement = ref({
	heading: {
		name: "Advertisement",
		icon: "formkit:megaphone",
		totalNotification: 0,
	},
	content: [
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
	],
});

const billing = ref({
	heading: {
		name: "Billings",
		icon: "solar:bill-check-broken",
		totalNotification: 0,
	},
	content: [
		{
			name: "Payment Management",
			icon: "solar:bill-list-bold",
			notifications: 0,
		},
		{
			name: "Pricing Packages",
			icon: "tabler:box",
			notifications: 0,
		},
	],
});

const configuration = ref({
	heading: {
		name: "Configuration",
		icon: "icon-park-outline:config",
		totalNotification: 0,
	},
	content: [
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
	],
});

/*-------------------------Fetch Aggregate Data------------------------- */
const {
	onResult: aggregateResult,
	onError: aggregateError,
	loading: aggregateLoading,
	refetch: refetchAggregate,
} = authFetch(aggregates, {
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
});

aggregateResult(({ data }) => {
	/*-------------------------Set Engagment Data------------------------- */
	engagement.value.content[2].notifications = data.report.aggregate.count;
	engagement.value.content[3].notifications =
		data.contact.aggregate.count +
		data.support.aggregate.count +
		data.service.aggregate.count;

	engagement.value.heading.totalNotification =
		engagement.value.content[2].notifications +
		engagement.value.content[3].notifications;

	/*-------------------------Set Billing Data------------------------- */
	billing.value.content[0].notifications = data.billing.aggregate.count;
	billing.value.heading.totalNotification =
		billing.value.content[0].notifications;
});
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
					:layout="engagement.heading"
					:content="engagement.content"
				/>
				<UiCardsIntroduction
					link="/app/featured-places"
					:layout="advertisement.heading"
					:content="advertisement.content"
				/>
				<UiCardsIntroduction
					link="/app/billings"
					:layout="billing.heading"
					:content="billing.content"
				/>
				<UiCardsIntroduction
					link="/app/administrators"
					:layout="configuration.heading"
					:content="configuration.content"
				/>
			</div>
		</div>
		<p class="text-xl font-medium text-center">&copy; Minab it Solution</p>
	</div>
</template>
