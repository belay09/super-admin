<script setup>
import getEntities from "@/graphql/query/entity/list.gql";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
});

const entities = ref([]);

const search = ref("");

const filter = computed(() => {
	let query = {};
	query._and = [
		{
			organizationLegalName: {
				_ilike: `%${search.value}%`,
			},
		},
	];

	return query;
});

const { loading, onError, onResult, refetch } = authFetch(getEntities, {
	filter: filter,
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
});

onResult((result) => {
	entities.value = result.data.entity;
});

/*----------------------------Toggle Full Screen ----------------------------------*/
const open = computed({
	get() {
		return props.modelValue;
	},
	set(newVal) {
		emits("update:modelValue", newVal);
	},
});
</script>

<template>
	<ModalsModal body-class=" max-w-[1600px] mt-[20px] !p-4" v-model="open">
		<template #content>
			<div class="relative h-[900px] pr-2 overflow-y-auto">
				<div class="flex justify-between items-center">
					<H-Textfield
						v-model="search"
						name="search"
						type="text"
						placeholder="Search here"
						trailing-icon="uil:search"
					></H-Textfield>
					<div class="flex gap-x-2">
						<button
							class="primary-button bg-primary-600 text-white"
							@click="$router.push('/app/entity/add')"
						>
							Add Entity
						</button>
						<button
							class="primary-button text-primary-600 border border-primary-600"
							@click="open = false"
						>
							Cancel
						</button>
					</div>
				</div>
				<div v-if="!loading" class="mt-6 grid grid-cols-3 gap-4">
					<UiCardsEntity
						:entity="entity"
						v-for="entity in entities"
						:key="entity.id"
						:hasAction="false"
						wrapperClass="hover:border-primary-600"
					/>
				</div>
				<div v-else class="mt-6 grid grid-cols-3 gap-4">
					<SkeletonLoaderEntity v-for="i in 6" :key="i" />
				</div>
				<HZeroResult
					v-if="!loading && !entities.length"
					class="flex items-center mt-8 justify-center py-8"
				></HZeroResult>
			</div>
		</template>
	</ModalsModal>
</template>
