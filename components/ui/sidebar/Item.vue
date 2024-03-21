<script setup>
defineProps({
	name: String,
});
</script>
<template>
	<nuxt-link
		:to="`${name.toLowerCase()}`"
		class="flex px-6 py-4 text-lg font-medium leading-6 text-white rounded-md group gap-x-4"
		:class="[
			name != '/app' && $route.path.includes(name)
				? ' bg-white !text-gray-950'
				: '',
		]"
	>
		<!-- <Icon name="streamline:insert-side" size="24" color="" /> -->
		<div>
			<slot name="icon"></slot>
		</div>
		<div>
			<slot name="title"></slot>
		</div>
	</nuxt-link>
</template>
