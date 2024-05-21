<script setup>
import "vue3-carousel/dist/carousel.css";
import { Carousel, Navigation, Slide } from "vue3-carousel";

const props = defineProps({
	images: {
		type: Array,
		required: true,
	},
	showNavigation: {
		type: Boolean,
		required: false,
		default: true,
	},
});

/*....................Carsoul.............*/

const currentSlide = ref(0);
const imageCarousel = ref(null);

const breakpoints = {
	1024: {
		itemsToShow: 3.2,
		snapAlign: "start",
		itemsToScroll: 1,
	},
	1280: {
		itemsToShow: 3.6,
		snapAlign: "start",
		itemsToScroll: 1,
	},
	1536: {
		itemsToShow: 3.6,
		snapAlign: "start",
		itemsToScroll: 1,
	},
};

/*....................for scroll event.............*/
const lastScrolled = ref(new Date().getTime());
const scrollContainer = ref(null);
let touchStartX = 0;

const onScroll = (event) => {
	if (event && event.deltaX && !event.touches && isTouchpadScrollEvent(event)) {
		// Prevent the default scroll behavior
		event.preventDefault();

		// Determine the scroll direction
		const deltaX = event.deltaX;
		const direction = deltaX > 0 ? "right" : "left";

		if (direction === "right") {
			imageCarousel.value.next();

			// Scroll right action
		} else {
			imageCarousel.value.prev();

			// Scroll left action
		}
		lastScrolled.value = new Date().getTime();
	}
};

const onTouchStart = (event) => {
	if (event.touches && event.touches.length === 1) {
		touchStartX = event.touches[0].clientX;
	}
};

const onTouchMove = (event) => {
	if (event.touches && event.touches.length === 1) {
		const touchX = event.touches[0].clientX;
		const deltaX = touchX - touchStartX;

		if (isTouchpadScrollEvent(event)) {
			// Prevent the default scroll behavior
			event.preventDefault();
		}
	}
};

const isTouchpadScrollEvent = (event) => {
	// Check if the event is from a touchpad scroll
	return event.deltaX !== 0 && event.deltaMode === 0;
};

onMounted(() => {
	setTimeout(() => {
		imageCarousel.value.next();
	}, 4000);
});
</script>

<template>
	<div class=" ">
		<Carousel
			:breakpoints="breakpoints"
			v-model="currentSlide"
			ref="imageCarousel"
			class=""
		>
			<Slide
				v-for="mediaItem in images"
				:key="mediaItem.media?.url"
				ref="scrollContainer"
				:class="``"
				@wheel="onScroll"
				@touchstart="onTouchStart"
				@touchmove="onTouchMove"
			>
				<!-- ---------------If type is Image---------------- -->
				<div v-if="mediaItem.isImage" class="w-full" @click="move">
					<img
						class="w-full h-[26rem] object-cover object-center"
						:src="mediaItem.media?.url"
						:alt="`image`"
						loading="lazy"
					/>
				</div>
				<!-- -----------------If type is Video---------------- -->
				<div v-else class="w-full" @click="move">
					<video
						class="w-full h-[26rem] object-cover object-center"
						:src="mediaItem.media?.url"
						:alt="`video`"
						autoplay
						loop
					/>
				</div>
			</Slide>

			<template #addons>
				<Navigation class="bg-red-600" v-if="showNavigation" />
			</template>
		</Carousel>
	</div>
</template>

<style scoped>
.carousel__icon {
	z-index: 1000;
	color: white !important;
}

.carousel__pagination-button {
	width: 16px !important;
	height: 16px !important;
	background-color: #ff9f9f !important;
	border-radius: 100% !important;
}

.carousel__pagination-button--active {
	border-radius: 3rem !important;
	background-color: #d34553 !important;
	width: 60px !important;
	/* @apply rounded-sm; */
}

.carousel__pagination-button::after {
	display: none !important;
}

.carousel__pagination {
	display: flex !important;
	justify-content: center !important;
	align-items: center !important;
	margin-left: 2rem !important;
}
.carousel__pagination-item {
	margin: 0 0.5rem !important;
}

.carousel__next,
.carousel__prev {
	@apply bg-black bg-opacity-30 w-14 h-14 rounded-full duration-200 !important;
}

.carousel__prev {
	/* @apply -left-9 !important; */
}
.carousel__next {
	/* @apply -right-9 !important; */
}

.carousel__next--disabled,
.carousel__prev--disabled {
	@apply hidden !important;
}

@media screen and (max-width: 768px) {
	.carousel__pagination-button {
		width: 6px !important;
		height: 6px !important;
		background-color: #ff9f9f !important;
		border-radius: 100% !important;
	}

	.carousel__pagination-button--active {
		border-radius: 3rem !important;
		background-color: #d34553 !important;
		width: 40px !important;
		/* @apply rounded-sm; */
	}

	.carousel__pagination-button::after {
		display: none !important;
	}

	.carousel__pagination {
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		margin-left: 2rem !important;
	}
	.carousel__pagination-item {
		margin: 0 0.2rem !important;
	}
	.carousel__pagination {
		margin-left: 0 !important;
	}

	.carousel__next,
	.carousel__prev {
		@apply bg-black bg-opacity-30 w-6 h-6 rounded-full duration-200 !important;
	}

	.carousel__prev {
		@apply -left-6 !important;
	}
	.carousel__next {
		@apply -right-6 !important;
	}
}
@media screen and (max-width: 360px) {
	.carousel__prev {
		@apply -left-6 !important;
	}
	.carousel__next {
		@apply -right-6 !important;
	}
}
</style>
