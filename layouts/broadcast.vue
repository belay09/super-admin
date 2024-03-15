<script></script>

<template>
	<NuxtLayout name="home">
		<div class="flex">
			<!-- ----------------Message type links----------- -->
			<div
				class="flex flex-col space-y-8 text-xl py-10 secondary-text font-medium w-[15%]"
			>
				<nuxt-link active-class="text-primary-600" to="/app/broadcast/sms"
					>SMS</nuxt-link
				>
				<nuxt-link
					active-class="text-primary-600"
					to="/app/broadcast/push-notification"
					>Push Notification</nuxt-link
				>
				<nuxt-link active-class="text-primary-600" to="/app/broadcast/email"
					>Email</nuxt-link
				>
			</div>

			<div class="w-[85%] min-h-[90vh] pl-10 border-l">
				<slot></slot>
			</div>
		</div>
	</NuxtLayout>
</template>
