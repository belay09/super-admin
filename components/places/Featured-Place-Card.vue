<script setup>
import RadialProgressBar from "vue-radial-progress";
/**--------------------Imports------------------------------- */
import { onClickOutside } from "@vueuse/core";
import editMutation from "@/graphql/mutations/featured-places/edit.gql";
import useNotify from "@/use/notify";
const { handleSubmit, isSubmitting } = useForm({});

/**------------------------Globals------------------------ */
const { notify } = useNotify();

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const refetchPlace = inject("refetchPlace");

const featuredAt = (endDate) => {
  const now = new Date();
  const startTime = new Date(endDate);
  const timeDifference = startTime - now;
  if (timeDifference > 0) {
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const hours = Math.floor(
      (timeDifference % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)
    );
    return days;
  } else {
    const expiredDays = Math.abs(
      Math.floor(timeDifference / (24 * 60 * 60 * 1000))
    );
    return expiredDays; // return negative value for expired days
  }
};

const totalSteps = (endDate, startDate) => {
  const now = new Date();

  const startTime = new Date(startDate);
  const endTime = new Date(endDate);
  const timeDifference = endTime - startTime;
  if (now > endTime) {
    return 0;
  }

  Math.floor(timeDifference / (24 * 60 * 60 * 1000)), "totalsteps";
  return Math.floor(timeDifference / (24 * 60 * 60 * 1000));
};
const getStartColor = (completed, duration) => {
  // ("hello",completed,duration)
  return completed <= duration ? "#22AB4F" : "#FF0000"; // Use different color for expired
};

const getInnerStrokeColor = (completed, duration) => {
  return completed <= duration ? "#ABE3C4" : "#FF0000"; // Use different color for expired
};

// Function to calculate completed steps dynamically based on the start date
const calculateCompletedSteps = (startDate) => {
  const now = new Date();
  const startTime = new Date(startDate);
  const timeDifference = now - startTime;
  Math.ceil(timeDifference / (24 * 60 * 60 * 1000)), "calculateCompletedSteps";
  return Math.ceil(timeDifference / (24 * 60 * 60 * 1000));
  // Assuming 1 step is equivalent to 1 day for the example, you may adjust this based on your requirement
};

function calculateRemainingDays(endDate) {
  // Get the current date
  var currentDate = new Date();

  // Parse the expiry date string to Date object
  var expiry = new Date(endDate);

  // Calculate the difference in milliseconds
  var difference = expiry - currentDate;

  // Convert milliseconds to days
  var remainingDays = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return remainingDays;
}

const getName = (type) => {
  switch (type) {
    case "SEASONAL_PLACE":
      return "SEASONAL PLACE ";
    case "WEEKLY_RECOMMENDED_PLACE":
      return "WEEKLY RECOMMENDED PLACE";
    case "RECENTLY_OPENED_PLACE":
      return "RECENTLY OPENED PLACE";
    // Add more cases as needed
    default:
      return "";
  }
};

/**------------------------------Handle configure featured places--------------- */
const {
  mutate: editMutate,
  onDone: editDone,
  onError: editError,
  loading: editLoading,
} = authMutation(editMutation);

/**-------------------------Remove from featured---------------- */
const removeFromFeatured = () => {
  let input = {
    isActive: false,
    // endDate: props.item.startDate,
  };
  editMutate({ input, id: props.item?.id });
};

/**--------------------------Extend date------------------------ */
const endDate = ref("");
const extendDate = handleSubmit(() => {
  let input = {
    endDate: endDate.value,
  };
  editMutate({ input, id: props.item?.id });
});

/***-----------------------Edit on done------------------------ */
editDone(() => {
  showExtendEndDateModal.value = false;
  notify({
    title: "Updated  successfully",
    description: "Updated  successfully",
    type: "error",
    borderClass: "border-l-8 border-green-300",
  });
  refetchPlace();
});

editError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

/***-----------------Modals--------------------------- */
const showExtendEndDateModal = ref(false);
const showRemoveFromFeaturedModal = ref(false);
</script>

<template>
  <!-- -------------------Extend end date modal--------------- -->
  <Modals-Modal
    body-class="!max-w-[30rem]"
    :autoClose="true"
    :modelValue="showExtendEndDateModal"
  >
    <template #header>
      <div class="flex items-center justify-between pb-4">
        <h3 class="text-lg font-medium text-gray-900">Extend Deadline</h3>
        <button @click="showExtendEndDateModal = false">
          <Icon name="system-uicons:close" class="text-4xl" />
        </button>
      </div>
    </template>
    <template #content>
      <div>
        <form
          @submit.prevent="extendDate"
          class="flex flex-col gap-y-3"
          action=""
        >
          <!-- ---------------------Date------------- -->
          <HDatePickers
            id="end_date"
            name="end_date"
            rules="required"
            label="End Date"
            trailing-icon="uil:calender"
            trailing-icon-class=""
            class="w-full"
            v-model="endDate"
          ></HDatePickers>

          <!-- ------------------Update button---------------- -->
          <button
            @click="showConfirmationModal = true"
            class="justify-center border primary-button secondary-text"
          >
            Update Deadline
            <Icon
              v-if="editLoading"
              name="eos-icons:bubble-loading"
              class="text-3xl text-red-600"
            />
          </button>
        </form>
      </div>
    </template>
  </Modals-Modal>

  <!-- -----------------Remove from featured ---------------- -->

  <ModalsConfirmation
    @confirm="removeFromFeatured"
    v-model="showRemoveFromFeaturedModal"
    :title="`Remove from Featured`"
    v-bind:sure-question="`Are you sure you want to remove ${item?.name} ?`"
    description=""
  ></ModalsConfirmation>
  <!-- -----------------Icon and name---------------- -->

  <div
    class="flex items-center justify-between rounded-lg bg-white px-1 pb-1 pt-1 border border-gray-200 sm:px-2 sm:py-1"
  >
    <!-- --------------------------Progress And Name---------------- -->
    <div class="flex items-center gap-x-2">
      <!-- -----------------Progress bar---------------- -->
      <div class="px-2.5 py-1 my-auto text-sm font-medium md:mt-2 lg:mt-0">
        <radial-progress-bar
          :key="item.id"
          :diameter="50"
          :strokeWidth="4"
          :innerStrokeWidth="4"
          :completed-steps="calculateCompletedSteps(item.startDate)"
          startColor="red"
          stopColor="red"
          :innerStrokeColor="
            getInnerStrokeColor(
              calculateCompletedSteps(item.startDate),
              totalSteps(item.endDate, item.startDate)
            )
          "
          :total-steps="totalSteps(item.endDate, item.startDate)"
        >
          {{ calculateRemainingDays(item.endDate) }}
        </radial-progress-bar>
      </div>

      <!-- --------------Name----------------- -->

      <div>
        <p class="truncate text-sm font-medium text-gray-900 mb-3">
          {{ getName(item.type) }}
        </p>
        <p
          class="mt-2 text-ellipsis overflow-hidden text-sm font-medium text-gray-500"
        >
          Featured: {{ featuredAt(item.startDate) }} days ago
        </p>
      </div>
    </div>
    <!-- -----------------------Action--------------------- -->
    <button
      v-if="calculateRemainingDays(item.endDate) > 0"
      @click="showRemoveFromFeaturedModal = !showRemoveFromFeaturedModal"
    >
      <Icon
        name="solar:map-point-remove-linear"
        class="text-2xl"
        aria-hidden="true"
      />
    </button>
    <button v-else @click="showExtendEndDateModal = !showExtendEndDateModal">
      <Icon
        name="system-uicons:scale-extend"
        class="text-2xl"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
