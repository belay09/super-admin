<script setup>
import basicDrinksQuery from "@/graphql/query/drinks/list.gql";
import useNotify from "@/use/notify";

const { notify } = useNotify();
const emit = defineEmits(["edit"]);
const props = defineProps({
  makeRefetch: {
    type: Boolean,
    default: false,
  },
});

/***---------------------Drinks data fetch--------------------- */
const sort = ref([{ price: "ASC_NULLS_LAST" }]);
const drinks = ref([]);
const limit = ref(6);
const length = ref(0);
const search = ref("");
const offset = ref(0);

/***-------------------------Compute offset------------------------- */

/**-------------------Compute filter when tab change and search---------------- */
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
  basicDrinksQuery,
  filter,
  sort,
  offset,
  limit
);
onResult((result) => {
  if (result.data?.basicsDrinks) {
    drinks.value = result.data.basicsDrinks;
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

watch(
  () => props.makeRefetch,
  (newVal) => {
    if (newVal) {
      refetch();
    }
  }
);
function onDeleted() {
  refetch();
}
</script>

<template>
  <div class="col-span-2 pl-10">
    <div class="flex items-center justify-end">
      <div class="secondary-flex-row">
        <H-Textfield
          name="search"
          type="text"
          placeholder="Search here"
          trailing-icon="uil:search"
          v-model="search"
        ></H-Textfield>
      </div>
    </div>

    <!-- -------------------Ad space place type total places ------------- -->
    <!-- -------------------Add ad space list-------------------- -->
    <!-- ad-space-default -->
    <div class="pt-6">
      <div class="grid grid-cols-2 gap-6">
        <Ui-Cards-DrinkItem
          v-for="drink in drinks"
          :key="drink.id"
          :drink="drink"
          @onDeleted="onDeleted"
          @edit="emit('edit', drink.id)"
        >
        </Ui-Cards-DrinkItem>
      </div>
    </div>

    <div class="mt-5">
      <HPaginate
        v-model:offset="offset"
        :items-per-page="limit"
        :total-data="length"
      />
    </div>
  </div>
</template>
