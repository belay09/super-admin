<script setup>
import placeLocationQuery from "@/graphql/query/places/getPlaceLocations.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Number,
	},
	place_Id: {
		type: Number,
	},
});

const { notify } = useNotify();

/***---------------------Place data fetch--------------------- */
const placeLocations = ref([]);
const placeLocation = ref(props.modelValue);
const limit = ref(100);
const length = ref(0);
const sort = ref([{ id: "ASC_NULLS_LAST" }]);
const offset = ref(0);
const search = ref("");

/**-------------------Compute filter---------------- */
const filter = computed(() => {
	let query = {};
	query._and = [
		{
			area: {
				name: {
					_ilike: `%${search.value}%`,
				},
			},
		},
		{
			placeId: {
				_eq: props.place_Id,
			},
		},
	];

	return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
	placeLocationQuery,
	filter,
	sort,
	offset,
	limit
);
onResult((result) => {
	// Check if result.data.placeLocation exists
	if (result.data?.placeLocations) {
		// Map the placeLocation items to a new structure and assign to placeLocations.value

		placeLocations.value = result.data?.placeLocations.map((item) => {
			return {
				id: item.id,
				name: item.area.name,
			};
		});

		// Update the length.value based on the count from result.data.placeLocationsAggregate.aggregate
		length.value = result.data.placeLocationsAggregate?.aggregate?.count;
	}
});

onError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

function makeSearch(value) {
	search.value = value;
}

watch(
	() => props.modelValue,
	(value) => {
		placeLocation.value = value;
	}
);

watch(
	() => placeLocation.value,
	(value) => {
		emit("update:modelValue", value);
	}
);
</script>

<template>
	<Lazy-H-SingleSelectWithSearch
		:items="placeLocations"
		v-model="placeLocation"
		@search="makeSearch"
		id="PlaceLocation"
		name="PlaceLocation"
		label="Place Location"
		:loading="loading"
	></Lazy-H-SingleSelectWithSearch>
</template>
