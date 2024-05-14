<script setup>
import listQuery from "@/graphql/query/locations/getCities.gql";
import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Object,
	},
});

const { notify } = useNotify();

/**------------------------------City Data Fetch--------------- */
const selectedItem = ref(props.modelValue);
const items = ref([]);
const search = ref("");
const sort = ref([{ name: "ASC_NULLS_LAST" }]);
const limit = ref(20);
const offset = ref(0);

/**------------------Filter---------------- */
const filter = computed(() => {
	let query = {
		name: {
			_ilike: `%${search.value}%`,
		},
	};
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
	if (result.data?.basicsCities) {
		items.value = result.data.basicsCities;
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
		id="city"
		placeholder="Select City"
		name="city"
		label="City"
		:loading="loading"
		rules="required"
	></HSingleSelectWithSearch>
</template>
