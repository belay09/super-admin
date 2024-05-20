<script setup>
const router = useRouter();
const route = useRoute();
const goToPlaceCreation = () => {
	router.push({
		path: "/app/places/register-new-place",
		query: {
			entityId: route.query.id,
		},
	});
};
const prev = () => {
	router.push({
		path: route.path,
		query: {
			step: 2,
			id: route.query.id,
			name: route.query.name,
		},
	});
};
</script>
<template>
	<div
		class="w-full mt-24 h-full flex flex-col gap-y-8 justify-center items-center"
	>
		<Icon name="iconamoon:file-check" class="text-9xl text-primary-600" />
		<h2 class="text-3xl font-bold text-primary-600">
			Entity created successfully
		</h2>
		<p class="text-center">
			know you can create a place using this entity <br />
			proceed to place creation
		</p>
		<button
			@click="goToPlaceCreation"
			class="primary-button bg-primary-600 text-white"
		>
			Register new place
		</button>
	</div>
	<div class="flex items-center justify-between my-2">
		<button
			class="primary-button border disabled:opacity-50 disabled:cursor-not-allowed flex items-center !px-12 gap-4 text-white bg-primary-600"
			@click="prev()"
		>
			<Icon name="material-symbols:arrow-back-ios" />
			Previous
		</button>
		<button
			type="button"
			:disabled="true"
			class="primary-button border disabled:opacity-50 disabled:cursor-not-allowed flex items-center !px-12 gap-4 text-white bg-primary-600"
		>
			Next
			<Icon name="material-symbols:arrow-forward-ios" />
		</button>
	</div>
</template>
