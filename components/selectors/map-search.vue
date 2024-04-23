<script setup>
import { useDebounceFn } from "@vueuse/core";
const props = defineProps({
	modelValue: {
		type: Object,
		default: () => ({}),
	},
});

const emits = defineEmits(["update:modelValue"]);
const placeList = ref([]);

const selectedItem = ref();
const searchTerm = ref();

const geocode = async (query) => {
	const response = await fetch(
		`https://nominatim.openstreetmap.org/search?format=json&q=${query}`
	);
	await response.json().then((data) => {
		placeList.value = data.map((item) => {
			return {
				id: item.place_id,
				name: item.display_name,
				latlng: {
					lat: item.lat,
					lng: item.lon,
				},
			};
		});
	});
};

// watch(searchTerm, (value) => {
// 	setTimeout(() => {
// 		geocode(value);
// 	}, 1000);
// });

const debounceFn = useDebounceFn(() => {
	geocode(searchTerm.value);
}, 500);

const temp = (itm) => {
	searchTerm.value = itm;
	debounceFn();
};
watch(
	() => selectedItem.value,
	(value) => {
		emits("update:modelValue", value);
	}
);
</script>

<template>
	<HSingleSelectWithSearch
		:items="placeList"
		v-model="selectedItem"
		@search="temp"
		id="place_id"
		placeholder="Search Location..."
		name="city"
		:return-object="true"
		:loading="loading"
	></HSingleSelectWithSearch>
</template>
