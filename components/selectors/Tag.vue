<script setup>
import placeTagQuery from "@/graphql/query/tags/mini.gql";

import useNotify from "@/use/notify";

/**-----------------Global Variables--------------------------- */
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
	modelValue: {
		type: Number,
	},
});

const { notify } = useNotify();

/*---------------------------Place Tags---------------------------**/
const placeTagItems = ref([]);
const placeTagSearch = ref("");
const tag = ref(props.modelValue);

const tagFilter = computed(() => {
	let query = {};
	if (placeTagSearch.value) {
		console.log(placeTagSearch.value, "placeTagSearch");
		query.title = {
			_ilike: `%${placeTagSearch.value}%`,
		};
	}
	return query;
});

const {
	onResult: onResultTag,
	onError: onErrorTag,
	loading: loadingTag,
	refetch: refetchTag,
	fetchMore: fetchMoreTag,
} = authListQuery(placeTagQuery, tagFilter, "", 0, 5);

onResultTag((result) => {
	placeTagItems.value = result.data?.basicsTags;
});

function makeSearch(value) {
	placeTagSearch.value = value;
}

watch(
	() => props.modelValue,
	(value) => {
		tag.value = value;
	}
);

watch(
	() => tag.value,
	(value) => {
		emit("update:modelValue", value);
	}
);
</script>

<template>
	<h-multi-select-chips
		multiple
		chipsStyle="rounded-full border-[1px] border-gray-600 py-1 px-2 hover:border-primary/40"
		:items="placeTagItems"
		v-model="tag"
		value="id"
		showBy="name"
		listClass="h-40"
		returnBy="id"
		name="tag"
		label="Tag"
		placeholder="Select Tag"
		@search="makeSearch"
		:loading="loadingTag"
	>
	</h-multi-select-chips>
</template>
