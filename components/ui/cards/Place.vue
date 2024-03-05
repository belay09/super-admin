<script setup>
import { onClickOutside } from "@vueuse/core";
import editPlaceMutation from "@/graphql/mutations/place/changePlaceStatus.gql";
import useNotify from "@/use/notify";
import getMainLocation from "@/helpers/main-location";
/**----------------------Globals-------------------------- */
const { notify } = useNotify();
const router = useRouter();
const props = defineProps({
	place: {
		type: Object,
		required: true,
	},
});

/***---------------------------Main location---------------------- */
const mainLocation = ref(getMainLocation(props.place?.placeLocations));
/**--------------------Featured place value------------- */
function featuredPlaceValue(value) {
	if (value === "RECENTLY_OPENED_PLACE") {
		return {
			name: "Recently Opened",
			class: " text-[#47FF6F]",
		};
	} else if (value === "WEEKLY_RECOMMENDED_PLACE") {
		return {
			name: "Weekly Recommended",
			class: "text-[#9747FF]",
		};
	} else if (value === "SEASONAL_PLACE") {
		return {
			name: "Seasonal",
			class: "text-[#477BFF]",
		};
	}
}

/**--------------------------Click outside------------------- */
const featureActionsContainer = ref(null);
onClickOutside(featureActionsContainer, (e) => (showMoreAction.value = false));

/**----------------------Detail page------- */

function gotoDetailPage() {
	console.log("gotoDetailPage", props.place.id);
	router.push(`/app/places/${props.place.id}`);
}

function gotoEditPage(event) {
	event.stopPropagation();

	router.push({
		path: `/app/places/edit/${props.place.id}`,
		query: {
			step: 0,
		},
	});
}

/**------------------------Edit place----------------------- */
const refetchPlaces = inject("refetch");
const {
	mutate: editMutate,
	onDone: editDone,
	onError: editError,
	loading: editLoading,
} = authMutation(editPlaceMutation);

editDone(() => {
	refetchPlaces();
	notify({
		title: "Updated successfully",
		description: "Updated successfully",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});
	showRevokeBadgeModal.value = false;
	showActivatePlaceModal.value = false;
	showPendPlaceModal.value = false;
	showSuspendPlaceModal.value = false;
	showClosePlaceModal.value = false;
});

editError((error) => {
	showRevokeBadgeModal.value = false;
	showActivatePlaceModal.value = false;
	showPendPlaceModal.value = false;
	showSuspendPlaceModal.value = false;
	showClosePlaceModal.value = false;

	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",

		borderClass: "border-l-8 border-red-300",
	});
});

/**-------------------------Handle revoke badge--------------- */
const handleRevoke = () => {
	let input = {
		shegerRecommendationId: null,
	};
	editMutate({ input, id: props.place.id });
};

const handleChangePlaceStatus = (status) => {
	let input = {
		status,
	};
	editMutate({ input, id: props.place.id });
};

/***-----------------Modals--------------------------- */
const showMoreAction = ref(false);

/**-----------------------------Assign Badge------------------- */

const showAssignBadgeModal = ref(false);
function toggleAssignBadgeModal(event) {
	event.stopPropagation();
	showAssignBadgeModal.value = !showAssignBadgeModal.value;
}

/**-----------------------Revoke Badge Modal---------------- */
const showRevokeBadgeModal = ref(false);
function toggleRevokeBadgeModal(event) {
	event.stopPropagation();
	showRevokeBadgeModal.value = !showRevokeBadgeModal.value;
}

/**-----------------------Activate Place Modal---------------- */
const showActivatePlaceModal = ref(false);
function toggleActivatePlaceModal(event) {
	event.stopPropagation();
	showActivatePlaceModal.value = !showActivatePlaceModal.value;
}

/**-------------------------Pend Place Modal------------------------ */

const showPendPlaceModal = ref(false);
function togglePendPlaceModal(event) {
	event.stopPropagation();
	showPendPlaceModal.value = !showPendPlaceModal.value;
}

/**-------------------------Suspend Place Modal------------------------ */

const showSuspendPlaceModal = ref(false);
function toggleSuspendPlaceModal(event) {
	event.stopPropagation();
	showSuspendPlaceModal.value = !showSuspendPlaceModal.value;
}

/**-------------------------Close Place Modal------------------------ */

const showClosePlaceModal = ref(false);
function toggleClosePlaceModal(event) {
	showClosePlaceModal.value = !showClosePlaceModal.value;
	event.stopPropagation();
}

function openMoreAction(event) {
	event.stopPropagation();
	showMoreAction.value = !showMoreAction.value;
}
</script>
<template>
	<!-- -------------------Assign Badge Modal--------------- -->
	<Modals-Modal
		:autoClose="true"
		:modelValue="showAssignBadgeModal"
		bodyClass="lg:max-w-3xl"
	>
		<template #header>
			<div class="flex items-center justify-between pb-4">
				<h3 class="text-lg font-medium text-gray-900">Assign Badge</h3>
				<button @click="showAssignBadgeModal = false">
					<Icon name="system-uicons:close" class="text-4xl" />
				</button>
			</div>
		</template>
		<template #content>
			<Places-AssignBadge
				@close="showAssignBadgeModal = false"
				:place="place"
			></Places-AssignBadge>
		</template>
	</Modals-Modal>

	<!-- -----------------------Revoke Badge Modal---------------- -->
	<ModalsConfirmation
		@confirm="handleRevoke"
		v-model="showRevokeBadgeModal"
		title="Revoke Badge"
		sure-question="Are you sure you want to revoke the badge ?"
		description="This action is irreversible and will permanently remove the badge"
	></ModalsConfirmation>

	<!-- -----------------------Make Active Place Modal---------------- -->
	<ModalsConfirmation
		@confirm="handleChangePlaceStatus('ACTIVE')"
		v-model="showActivatePlaceModal"
		title="Activate Place"
		sure-question="Are you sure you want to activate the place?"
		description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
	></ModalsConfirmation>

	<!-- -----------------------Make Pending Place Modal---------------- -->
	<ModalsConfirmation
		@confirm="handleChangePlaceStatus('PENDING')"
		v-model="showPendPlaceModal"
		title="Pend Place"
		sure-question="Are you sure you want to pend the place?"
		description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
	></ModalsConfirmation>
	<!-- -----------------------Close Place Modal---------------- -->
	<ModalsConfirmation
		@confirm="handleChangePlaceStatus('CLOSED')"
		v-model="showClosePlaceModal"
		title="Close Place"
		sure-question="Are you sure you want to close the place?"
		description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
	></ModalsConfirmation>

	<!-- -----------------------Suspend Place Modal---------------- -->
	<ModalsConfirmation
		@confirm="handleChangePlaceStatus('SUSPENDED')"
		v-model="showSuspendPlaceModal"
		title="Suspend Place"
		sure-question="Are you sure you want to suspend the place?"
		description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
	></ModalsConfirmation>

	<div
		@click="gotoDetailPage"
		class="flex flex-col border max-w-lg p-[25px] rounded-xl text-sm hover:cursor-pointer"
	>
		<!-- Header -->
		<div class="flex items-start justify-between">
			<div class="flex w-full gap-3">
				<!--------------------Place image and name---------- -->
				<div class="self-start w-20 h-20 mr-1 shrink-0">
					<img
						:src="place.light_logo?.url"
						alt=""
						class="object-cover w-full h-full rounded-xl"
					/>
				</div>

				<!-- ------------------Place name and  status--------------- -->
				<div class="flex flex-col w-full gap-2">
					<!-- Name -->
					<div class="flex justify-between">
						<h1 class="text-xl font-medium">{{ place.name }}</h1>
						<!-- Option Icon -->

						<div class="relative">
							<button @click="openMoreAction" class="hover:cursor-pointer">
								<Icon name="iwwa:option" class="w-8 h-8" />
							</button>

							<!-- -----------------------Extend date and Remove from feature --------------- -->
							<div
								ref="featureActionsContainer"
								v-if="showMoreAction"
								class="absolute left-0 flex flex-col p-5 bg-white rounded-lg shadow-xl top-7 w-72 gap-y-4"
							>
								<button class="flex items-center gap-3">
									<Icon
										name="icon-park-outline:bill"
										class="text-2xl shrink-0"
									/>
									<p class="text-lg">Billing</p>
								</button>
								<button @click="gotoEditPage" class="flex items-center gap-3">
									<Icon name="uil:edit-alt" class="text-2xl shrink-0" />
									<p class="text-lg">Update Place Info</p>
								</button>
								<button
									@click="toggleAssignBadgeModal"
									class="flex items-center gap-3"
								>
									<Icon name="cil:badge" class="text-2xl shrink-0" />
									<p class="text-lg">Assign a badge</p>
								</button>
								<button
									v-if="place.shegerRecommendation"
									@click="toggleRevokeBadgeModal"
									class="flex items-center gap-3"
								>
									<Icon
										name="cil:badge"
										class="text-2xl shrink-0 text-primary-600"
									/>
									<p class="text-lg">Revoke a badge</p>
								</button>

								<!-- ----------------Activate Place---------- -->
								<button
									@click="toggleActivatePlaceModal"
									class="flex items-center gap-3"
								>
									<Icon name="majesticons:open" class="text-2xl shrink-0" />
									<p class="text-lg whitespace-nowrap">Activate Place</p>
								</button>

								<!-- ----------------Pend Place---------- -->
								<button
									@click="togglePendPlaceModal"
									class="flex items-center gap-3"
								>
									<Icon name="carbon:pending" class="text-2xl shrink-0" />
									<p class="text-lg whitespace-nowrap">Pend Place</p>
								</button>

								<!-- ----------------Suspend Place---------- -->
								<button
									@click="toggleSuspendPlaceModal"
									class="flex items-center gap-3"
								>
									<Icon name="ci:stop-sign" class="text-2xl shrink-0" />
									<p class="text-lg whitespace-nowrap">Suspend Place</p>
								</button>
								<!-- ----------------Close Place---------- -->
								<button
									@click="toggleClosePlaceModal"
									class="flex items-center gap-3"
								>
									<Icon name="bi:door-closed" class="text-2xl shrink-0" />
									<p class="text-lg text-primary-600 whitespace-nowrap">
										Close Place
									</p>
								</button>
							</div>
						</div>
					</div>
					<!------------------------ status----------------------- -->
					<div class="flex flex-wrap gap-x-4 gap-y-2">
						<div class="px-2 py-1 rounded-sm bg-sheger-green-100">
							<p class="font-medium capitalize text-sheger-green-600">
								{{ place.status.toLowerCase() }}
							</p>
						</div>
						<div class="px-2 py-1 rounded-sm bg-primary-100">
							<p class="font-medium capitalize text-primary-600">
								{{ place.type?.toLowerCase() }}
							</p>
						</div>
						<div
							v-for="(featuredType, index) in place.featured_places"
							class="px-2 py-1 bg-gray-100 rounded-sm"
							:class="
								featuredPlaceValue(featuredType.featured_place_type?.value)
									.class
							"
							:key="index"
						>
							<p class="font-medium">
								{{
									featuredPlaceValue(featuredType.featured_place_type?.value)
										.name
								}}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- -------------------Other place data---------------- -->
		<div class="flex flex-col gap-4 my-2 text-sheger-gray-100">
			<!----------------- Rating , Review   and Like -------------->
			<CommonReviewRatingLike
				:rating="place.place_aggregate_summary?.avgRating || 0"
				:like="place.place_aggregate_summary?.sumLikes || 0"
				:review="place.placeReviewsAggregate?.aggregate?.count || 0"
			></CommonReviewRatingLike>
			<!-------------------- Location------------------ -->
			<div v-if="mainLocation" class="flex items-center gap-3">
				<Icon name="carbon:map" class="w-5 h-5" />
				<span class="underline decoration-sheger_brown-200 leading"
					>{{ mainLocation.area?.name }}, {{ mainLocation.city?.name }}</span
				>
			</div>
			<!---------------------- Tags ----------------------->
			<div class="flex flex-wrap pb-4 secondary-text">
				<p
					v-for="placeTag in place.placeTags"
					:key="placeTag.tag.id"
					class="pr-2"
				>
					#{{ placeTag.tag.title }}
				</p>
			</div>
			<!-- --------------------Menu update ---------------->

			<div class="flex items-center gap-3">
				<Icon name="carbon:calendar" class="w-5 h-5" />
				<p class="">Menu last updated: 2 days ago</p>
			</div>

			<!-- --------------------Last payed ----------------->
			<div class="flex items-center gap-3">
				<Icon name="carbon:calendar" class="w-5 h-5" />
				<p class="">Last payed: 2 days ago</p>
			</div>

			<!-- --------------------Award ----------------->
			<div v-if="place.shegerRecommendation" class="flex items-center gap-3">
				<Icon name="uil:award-alt" class="w-5 h-5" />
				<p class="">{{ place.shegerRecommendation.title }}</p>
			</div>
		</div>
	</div>
</template>
