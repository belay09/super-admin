<script setup>
import drinksQuery from "@/graphql/query/drinks/mini.gql";

import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Number,
	},
});

const { notify } = useNotify();

/***---------------------menu data fetch--------------------- */
const items = ref([]);
const item = ref(props.modelValue);
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
			title: {
				_ilike: `%${search.value}%`,
			},
		},
	];

	return query;
});

const { onResult, onError, loading, refetch } = authListQuery(
	drinksQuery,
	filter,
	sort,
	offset,
	limit
);
onResult((result) => {
	if (result.data?.basicsDrinks) {
		items.value = result.data.basicsDrinks;
		length.value = result.data.basicsDrinksAggregate?.aggregate?.count;
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
		item.value = value;
	}
);

watch(
	() => item.value,
	(value) => {
		emit("update:modelValue", value);
	}
);
</script>

<template>
	<Lazy-H-SingleSelectWithSearch
		:items="items"
		v-model="item"
		@search="makeSearch"
		id="drink"
		name="drink"
		label="Drinks"
		:loading="loading"
	></Lazy-H-SingleSelectWithSearch>
</template>
