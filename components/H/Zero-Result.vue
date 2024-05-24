<script setup>
const props = defineProps({
	text: {
		type: String,
	},
});
</script>

<template>
	<div class="w-full flex flex-col items-center">
		<img class="w-80" src="/images/static/empty-folder.png" alt="" />
		<p class="text-gray-600 text-2xl">{{ text || "No records available" }}</p>
	</div>
</template>
