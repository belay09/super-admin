<script setup>
import editReviewQuery from "@/graphql/mutations/reviews/edit.gql";

import getReviewQuery from "@/graphql/query/reviews/item.gql";
import insertMediaQuery from "@/graphql/mutations/medias/add-media.gql";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const route = useRoute();
const router = useRouter();

const { handleSubmit } = useForm();

const menuTypeItems = ref([
	{
		name: "Food",
		id: "FOODS",
	},
	{
		name: "Drink",
		id: "DRINKS",
	},
]);

/**------------------------Form Data----------------------- */

const images = ref([]);
const selectedThumbnail = ref();
const selectedPlaceLocation = ref();
const selectedPlaceID = ref();
const selectedDrinkId = ref();
const selectedDishId = ref([]);
const title = ref("");
const description = ref("");
const tags = ref();
const price = ref();
const type = ref();
const timeToPrepare = ref();
const youtubeVideoUrl = ref("");
const sides = ref("");

/*...................Review detail data fetch.............*/

const {
	onResult: reviewOnResult,
	onError: reviewOnError,
	loading: reviewLoading,
} = authItemQuery(getReviewQuery, route.params.id);

const reviewDataFetched = ref(false);

reviewOnResult(({ data }) => {
	if (data.reviewsByPk) {
		title.value = data.reviewsByPk.title;
		price.value = data.reviewsByPk.price;
		sides.value = data.reviewsByPk.sides;
		description.value = data.reviewsByPk.description;
		timeToPrepare.value = data.reviewsByPk.timeToPrepare;
		selectedPlaceID.value = data.reviewsByPk.place.id;
		selectedPlaceLocation.value = data.reviewsByPk.placeLocationId;
		selectedDrinkId.value = data.reviewsByPk.review_drink.drink.id;
		type.value = data.reviewsByPk.type;
		youtubeVideoUrl.value = data.reviewsByPk.youtubeVideoUrl;
		selectedDishId.value = data.reviewsByPk.menu_reviews.map((item) => {
			return item.menu;
		});
		selectedThumbnail.value = data.reviewsByPk.featured_media.url;
		images.value = data.reviewsByPk.review_medias.map((item) => {
			return item.media.url;
		});
		tags.value = data.reviewsByPk.review_tags.map((item) => {
			return {
				name: item.tag.title,
				id: item.tag.id,
			};
		});
	}
	reviewDataFetched.value = true;
});

reviewOnError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-green-300",
	});
});

/**------------------------Insert and drink Media----------------------- */
const {
	mutate: insertMedia,
	onError: insertMediaError,
	onDone: insertMediaDone,
	loading: insertMediaLoading,
} = authMutation(insertMediaQuery);

/**------------------------Edit Review----------------------- */
const {
	mutate: editReview,
	onError: editReviewError,
	onDone: editReviewDone,
	loading: editReviewLoading,
} = authMutation(editReviewQuery);

const onSubmit = handleSubmit(() => {
	insertMedia({
		input: {
			url: selectedThumbnail.value,
		},
		drink: {
			drinkId: selectedDrinkId.value,
		},
	});
});

/**------------------------Call review input mutate ----------------------- */

insertMediaDone(({ data }) => {
	const reviewInput = ref({
		title: title.value,
		description: description.value,
		price: price.value,
		type: type.value,
		timeToPrepare: timeToPrepare.value,
		youtubeVideoUrl: youtubeVideoUrl.value,
		sides: sides.value,
		placeId: selectedPlaceID.value,
		placeLocationId: selectedPlaceLocation.value,
		reviewedAt: new Date().toISOString(),
		drinkId: data.insertReviewDrinksOne.id,
		featuredImage: data.insertBasicsMediaOne.id,
	});

	const reviewMenu = selectedDishId.value.map((dish) => {
		return {
			menuId: dish,

			reviewId: route.params.id,
		};
	});

	const reviewTag = tags.value.map((tag) => {
		return {
			tagId: tag,
			reviewId: route.params.id,
		};
	});

	const reviewMedia = images.value.map((image) => {
		return {
			media: {
				data: {
					url: image,
				},
			},
			reviewId: route.params.id,
		};
	});

	editReview({
		id: route.params.id,
		input: reviewInput.value,
		reviewMediaInput: reviewMedia,
		reviewMenuInput: reviewMenu,
		reviewTagInput: reviewTag,
	});
});

insertMediaError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-green-300",
	});
});

/**------------------------Edit Review Done----------------------- */
editReviewDone(() => {
	notify({
		title: "Review Updated",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});

	router.push("/app/sheger-reviews");
});

editReviewError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-green-300",
	});
});

definePageMeta({
	layout: "home",
});
</script>

<template>
	<div class="px-20 pb-20" v-if="!reviewLoading && reviewDataFetched">
		<!-- --------------------------------Top-------------------------------- -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-medium">Update Review</h1>
			<div class="font-medium text-white border primary-button bg-primary-600">
				<button form="addReview" type="submit" class="mx-6">
					<span v-if="!editReviewLoading">Update Now</span>
					<Icon v-else name="eos-icons:bubble-loading" class="text-2xl" />
				</button>
			</div>
		</div>

		<!-- --------------------------------Form-------------------------------- -->
		<form id="addReview" @submit.prevent="onSubmit" class="flex gap-7">
			<!-- ------------------------------Left------------------------------- -->
			<div class="flex-[50%] space-y-4">
				<HTextfield
					name=" Title"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					v-model="title"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Title</p>
					</template>
				</HTextfield>

				<!------------------------------- Place--------------------------- -->

				<AdSpacePlaceSelector v-model="selectedPlaceID" />
				<!-- ------------------------------Place Location----------------------------->
				<SelectorsPlaceLocation
					:place_Id="selectedPlaceID"
					v-model="selectedPlaceLocation"
				/>
				<!-- ------------------------------Dish Title----------------------------->
				<SelectorsDish v-model="selectedDishId" :place_Id="selectedPlaceID" />

				<!-- ------------------------------Drinks----------------------------->
				<SelectorsDrinks v-model="selectedDrinkId" />
				<!-- ------------------------------Description-------------------------->

				<HTextarea
					name="description"
					id="description"
					label="Description"
					v-model="description"
				/>

				<!----------------------------------------------Price (ETB)------------------------------------------>

				<HTextfield
					type="number"
					name="Price"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					v-model="price"
				>
					<template #label>
						<p class="text-sheger-gray-100">Price (ETB)</p>
					</template>
				</HTextfield>
			</div>

			<!-----------------------------------Right---------------------------- -->
			<div class="flex-[50%] space-y-4">
				<!----------------------------------------Menu Type---------------------------------------->

				<H-SingleSelect
					name="menu_type"
					id="menu_type"
					label="Menu Type"
					:items="menuTypeItems"
					v-model="type"
				></H-SingleSelect>
				<!----------------------------------------Preparation Time (Minutes)-------------------------->

				<HTextfield
					type="number"
					name="Preparation Time"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					v-model="timeToPrepare"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Preparation Time (Minutes)</p>
					</template>
				</HTextfield>

				<!----------------------------------------Ingredient ( Use comma to seprate)---------------------------------------->
				<!--------------//TODO integrate ingredient-------------------->
				<HTextfield
					type="text"
					name="Ingredient"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">
							Ingredient ( Use comma to separate)
						</p>
					</template>
				</HTextfield>

				<!----------------------------------------Tag---------------------------------------->

				<SelectorsTag v-model="tags" />
				<!--------------------------------Video Url-------------------------- -->

				<HTextfield
					type="text"
					name="Video Url"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					placeholder="https://www.youtube.com/watch?v=Zz5cu72GQfE"
					rules="required"
					v-model="youtubeVideoUrl"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Video Url</p>
					</template>
				</HTextfield>

				<!--------------------------------Sides-------------------------- -->

				<HTextfield
					type="text"
					name="Side"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					v-model="sides"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Sides</p>
					</template>
				</HTextfield>

				<!----------------------------------------images Upload---------------------------------------->
				<p class="mb-2 text-sheger-gray-100">Upload images</p>

				<HFileUploadWrapper
					name="file"
					:maxFileSize="1024 * 1024 * 10"
					:fileLimit="3"
					folder="applications_form"
					description="upload file"
					placeholder="select multiple files"
					v-model="images"
					:init="images"
					:disabled="false"
					:showStar="false"
					v-model:thumbnails="selectedThumbnail"
				/>
			</div>
		</form>
	</div>
</template>
