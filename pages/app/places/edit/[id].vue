<script setup>
const route = useRoute();
const router = useRouter();
const currentStep = ref(0);

const placeId = route.params.id || -1;

// ---------------------------- Go Back Handler ----------------------------
const goPrev = () => {
	currentStep.value -= 1;
	router.push({ query: { step: currentStep.value } });
};

// ---------------------------- Go Next Handler ----------------------------
const goNext = () => {
	currentStep.value += 1;
	router.push({ query: { step: currentStep.value } });
};

onMounted(() => {
	if (route.query?.step) {
		currentStep.value = parseInt(route.query.step);
	}
});
watchEffect(() => {
	if (route.query?.step) {
		currentStep.value = parseInt(route.query.step);
	}
});

definePageMeta({
	layout: "engagement",
});
</script>
<template>
	<div>
		<!-- Top -->

		<!-- stepper -->
		<div class="flex justify-between h-20 my-4">
			<div
				class="rounded-tl-lg stepper-button"
				:class="
					currentStep == 0
						? '!bg-primary-200'
						: currentStep > 0
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Basic Info
			</div>
			<div
				class="stepper-button"
				:class="
					currentStep == 1
						? '!bg-primary-200'
						: currentStep > 1
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Location
			</div>
			<div
				class="stepper-button"
				:class="
					currentStep == 2
						? '!bg-primary-200'
						: currentStep > 2
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Amenities
			</div>
			<div
				class="stepper-button"
				:class="
					currentStep == 3
						? '!bg-primary-200'
						: currentStep > 3
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Portfolio
			</div>
			<div
				class="stepper-button"
				:class="
					currentStep == 4
						? '!bg-primary-200'
						: currentStep > 4
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Menu
			</div>
			<div
				class="stepper-button"
				:class="
					currentStep == 5
						? '!bg-primary-200'
						: currentStep > 5
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Pictures
			</div>
			<div
				class="rounded-tr-lg stepper-button"
				:class="
					currentStep == 6
						? '!bg-primary-200'
						: currentStep > 6
						? '!bg-primary-600 text-white'
						: ''
				"
			>
				Pricing Plan
			</div>
		</div>
		<div class="min-h-[70%] border flex flex-col justify-between px-5 py-2">
			<div class="h-full">
				<PlacesEditBasicInfo
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 0"
					:placeId="placeId"
				/>
				<PlacesFormLocation
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 1"
					:placeId="placeId"
				/>
				<PlacesFormAmenities
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 2"
					:placeId="placeId"
				/>
				<PlacesFormPortfolio
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 3"
					:placeId="placeId"
				/>
				<PlacesFormMenu
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 4"
					:placeId="placeId"
				/>
				<PlacesFormPictures
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 5"
					:placeId="placeId"
				/>
				<PlacesFormPricing
					@next="goNext"
					@prev="goPrev"
					v-if="currentStep == 6"
				/>
			</div>
		</div>
	</div>
</template>
