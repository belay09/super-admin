<script setup>
import getPlacesMenuQuery from "@/graphql/query/menu/list.gql";
const router = useRouter();
const props = defineProps({
  placeId: {
    type: String,
    required: true,
  },
});

/***---------------------Tab--------------------- */
const tabs = [
  {
    name: "Available",
    value: "Available",
  },
  {
    name: "Unavailable",
    value: "Unavailable",
  },
];

/*...................Place menus data fetch.............*/
const filter = ref({
  placeId: {
    _eq: props.placeId,
  },
});
const limit = ref(6);
const offset = ref(0);
const sort = ref([{ createdAt: "DESC_NULLS_LAST" }]);
const menus = ref([]);
const length = ref(0);

const { onResult, onError, loading, fetchMore, refetch } = authListQuery(
  getPlacesMenuQuery,
  filter,
  sort,
  offset,
  limit
);

onResult((result) => {
  if (result.data?.menus) {
    console.log("onResult: " + result.data.menus);
    menus.value = result.data?.menus;
    length.value = result.data?.menusAggregate?.aggregate?.count;
  }
});
onError((error) => {
  console.log("onError: " + error);
});

/**----------------On Menu Add Done--------------- */

function onMenuAddDone() {
  refetch();
  showAddMenuModal.value = false;
}
const showAddMenuModal = ref(false);
</script>

<template>
  <!-- -------------------Add Menu--------------------- -->
  <Modals-Modal :autoClose="true" v-model="showAddMenuModal">
    <template #header>
      <div class="flex items-center justify-between pb-4 px-10">
        <h3 class="text-lg font-medium text-gray-900">Add Menu Item</h3>
        <button>
          <Icon
            name="system-uicons:close"
            class="text-4xl"
            @click="showAddMenuModal = false"
          />
        </button>
      </div>
    </template>
    <template #content>
      <MenusAdd :placeId="placeId" @on-add="onMenuAddDone"></MenusAdd>
    </template>
  </Modals-Modal>
  <div class="flex flex-col space-y-4">
    <!-- -----------------Header------------------- -->
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium">{{ length }} Menu Items</p>
      <button
        @click="showAddMenuModal = true"
        class="primary-button block secondary-border"
      >
        <Icon
          name="mingcute:user-add-line"
          class="text-xl text-white"
          color=""
        />
        <span class="">Add Menu Item</span>
      </button>
    </div>

    <!-- -----------------Body------------------- -->

    <H-Tab :tabs="tabs" tab-class="text-xl">
      <template #Available>
        <div class="grid grid-cols-2 gap-6 py-8">
          <Ui-Cards-Menu
            class="flex"
            v-for="menu in menus"
            :key="menu.id"
            @onDelete="refetch"
            :menu="menu"
          >
          </Ui-Cards-Menu>
        </div>
      </template>

      <template #Unavailable>
        <div class="grid grid-cols-2 gap-6 py-8">
          <Ui-Cards-Menu v-for="menu in menus" :key="menu.id" :menu="menu">
          </Ui-Cards-Menu>
        </div>
      </template>
    </H-Tab>
  </div>
</template>
