<script setup>
import getAreasQuery from "@/graphql/query/locations/getAreas.gql";
import getCitiesQuery from "@/graphql/query/locations/getCities.gql";
import addMutation from "@/graphql/mutations/configurations/locations/addArea.gql";
import deleteMutation from "@/graphql/mutations/configurations/locations/deleteArea.gql";
const { handleSubmit, isSubmitting } = useForm({});

import useNotify from "@/use/notify";
const props = defineProps({
  search: {
    type: String,
    default: "",
  },
});
/**---------------------Globals--------------------- */
const { notify } = useNotify();

/**-----------------------Areas headers-------------- */
const areasHeaders = [
  {
    text: "Area",
    value: "area",
  },
  {
    text: "City",
    value: "city",
  },

  {
    text: "Action",
    value: "action",
  },
];

/**------------------------------City Data Fetch--------------- */
const cities = ref([]);
const citySearch = ref("");
const citiesSort = ref([{ name: "ASC_NULLS_LAST" }]);
const citiesLimit = ref(20);
const citiesLength = ref(0);
const citiesOffset = ref(0);

/**------------------Filter---------------- */
const citiesFilter = computed(() => {
  let query = {
    name: {
      _ilike: `%${citySearch.value}%`,
    },
  };

  return query;
});

const {
  onResult: citiesResult,
  onError: citiesError,
  loading: citiesLoading,
} = authListQuery(
  getCitiesQuery,
  citiesFilter,
  citiesSort,
  citiesOffset,
  citiesLimit
);
citiesResult((result) => {
  if (result.data?.basicsCities) {
    cities.value = result.data.basicsCities;
    citiesLength.value = result.data.basicsCitiesAggregate?.aggregate?.count;
  }
});

citiesError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

function makeSearch(value) {
  citySearch.value = value;
}

/**------------------------------Area Data Fetch--------------- */

const areas = ref([]);
const sort = ref([{ name: "DESC_NULLS_LAST" }]);
const limit = ref(100);
const length = ref(0);
const search = ref("");
const offset = ref(0);

/**-------------------Compute filter when tab change and search---------------- */
const filter = computed(() => {
  let query = {
    name: {
      _ilike: `%${props.search}%`,
    },
  };
  return query;
});

const {
  onResult: areasResult,
  onError: areasError,
  loading: areasLoading,
  refetch: areasRefetch,
} = authListQuery(getAreasQuery, filter, sort, offset, limit);
areasResult((result) => {
  if (result.data?.basicsAreas) {
    areas.value = result.data.basicsAreas;
    length.value = result.data.basicsAreasAggregate?.aggregate?.count;
  }
});

areasError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-------------------------Add Area------------------------- */
const areaName = ref("");
const city = ref(-1);
const {
  mutate,
  onDone,
  onError,
  loading: addLoading,
} = authMutation(addMutation);
const handleAdd = handleSubmit(() => {
  let input = {
    name: areaName.value,
    cityId: city.value,
  };
  mutate({ input });
});

onDone(() => {
  areasRefetch();
  notify({
    title: "Area added successfully",
    description: "Area added successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/**-------------------------Delete Area------------------------- */

const area = ref(null);
const selectArea = (item) => {
  area.value = item;
  showDeleteAreaConfirmation.value = true;
};
const {
  mutate: deleteMutate,
  onDone: deleteDone,
  onError: deleteError,
  loading: deleteLoading,
} = authMutation(deleteMutation);

deleteDone(() => {
  areasRefetch();
  showDeleteAreaConfirmation.value = false;
  notify({
    title: "Area deleted successfully",
    description: "Area deleted successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

deleteError((error) => {
  showDeleteAreaConfirmation.value = false;
  let message;
  if (error.message.includes("Foreign key violation")) {
    message = "Can't delete this item";
  } else {
    message = error.message;
  }
  notify({
    title: "Some thing went wrong",
    description: message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

function handleDelete() {
  if (area.value) {
    deleteMutate({ id: area.value.id });
  }
}
const showDeleteAreaConfirmation = ref(false);
</script>

<template>
  <!-- -------------------Delete Area------------- -->
  <ModalsConfirmation
    @confirm="handleDelete"
    v-model="showDeleteAreaConfirmation"
    title="Delete City"
    sure-question="Are you sure you want to delete this area ?"
    description="This action is irreversible and will permanently remove the area and all associated data."
  ></ModalsConfirmation>
  <div class="flex flex-col gap-y-4 col-span-2 pr-12">
    <!-- -------------------Add Area-------------------- -->
    <form
      @submit.prevent="handleAdd"
      class="items-start grid grid-cols-5 gap-x-6"
      action=""
    >
      <!-- ----------------------Area name------------------- -->
      <div class="col-span-2">
        <H-Textfield
          id="area"
          name="area"
          label="Area Name"
          placeholder="Write here"
          v-model="areaName"
          rules="required"
        ></H-Textfield>
      </div>

      <!-- ------------------City---------------- -->
      <div class="col-span-2">
        <Lazy-H-SingleSelectWithSearch
          :items="cities"
          v-model="city"
          @search="makeSearch"
          id="city"
          name="city"
          label="City"
          :loading="citiesLoading"
          rules="required"
        ></Lazy-H-SingleSelectWithSearch>
      </div>

      <!-- ----------------------Submit------------------- -->
      <button
        :disabled="addLoading"
        type="submit"
        class="primary-button secondary-border bg-primary-600 text-white py-3 mt-8 col-span-1"
      >
        <span>Add</span>
        <Icon name="heroicons:plus-small-solid" class="text-2xl"></Icon>
        <Icon
          v-if="addLoading"
          name="eos-icons:bubble-loading"
          class="text-3xl text-red-600"
        />
      </button>
    </form>

    <!-- -----------------------Area List---------------- -->
    <div class="pt-8 border-t">
      <h-table
        :headers="areasHeaders"
        :items="areas"
        v-model:sort="sort"
        :loading="areasLoading"
        supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
        supportHeaderClass="bg-gray-100 border"
        rowHeadStyle="py-6"
      >
        <template v-slot:city="{ item }">
          <div class="secondary-flex-row">
            <p>{{ item.city.name }}</p>
          </div>
        </template>
        <template v-slot:area="{ item }">
          <div class="secondary-flex-row">
            <p>{{ item.name }}</p>
          </div>
        </template>

        <template v-slot:action="{ item }">
          <button @click="selectArea(item)">
            <Icon name="fontisto:more-v" class="text-xl dark:text-white" />
          </button>
        </template>
      </h-table>

      <!-- --------------------Pagination--------- -->
      <div class="mt-5">
        <HPaginate
          v-model:offset="offset"
          :items-per-page="limit"
          :total-data="length"
        />
      </div>
    </div>
  </div>
</template>
