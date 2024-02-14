<script setup>
import getCitiesQuery from "@/graphql/query/locations/getCities.gql";
import addMutation from "@/graphql/mutations/configurations/locations/addCity.gql";
import deleteMutation from "@/graphql/mutations/configurations/locations/deleteCity.gql";

import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**---------------------Globals--------------------- */

const { notify } = useNotify();

/**-----------------------Cities headers-------------- */
const citiesHeaders = [
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
const search = ref("");
const citiesSort = ref([{ name: "ASC_NULLS_LAST" }]);
const citiesLimit = ref(20);
const citiesLength = ref(0);
const citiesOffset = ref(0);

/**-------------------Filter---------------- */

const citiesFilter = computed(() => {
  let query = {
    name: {
      _ilike: `%${search.value}%`,
    },
  };

  return query;
});
const {
  onResult: citiesResult,
  onError: citiesError,
  loading: citiesLoading,
  refetch: citiesRefetch,
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

/**-------------------------Add City-------------------------- */
const cityName = ref("");
const {
  mutate,
  onDone,
  onError,
  loading: addLoading,
} = authMutation(addMutation);
const handleAdd = handleSubmit(() => {
  let input = {
    name: cityName.value,
  };
  mutate({ input });
});

onDone(() => {
  citiesRefetch();
  notify({
    title: "City added successfully",
    description: "City added successfully",
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
/**-------------------------Delete City-------------------------- */
const city = ref(null);
const selectCity = (item) => {
  city.value = item;
  showDeleteCityConfirmation.value = true;
};
const {
  mutate: deleteMutate,
  onDone: deleteDone,
  onError: deleteError,
  loading: deleteLoading,
} = authMutation(deleteMutation);

deleteDone(() => {
  citiesRefetch();
  showDeleteCityConfirmation.value = false;
  notify({
    title: "City deleted successfully",
    description: "City deleted successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
});

deleteError((error) => {
  showDeleteCityConfirmation.value = false;
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
  if (city.value) {
    deleteMutate({ id: city.value.id });
  }
}
const showDeleteCityConfirmation = ref(false);
</script>

<template>
  <!-- -------------------Delete City------------- -->
  <ModalsConfirmation
    @confirm="handleDelete"
    v-model="showDeleteCityConfirmation"
    title="Delete City"
    sure-question="Are you sure you want to delete this city ?"
    description="This action is irreversible and will permanently remove the city and all associated data."
  ></ModalsConfirmation>
  <!-- ------------------------City--------- -->

  <div class="flex flex-col gap-y-4 col-span-1">
    <!-- -------------------Add City-------------------- -->

    <form
      @submit.prevent="handleAdd"
      class="items-start grid grid-cols-3 gap-x-6"
      action=""
    >
      <!-- ----------------------City Name------------------- -->
      <div class="col-span-2">
        <H-Textfield
          id="city"
          name="city"
          label="City Name"
          placeholder="Write here"
          v-model="cityName"
          rules="required"
        ></H-Textfield>
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

    <!-- -----------------------City List---------------- -->
    <div class="pt-8 border-t">
      <H-Textfield
        id="search"
        name="search"
        placeholder="Search here"
        v-model="search"
      ></H-Textfield>
      <h-table
        :headers="citiesHeaders"
        :items="cities"
        v-model:sort="citiesSort"
        :loading="citiesLoading"
        supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
        supportHeaderClass="bg-gray-100 border"
        rowHeadStyle="py-6"
      >
        <template v-slot:city="{ item }">
          <div class="secondary-flex-row">
            <p>{{ item.name }}</p>
          </div>
        </template>

        <template v-slot:action="{ item }">
          <button @click="selectCity(item)">
            <Icon name="fontisto:more-v" class="text-xl dark:text-white" />
          </button>
        </template>
      </h-table>
      <!-- --------------------Pagination--------- -->
      <div class="mt-5">
        <HPaginate
          v-model:offset="citiesOffset"
          :items-per-page="citiesLimit"
          :total-data="citiesLength"
        />
      </div>
    </div>
  </div>
</template>
