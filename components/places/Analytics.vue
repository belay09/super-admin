<script setup>
import { onClickOutside } from "@vueuse/core";
import editPlaceMutation from "@/graphql/mutations/place/changePlaceStatus.gql";
import useNotify from "@/use/notify";
/**-------------------------Imports------------------------- */
import formatNumberToShow from "~/helpers/format-number-to-show";
import { formatRelative } from "date-fns";

/**----------------------Globals-------------------------- */
const router = useRouter();
const route = useRoute();

const { notify } = useNotify();

const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/**----------------------Place status---------------------- */
function placeStatus(status) {
  if (status == "ACTIVE") {
    return {
      name: "Active",
      class: "bg-sheger-green-100 px-2 py-1",
    };
  } else if (status == "CLOSED") {
    return {
      name: "Closed",
      class: "bg-red-100 px-2 py-1",
    };
  } else if (status == "PENDING") {
    return {
      name: "Pending",
      class: "bg-yellow-100 px-2 py-1",
    };
  } else if (status == "SUSPENDED") {
    return {
      name: "Suspended",
      class: "bg-sheger-gray-100 px-2 py-1",
    };
  }
}

const series = ref([
  {
    name: "Score",
    data: [],
  },
]);
const options = ref({
  chart: {
    type: "area",
  },
  markers: {
    size: 0,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },

  colors: ["#D34553"],

  plotOptions: {
    bar: {
      borderRadius: 10,
      borderRadiusApplication: "around",
    },
  },
});
const updateChart = () => {
  //generate array of random numbers of length 10
  const data = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 100)
  );
  options.value = {
    ...options.value,
    xaxis: {
      categories: Array.from(
        { length: 10 },
        (_, i) => new Date().getFullYear() - i
      ), // array of last 10 years
    },
  };

  series.value = [
    {
      name: "Score",
      data: data,
    },
  ];
};

onMounted(() => {
  updateChart();
});

/**----------------------update place status---------------------- */
const featureActionsContainer = ref(null);
onClickOutside(featureActionsContainer, (e) => (showMoreAction.value = false));

const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editPlaceMutation);

editDone(() => {
  notify({
    title: "Updated successfully",
    description: "Updated successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  showRevokeBadgeModal.value = false;
  showActivatePlaceModal.value = false;
  showPendPlaceModal.value = false;
  showSuspendPlaceModal.value = false;
  showClosePlaceModal.value = false;
});

editError((error) => {
  showRevokeBadgeModal.value = false;
  showActivatePlaceModal.value = false;
  showPendPlaceModal.value = false;
  showSuspendPlaceModal.value = false;
  showClosePlaceModal.value = false;

  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",

    borderClass: "border-l-8 border-red-300",
  });
});

/**-------------------------Handle revoke badge--------------- */
const handleRevoke = () => {
  let input = {
    shegerRecommendationId: null,
  };
  editMutate({ input, id: props.place.id });
};

const handleChangePlaceStatus = (status) => {
  let input = {
    status,
  };
  editMutate({ input, id: props.place.id });
};

/***-----------------Modals--------------------------- */
const showMoreAction = ref(false);

/**-----------------------------Assign Badge------------------- */

const showAssignBadgeModal = ref(false);
function toggleAssignBadgeModal(event) {
  event.stopPropagation();
  showAssignBadgeModal.value = !showAssignBadgeModal.value;
}

/**-----------------------Revoke Badge Modal---------------- */
const showRevokeBadgeModal = ref(false);
function toggleRevokeBadgeModal(event) {
  event.stopPropagation();
  showRevokeBadgeModal.value = !showRevokeBadgeModal.value;
}

/**-----------------------Activate Place Modal---------------- */
const showActivatePlaceModal = ref(false);
function toggleActivatePlaceModal(event) {
  event.stopPropagation();
  showActivatePlaceModal.value = !showActivatePlaceModal.value;
}

/**-------------------------Pend Place Modal------------------------ */

const showPendPlaceModal = ref(false);
function togglePendPlaceModal(event) {
  event.stopPropagation();
  showPendPlaceModal.value = !showPendPlaceModal.value;
}

/**-------------------------Suspend Place Modal------------------------ */

const showSuspendPlaceModal = ref(false);
function toggleSuspendPlaceModal(event) {
  event.stopPropagation();
  showSuspendPlaceModal.value = !showSuspendPlaceModal.value;
}

/**-------------------------Close Place Modal------------------------ */

const showClosePlaceModal = ref(false);
function toggleClosePlaceModal(event) {
  showClosePlaceModal.value = !showClosePlaceModal.value;
  event.stopPropagation();
}

function openMoreAction(event) {
  event.stopPropagation();
  showMoreAction.value = !showMoreAction.value;
}

// edit page

function gotoEditPage(event) {
  event.stopPropagation();

  router.push({
    path: `/app/places/edit/${props.place.id}`,
    query: {
      step: 0,
    },
  });
}
</script>

<template>
  <!-- -------------------Assign Badge Modal--------------- -->
  <Modals-Modal
    :autoClose="true"
    :modelValue="showAssignBadgeModal"
    bodyClass="lg:max-w-3xl"
  >
    <template #header>
      <div class="flex items-center justify-between pb-4">
        <h3 class="text-lg font-medium text-gray-900">Assign Badge</h3>
        <button @click="showAssignBadgeModal = false">
          <Icon name="system-uicons:close" class="text-4xl" />
        </button>
      </div>
    </template>
    <template #content>
      <Places-AssignBadge
        @close="showAssignBadgeModal = false"
        :place="place"
      ></Places-AssignBadge>
    </template>
  </Modals-Modal>

  <!-- -----------------------Revoke Badge Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleRevoke"
    v-model="showRevokeBadgeModal"
    title="Revoke Badge"
    sure-question="Are you sure you want to revoke the badge ?"
    description="This action is irreversible and will permanently remove the badge"
  ></ModalsConfirmation>

  <!-- -----------------------Make Active Place Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangePlaceStatus('ACTIVE')"
    v-model="showActivatePlaceModal"
    title="Activate Place"
    sure-question="Are you sure you want to activate the place?"
    description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
  ></ModalsConfirmation>

  <!-- -----------------------Make Pending Place Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangePlaceStatus('PENDING')"
    v-model="showPendPlaceModal"
    title="Pend Place"
    sure-question="Are you sure you want to pend the place?"
    description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
  ></ModalsConfirmation>
  <!-- -----------------------Close Place Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangePlaceStatus('CLOSED')"
    v-model="showClosePlaceModal"
    title="Close Place"
    sure-question="Are you sure you want to close the place?"
    description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
  ></ModalsConfirmation>

  <!-- -----------------------Suspend Place Modal---------------- -->
  <ModalsConfirmation
    @confirm="handleChangePlaceStatus('SUSPENDED')"
    v-model="showSuspendPlaceModal"
    title="Suspend Place"
    sure-question="Are you sure you want to suspend the place?"
    description="Closing this place will result on the place be invisible to visitors and will not be found during search or via an existing links to the place’s profile."
  ></ModalsConfirmation>

  <div class="grid grid-cols-6">
    <div class="grid grid-cols-2 col-span-4">
      <!-- ----------------Place Info-------------------- -->
      <div class="flex flex-col gap-3 py-4">
        <div class="flex space-x-4">
          <!---------------------- Logo--------------------- -->
          <div class="self-start w-20 h-20 mr-1 shrink-0">
            <img
              :src="place?.light_logo?.url"
              alt=""
              class="object-cover w-full h-full rounded-xl"
            />
          </div>

          <div class="flex flex-col gap-6">
            <!--------------------Place Name and status------------------- -->
            <div class="flex gap-3">
              <h1 class="text-xl font-medium">{{ place.name }}</h1>
              <div class="px-2 py-1" :class="placeStatus(place.status).class">
                <p class="font-medium text-sheger-green-600">
                  {{ placeStatus(place.status).name }}
                </p>
              </div>
            </div>

            <!-- -----------------Review rating and like----------- -->
            <CommonReviewRatingLike
              :rating="place?.place_aggregate_summary?.avgRating || 0"
              :like="place?.place_aggregate_summary?.sumLikes || 0"
              :review="place?.placeReviewsAggregate?.aggregate?.count || 0"
            ></CommonReviewRatingLike>

            <!-------------------- Menu update---------------------- -->
            <div class="flex items-center gap-3">
              <Icon name="carbon:calendar" class="w-5 h-5" />
              <p class="text-sheger-gray-100">Menu last updated: 2 days ago</p>
            </div>
          </div>
        </div>
        <!-- ----------------Tags --------------------->
        <div class="flex flex-wrap pb-4 secondary-text">
          <p
            v-for="placeTag in place.placeTags"
            :key="placeTag.tag?.id"
            class="pr-2"
          >
            #{{ placeTag.tag?.title }}
          </p>
        </div>
      </div>

      <!-- ----------------------------Featured on------------------- -->
      <div class="relative flex flex-col gap-4 py-3 px-9 border-x">
        <!-- -----------Flag icon----------- -->
        <div
          class="absolute top-0 flex items-center justify-center bg-gray-300 border rounded-full -left-4 w-7 h-7"
        >
          <Icon name="heroicons:flag-solid" class="" />
        </div>

        <!-- -----------Flag icon----------- -->
        <div
          class="absolute top-0 flex items-center justify-center bg-gray-300 border rounded-full -right-4 w-7 h-7"
        >
          <Icon name="heroicons:eye-16-solid" class="" />
        </div>

        <div class="flex items-center justify-between">
          <p class="text-sm text-sheger-gray-100">Featured on</p>
          <NuxtLink
            to="/app/featured-places"
            class="font-medium underline cursor-pointer text-primary-600"
          >
            Configure
          </NuxtLink>
        </div>

        <!------------------------ Featured on cards -------------->
        <Places-FeaturedPlace-Card
          v-for="item in place.featured_places"
          :key="item.id"
          :item="item"
        ></Places-FeaturedPlace-Card>
      </div>
    </div>

    <!----------------- visits------------ -->
    <div class="flex w-full col-span-2">
      <!-- ------------------Visits---------------- -->
      <PlacesVisitors :place-id="place.id" class="w-full"></PlacesVisitors>

      <div class="relative">
        <button @click="openMoreAction" class="hover:cursor-pointer">
          <Icon name="iwwa:option" class="w-8 h-8" />
        </button>

        <!-- -----------------------Extend date and Remove from feature --------------- -->
        <div
          ref="featureActionsContainer"
          v-if="showMoreAction"
          class="absolute right-0 flex flex-col p-5 bg-white z-[50] rounded-lg shadow-xl top-7 w-72 gap-y-4"
        >
          <button class="flex items-center gap-3">
            <Icon name="icon-park-outline:bill" class="text-2xl shrink-0" />
            <p class="text-lg">Billing</p>
          </button>
          <button @click="gotoEditPage" class="flex items-center gap-3">
            <Icon name="uil:edit-alt" class="text-2xl shrink-0" />
            <p class="text-lg">Update Place Info</p>
          </button>
          <button
            @click="toggleAssignBadgeModal"
            class="flex items-center gap-3"
          >
            <Icon name="cil:badge" class="text-2xl shrink-0" />
            <p class="text-lg">Assign a badge</p>
          </button>
          <button
            v-if="place.shegerRecommendation"
            @click="toggleRevokeBadgeModal"
            class="flex items-center gap-3"
          >
            <Icon name="cil:badge" class="text-2xl shrink-0 text-primary-600" />
            <p class="text-lg">Revoke a badge</p>
          </button>

          <!-- ----------------Activate Place---------- -->
          <button
            @click="toggleActivatePlaceModal"
            class="flex items-center gap-3"
          >
            <Icon name="majesticons:open" class="text-2xl shrink-0" />
            <p class="text-lg whitespace-nowrap">Activate Place</p>
          </button>

          <!-- ----------------Pend Place---------- -->
          <button @click="togglePendPlaceModal" class="flex items-center gap-3">
            <Icon name="carbon:pending" class="text-2xl shrink-0" />
            <p class="text-lg whitespace-nowrap">Pend Place</p>
          </button>

          <!-- ----------------Suspend Place---------- -->
          <button
            @click="toggleSuspendPlaceModal"
            class="flex items-center gap-3"
          >
            <Icon name="ci:stop-sign" class="text-2xl shrink-0" />
            <p class="text-lg whitespace-nowrap">Suspend Place</p>
          </button>
          <!-- ----------------Close Place---------- -->
          <button
            @click="toggleClosePlaceModal"
            class="flex items-center gap-3"
          >
            <Icon name="bi:door-closed" class="text-2xl shrink-0" />
            <p class="text-lg text-primary-600 whitespace-nowrap">
              Close Place
            </p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
