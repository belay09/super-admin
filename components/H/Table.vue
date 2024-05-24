<script setup>
const props = defineProps({
	headers: {
		type: Array,
	},
	hasRecordsPerPage: {
		type: Boolean,
	},
	hasDateFilter: {
		type: Boolean,
	},
	items: {
		type: Array,
	},
	//to store ids of checked items
	checkedItems: {
		type: Array,
		default: [],
	},
	checkedItemsData: {
		type: Array,
		default: [],
	},
	hasCheckBox: {
		type: Boolean,
		default: false,
	},
	rowStyle: {
		type: String,
		default: "",
	},
	rowHeadStyle: {
		type: String,
		default: "",
	},
	sort: {
		type: Array,
	},
	loading: {
		type: Boolean,
		default: true,
	},
	color1: String,
	color2: String,
	color3: String,
	supporterClass: {
		type: [String, Array],
	},
	supportHeaderClass: {
		type: String,
	},
	tableHeaderStyle: {
		type: String,
		default: "",
	},

	tableBodyRowStyle: {
		type: String,
		default: "",
	},
});

const emits = defineEmits([
	"click:row",
	"update:sort",
	"update:checkedItems",
	"update:checkedItemsData",
]);

const _get = useGet;
const _set = useSet;
const _sort = ref({});
onMounted(() => {
	props.sort.forEach((item) => {
		_sort.value = { ..._sort.value, ...item };
	});
});

const checkCheckedAll = computed(() => {
	return (
		props.checkedItems?.length == props.items?.length && props.items?.length > 0
	);
});

function sort_by(header) {
	if (header.sortable === false) return;

	let direction = _sort.value[header.value];
	if (direction && direction === "asc") {
		_sort.value[header.value] = "desc";
	} else if (direction && direction === "desc") {
		delete _sort.value[header.value];
	} else {
		_sort.value[header.value] = "asc";
	}

	let sort = [];
	Object.keys(_sort.value).forEach((key) => {
		let obj = {};
		_set(obj, key, _sort.value[key]);
		sort.push(obj);
	});
	emits("update:sort", sort);
}

function rowChecked(item, id) {
	emits(
		"update:checkedItems",
		Array.isArray(props.checkedItems)
			? props.checkedItems.includes(id)
				? props.checkedItems.filter((_id) => id !== _id)
				: [...props.checkedItems, id]
			: [id]
	);
	emits(
		"update:checkedItemsData",
		Array.isArray(props.checkedItemsData)
			? props.checkedItemsData?.map((e) => e?.id).includes(id)
				? props.checkedItemsData.filter((_id) => id !== _id.id)
				: [...props.checkedItemsData, item]
			: [item]
	);
}

function rowCheckedAll() {
	emits(
		"update:checkedItems",
		props.checkedItems?.length == props.items?.length
			? []
			: props.items.map((item) => item.id)
	);
	emits(
		"update:checkedItemsData",
		props.checkedItems?.length == props.items?.length
			? []
			: props.items.map((item) => item)
	);
}
</script>

<template>
	<div class="h-[6px]"></div>
	<!-- component -->
	<div :class="supporterClass" class="relative sm:rounded-lg">
		<HProgress
			v-if="loading"
			height="h-[6px]"
			:color1="color1"
			:color2="color2"
			:color3="color3"
		/>
		<table
			class="w-full font-body"
			:class="[items?.length ? 'divide-y divide-secondary-4' : '']"
		>
			<thead class="bg-white">
				<tr :class="tableHeaderStyle">
					<th
						v-if="hasCheckBox"
						class="items-center hidden px-2 py-3 text-xs font-bold tracking-wider text-left text-black uppercase 2xl:px-4 lg:table-cell"
						:class="rowHeadStyle"
					>
						<input
							v-if="checkCheckedAll"
							type="checkbox"
							@click.prevent="rowCheckedAll()"
							:checked="checkCheckedAll"
							class="w-4 h-4 rounded cursor-pointer accent-teal-800 focus:ring-primary text-primary border-primary/50 text-md"
						/>
						<input
							v-else
							type="checkbox"
							@click.prevent="rowCheckedAll()"
							:checked="checkCheckedAll"
							class="w-4 h-4 rounded cursor-pointer accent-teal-800 focus:ring-primary text-primary border-primary/50 text-md"
						/>
					</th>
					<th
						class="table-cell px-3 py-3 text-xs font-bold tracking-wider text-left text-black uppercase 2xl:px-4 overflow-clip"
						v-for="(header, i) in headers"
						:key="header.value"
						:class="rowHeadStyle"
					>
						<span class="font-normal cursor-pointer" @click="sort_by(header)">
							{{ header.text }}
							<Icon
								name="bi:sort-up"
								width="20"
								height="20"
								v-if="
									_sort[header.value] === 'asc' && header.sortable !== false
								"
								class="inline-block text-primary"
							/>
							<Icon
								name="bi:sort-down"
								width="20"
								height="20"
								v-if="
									_sort[header.value] === 'desc' && header.sortable !== false
								"
								class="inline-block text-primary"
							/>
						</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td :colspan="headers.length">
						<HZeroResult
							v-if="!loading && !items.length"
							class="flex items-center mt-8 justify-center py-8"
						></HZeroResult>
					</td>
				</tr>
				<tr
					:class="[rowStyle, tableBodyRowStyle]"
					v-for="(item, idx) in items"
					:key="item.id"
					@click="
						() => {
							$emit('click:row', item);
						}
					"
					class="flex-row table-row mb-0 border-gray-200 rounded shadow cursor-pointer group hover:bg-primary/5 lg:flex-no-wrap lg:shadow-none last:border-0"
				>
					<td
						v-if="hasCheckBox"
						class="relative table-cell w-full px-2 py-4 text-xs border-b rounded lg:w-auto lg:static 2xl:px-4 2xl:text-sm"
						:class="rowStyle"
					>
						<input
							v-if="checkedItems.includes(item.id)"
							type="checkbox"
							:checked="checkedItems.includes(item.id)"
							@click.stop="rowChecked(item, item.id)"
							class="w-4 h-4 rounded cursor-pointer accent-teal-800 focus:ring-primary text-primary border-primary/50 text-md"
						/>
						<input
							v-else
							type="checkbox"
							:checked="checkedItems.includes(item.id)"
							@click.stop="rowChecked(item, item.id)"
							class="w-4 h-4 rounded cursor-pointer accent-accent-teal-800 focus:ring-primary text-primary border-primary/50 text-md"
						/>
					</td>
					<slot name="row" :item="item" :headers="headers" :get="_get">
						<td
							v-for="header in headers"
							:key="header.value"
							:class="rowStyle"
							class="relative block w-full px-2 py-4 text-xs text-left text-gray-900 rounded font-body lg:w-auto lg:table-cell lg:static 2xl:px-4 2xl:text-sm"
						>
							<span
								class="inline-block w-1/3 text-sm font-normal text-left align-middle lg:hidden text-secondary font-body"
								>{{ header.text }}
							</span>
							<slot :item="item" :name="header.value">
								<span
									class="inline-block align-middle whitespace-nowrap font-body lg:w-7/12 xl:w-9/12"
									v-if="header.value == 'roll_no'"
								>
									{{ idx + 1 }}
								</span>
								<span
									class="inline-block overflow-hidden truncate align-middle overflow-ellipsis whitespace-nowrap font-body lg:w-7/12 xl:w-9/12"
									v-else-if="header.value == 'full_name'"
								>
									<!-- <PersonTypeIndicator :type="item.type" /> -->

									{{ _get(item, header.value) || "-" }}
								</span>
								<span
									class="inline-block overflow-hidden truncate align-middle lg:w-10/12 xl:w-11/12 overflow-ellipsis whitespace-nowrap font-body"
									v-else
								>
									{{ _get(item, header.value) || "-" }}
								</span>
							</slot>
						</td>
					</slot>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<style scoped>
.centering {
	position: absolute;
	bottom: -1%;
	left: 50%;
	transform: translate(-50%, -50%);
}
</style>
