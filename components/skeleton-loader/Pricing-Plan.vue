<template>
	<div
		class="flex flex-col px-5 py-6 space-y-6 border border-gray-200 rounded-lg animate-pulse"
	>
		<!-- Pricing header -->
		<div class="flex justify-between">
			<div class="w-[40%] h-5 bg-gray-300 rounded-md"></div>
			<div class="flex items-center space-x-4">
				<div class="w-6 h-6 bg-gray-300 rounded-full"></div>
				<div class="w-6 h-6 bg-gray-300 rounded-full"></div>
			</div>
		</div>

		<!-- Pricing title -->
		<div class="w-[20%] h-3 bg-gray-300 rounded-md"></div>

		<!-- Pricing amount -->
		<div class="w-[60%] h-4 bg-gray-300 rounded-md"></div>

		<!-- Plan features -->
		<div class="flex flex-col space-y-8 secondary-text">
			<div v-for="i in 5" :key="i" class="flex gap-x-2">
				<div class="w-4 h-4 bg-gray-300 rounded-full"></div>
				<div class="w-[90%] h-4 bg-gray-300 rounded-md"></div>
			</div>
		</div>
	</div>
</template>
