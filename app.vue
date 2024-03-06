<template>
	<div class="dark:bg-sheger_brown-300">
		<NuxtLoadingIndicator />
		<NuxtLayout>
			<NuxtPage></NuxtPage>
		</NuxtLayout>
		<!-- <NuxtPage /> -->
		<!-- <div id="loading">Loading...</div> -->
	</div>
</template>
<style>
/* Define your skeleton style */
.skeleton {
	background-color: #f0f0f0; /* Light gray background color */
	border-radius: 4px;
}

/* Define animation for skeleton loading */
@keyframes fadeInOut {
	0%,
	100% {
		opacity: 0.5;
	}
	50% {
		opacity: 1;
	}
}

/* Apply animation to skeleton container */
.skeleton-container {
	animation: fadeInOut 1.5s infinite;
}
</style>
