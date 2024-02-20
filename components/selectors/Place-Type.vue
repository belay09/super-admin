<script setup>
import placeTypeQuery from "@/graphql/query/basics/getPlaceTypes.gql";

import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Number,
	},
});

const { notify } = useNotify();

/*---------------------------Place Places---------------------------**/
const placeTypeItems = ref([]);
const placeTypeSearch = ref("");
const Place = ref(props.modelValue);

const placeFilter = ref({});

const {
	onResult: onResultPlace,
	onError: onErrorPlace,
	loading: loadingPlace,
	refetch: refetchPlace,
	fetchMore: fetchMorePlace,
} = authListQuery(placeTypeQuery, placeFilter, "", 0, 5);

onResultPlace((result) => {
	placeTypeItems.value = result.data?.placeTypes;
});

function makeSearch(value) {
	placeTypeSearch.value = value;
}

watch(
	() => props.modelValue,
	(value) => {
		Place.value = value;
	}
);

watch(
	() => Place.value,
	(value) => {
		emit("update:modelValue", value);
	}
);
</script>

<template>
	<H-SingleSelectWithSearch
		:items="placeTypeItems"
		v-model="Place"
		@search="makeSearch"
		id="placeType"
		name="placeType"
		label="place Type"
		:loading="loadingPlace"
	></H-SingleSelectWithSearch>
</template>
