<script></script>

<template>
	<NuxtLayout name="engagement">
		<div class="flex">
			<!-- ----------------Message type links----------- -->
			<div
				class="flex flex-col space-y-8 text-xl py-10 secondary-text font-medium w-[15%]"
			>
				<nuxt-link active-class="text-primary-600" to="/app/support-contact"
					>Supports</nuxt-link
				>
				<nuxt-link
					active-class="text-primary-600"
					to="/app/support-contact/service-requests"
					>Service Requests</nuxt-link
				>
				<nuxt-link
					active-class="text-primary-600"
					to="/app/support-contact/contact-us"
					>Contact Us</nuxt-link
				>
			</div>

			<div class="w-[85%] pl-10 border-l">
				<slot></slot>
			</div>
		</div>
	</NuxtLayout>
</template>
