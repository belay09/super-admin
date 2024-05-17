<script setup>
import listQuery from "@/graphql/query/locations/getAreas.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Object,
	},
	cityId: {
		type: Number,
	},
});

const { notify } = useNotify();

/**------------------------------ARea Data Fetch--------------- */
const selectedItem = ref(props.modelValue);
const items = ref([]);
const search = ref("");
const sort = ref([{ name: "ASC_NULLS_LAST" }]);
const limit = ref(20);
const offset = ref(0);

/**------------------Filter---------------- */
const filter = computed(() => {
	let query = {};
	query._and = [
		{
			name: {
				_ilike: `%${search.value}%`,
			},
		},
		{
			cityId: {
				_eq: props.cityId,
			},
		},
	];

	return query;
});

const { onResult, onError, loading } = authListQuery(
	listQuery,
	filter,
	sort,
	offset,
	limit
);
onResult((result) => {
	if (result.data?.basicsAreas) {
		items.value = result.data.basicsAreas;
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
		selectedItem.value = value;
	}
);

watch(
	() => selectedItem.value,
	(value) => {
		emit("update:modelValue", value);
	}
);
</script>

<template>
	<HSingleSelectWithSearch
		:items="items"
		v-model="selectedItem"
		@search="makeSearch"
		id="area"
		placeholder="Select Area"
		name="area"
		label="Area"
		:loading="loading"
		rules="required"
	></HSingleSelectWithSearch>
</template>
