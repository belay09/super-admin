<script setup>
import useNotify from "@/use/notify";
import VueTimepicker from "vue2-timepicker/src/vue-timepicker.vue";
import { Switch } from "@headlessui/vue";
import insertOpenHour from "@/graphql/mutations/place/insertOpenHour.gql";
import insertCloseHour from "@/graphql/mutations/place/insertCloseHour.gql";
import get_one from "@/composables/get_one";
import hour from "@/graphql/query/places/hour.gql";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import 'vue2-timepicker/dist/VueTimepicker.css'

const props = defineProps({
  placeId: {
    type: String,
    required: true,
  },
}); 
const emit = defineEmits(["next", "prev", "finish"]);
const next = () => {
  emit("next");
};
const prev = () => {
  emit("prev");
};
const route = useRoute();

onMounted(() => {
  if (route.params.id) {
    let routeId = route.params.id;
    console.log("routeLocationKey.params.id", route.params.id);
    const { onResult: onGetPlaceResult, loading: getPlaceLoading } = get_one(
      hour,
      routeId
    );
    onGetPlaceResult(({ data }) => {
      console.log("data", data);
      if (data) {
        const openHours = data.openHours;
        days.value = days.value.map((day) => {
          const openHour = openHours.find(
            (openHour) => openHour.day === day.name
          );
          if (openHour) {
            day.start = openHour.from;
            day.end = openHour.to;
            day.enabled = openHour.status === "OPEN";
          }
          return day;
        });
        console.log("days", days.value);
      }
      if (data && data.closeHours && data.closeHours.length > 0) {
        const closeHours = data.closeHours;
        closingHours.value = closeHours.map((closeHour) => ({
          date: closeHour.date,
          startTime: closeHour.from,
          endTime: closeHour.to,
          reason: closeHour.reason,
        }));
      }
    });
  }
});

/**-----------------------Globals----------------------------- */
const { notify } = useNotify();
const placeId = computed(
  () => props.placeId || localStorage.getItem("draft_placeId")
);

console.log(localStorage.getItem("draft_placeId"), "placeId");

const formSubmittedOpenHour = ref(false);
const formSubmittedClosingHour = ref(false);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const isValidTime = (time) => timeRegex.test(time);

const submitOpenHours = () => {
  formSubmittedOpenHour.value = true;

  let isValid = true;

  days.value.forEach((day) => {
    if (day.enabled && (!isValidTime(day.start) || !isValidTime(day.end))) {
      isValid = false;
    }
  });

  if (isValid) {
    // Map the days array to the required format
    const openHours = days.value.map((day) => ({
      day: day.name,
      from: day.enabled ? day.start : "00:00",
      to: day.enabled ? day.end : "24:60",
      placeId: placeId.value, // Replace with the actual placeId
      status: day.enabled ? `OPEN` : `CLOSE`,
      reason: "opening and closing hours", // Replace with the actual reason
    }));

    // Call insertOpenHourMutate with the mapped array
    insertOpenHourMutate({ objects: openHours });
  }
};
const submitClosing = () => {
  formSubmittedClosingHour.value = true;
  let isValid = true;
  closingHours.value.forEach((closingHour) => {
    if (
      !isValidTime(closingHour.startTime) ||
      !isValidTime(closingHour.endTime) ||
      closingHour.date === null ||
      closingHour.reason === ""
    ) {
      isValid = false;
    }
  });

  if (isValid) {
    insertCloseHourMutate({
      objects: closingHours.value.map((closingHour) => ({
        date: closingHour.date,
        from: closingHour.startTime,
        to: closingHour.endTime,
        placeId: placeId.value,
        reason: closingHour.reason,
      })),
      placeId:{
        _eq: placeId.value
      }
    });
  }
  // Do something with days.value
};

// Define the days ref
const days = ref([
  { name: "Monday", start: "", end: "", enabled: true },
  { name: "Tuesday", start: "", end: "", enabled: true },
  { name: "Wednesday", start: "", end: "", enabled: true },
  { name: "Thursday", start: "", end: "", enabled: true },
  { name: "Friday", start: "", end: "", enabled: true },
  { name: "Saturday", start: "", end: "", enabled: true },
  { name: "Sunday", start: "", end: "", enabled: true },
]);
const format = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `Selected date is ${day}/${month}/${year}`;
};

// Define the submitForm function
const submitForm = () => {
  // Do something with days.value
  console.log(days.value);
};

const closingHours = ref([
  { date: null, startTime: "", endTime: "", reason: null },
]);

// Define the addClosingHour function
const addClosingHour = () => {
  closingHours.value.push({
    date: null,
    startTime: "",
    endTime: "",
    reason: "",
  });
};
const updateEndTime = (day, value) => {
  day.end = value;
};
const updateClosingHourStartTime = (closingHour, value) => {
  closingHour.startTime = value;
};
const updateClosingHourEndTime = (closingHour, value) => {
  closingHour.endTime = value;
};
const updateStartTime = (day, value) => {
  day.start = value;
};
const {
  onDone: insertOpenHourDone,
  loading: insertOpenHourLoading,
  mutate: insertOpenHourMutate,
  onError: insertOpenHourError,
} = authMutation(insertOpenHour);

insertOpenHourDone(({ data }) => {
  if (route.params.id) {
    notify({
      title: "update success",
      description: "Place open hours have been updated successfully",
      cardClass: "border-l-8 border-green-300 bg-white rounded-xl",
    });
  } else {
    notify({
      title: "add success",
      description: "Place open hours have been added successfully",
      cardClass: "border-l-8 border-green-300 bg-white rounded-xl",
    });
  }
});
insertOpenHourError((error) => {
  notify({
    title: "error",
    description: error.message,
    cardClass: "border-l-8 border-red-300 bg-white rounded-xl",
  });
});
const {
  onDone: insertCloseHourDone,
  loading: insertCloseHourLoading,
  mutate: insertCloseHourMutate,
  onError: insertCloseHourError,
} = authMutation(insertCloseHour);

insertCloseHourDone(({ data }) => {
  if (route.params.id) {
    notify({
      title: "update success",
      description: "Place Close hours have been updated successfully",
      cardClass: "border-l-8 border-green-300 bg-white rounded-xl",
    });
  } else {
    notify({
      title: "add success",
      description: "Place Close hours have been added successfully",
      cardClass: "border-l-8 border-green-300 bg-white rounded-xl",
    });
  }
});
insertCloseHourError((error) => {
  notify({
    title: "error",
    description: error.message,
    cardClass: "border-l-8 border-red-300 bg-white rounded-xl",
  });
});
// Define a remove function that removes an item from an array by index
const remove = (array, index) => {
  array.splice(index, 1);
};
const removeClosingHour = (index) => {
  if (closingHours.value.length === 1) {
    return;
  } else {
    remove(closingHours.value, (item, i) => i === index);
  }
};

</script>
<template class="h-full">
  <div>
    <div class="max-w-fit mx-auto bg-white p-6 rounded shadow">
      <form @submit.prevent="submitOpenHours">
        <h2 class="text-xl font-semibold mb-4 text-center">Opening Hours</h2>

        <div
          v-for="(day, index) in days"
          :key="index"
          class="flex items-center space-x-4 mb-4"
        >
          <label :for="`day-${index}`" class="w-24">{{ day.name }}</label>
          <span>from</span>
          <div>
            <vue-timepicker
              :id="`day-${index}`"
              :value="day.start"
              @input="(value) => updateStartTime(day, value)"
              format="HH:mm"
              input-class="border rounded-lg w-fit text-center cursor-pointer"
              close-on-complete
              auto-scroll
              :disabled="!day.enabled"
            />
            <p
              v-if="
                formSubmittedOpenHour && !isValidTime(day.start) && day.enabled
              "
              class="text-red-500"
            >
              time is required
            </p>
          </div>

          <span>to</span>
          <div>
            <vue-timepicker
              :id="`day-${index}-end`"
              @input="(value) => updateEndTime(day, value)"
              :value="day.end"
              format="HH:mm"
              input-class="border rounded-lg w-fit text-center"
              close-on-complete
              auto-scroll
              :disabled="!day.enabled"
            />
            <p
              v-if="
                formSubmittedOpenHour && !isValidTime(day.end) && day.enabled
              "
              class="text-red-500"
            >
              time is required
            </p>
          </div>

          <Switch
            v-model="day.enabled"
            :class="[
              day.enabled ? 'bg-primary-50' : 'bg-primary-50',
              'relative inline-flex h-6 w-16 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
            ]"
          >
            <span class="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              :class="[
                day.enabled ? 'translate-x-10' : 'translate-x-0',
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-primary-600 shadow ring-0 transition duration-200 ease-in-out',
              ]"
            />
          </Switch>
        </div>
        <button
          type="submit"
          class="w-full py-2 px-4 bg-primary-600 text-white text-center rounded hover:bg-secondary-600"
        >
          Submit
        </button>
      </form>
    </div>
    <div class="w-fit mt-4 mx-auto bg-white p-6 rounded shadow">
      <form @submit.prevent="submitClosing">
        <h2 class="text-xl font-semibold mb-4 text-center">Closing Hours</h2>

        <div
          v-for="(closingHour, index) in closingHours"
          :key="index"
          class="flex items-center space-x-4 mb-4"
        >
          <div>
            <div style="height: 20px; display: flex; align-items: center">
              <VueDatePicker
                v-model="closingHour.date"
                :format="format"
                input-class-name="border rounded-lg h-10 w-fit text-center "
                
              />
            </div>
            <p
              v-if="formSubmittedClosingHour && closingHour.date === null"
              class="text-red-500"
            >
              time is required
            </p>
          </div>
          <span>from</span>
          <div>
            <vue-timepicker
              :value="closingHour.startTime"
              @input="(value) => updateClosingHourStartTime(closingHour, value)"
              format="HH:mm"
              input-class="border rounded-lg w-fit text-center cursor-pointer"

            />
            <p
              v-if="
                formSubmittedClosingHour && !isValidTime(closingHour.startTime)
              "
              class="text-red-500"
            >
              {{ !isValidTime(closingHour.startTime) }} time is required
            </p>
          </div>

          <span>to</span>
          <div>
            <vue-timepicker
            id="day"
              :value="closingHour.endTime"
              @input="(value) => updateClosingHourEndTime(closingHour, value)"
              format="HH:mm"
              input-class="border rounded-lg w-fit text-center cursor-pointer"
              style=" cursor: pointer;"
            >

            </vue-timepicker>

            <p
              v-if="
                formSubmittedClosingHour && !isValidTime(closingHour.endTime)
              "
              class="text-red-500"
            >
              time is required
            </p>
          </div>
          <div>
            <HTextfield
              v-model="closingHour.reason"
              :name="`closingHour` + index + `reason`"
              mainDiv=""
              placeholder="Reason"
              input-class="pl-2"
            >
            </HTextfield>
            <p
              v-if="
                formSubmittedClosingHour &&
                (closingHour.reason === null || closingHour.reason === '')
              "
              class="text-red-500"
            >
              Reason is required
            </p>
          </div>
          <button
            type="button"
            @click="removeClosingHour(index)"
            class="w-fit text-center self-center py-1 px-3 bg-primary-600 text-white rounded-full hover:bg-Primary-600"
          >
            -
          </button>
        </div>
        <div class="flex justify-between">
          <button
            type="submit"
            class="w-fit text-center self-center py-2 px-4 bg-primary-600 text-white rounded hover:bg-Primary-600"
          >
            Submit
          </button>
          <button
            type="button"
            @click="addClosingHour"
            class="w-fit text-center self-center py-3 px-4 bg-primary-600 text-white rounded-full hover:bg-Primary-600"
          >
            <Icon name="lucide:plus" />
          </button>
        </div>
      </form>
    </div>
    <div class="flex items-center justify-between my-2">
      <button
        class="flex items-center gap-4 px-5 py-2 border rounded-md primary-button"
        @click="$emit('prev')"
      >
        <Icon name="uil:arrow-left" class="w-6 h-6" />
        Previous
      </button>

      <button
        class="flex items-center gap-4 px-5 py-2 text-white border rounded-md primary-button bg-primary-600"
        @click="next()"
      >
        Save & Proceed
        <Icon name="uil:arrow-right" class="text" />
      </button>
    </div>
  </div>
</template>
<style>
/* Adjust cursor for list items with disabled="false" */
.vue__time-picker .dropdown ul li[disabled="false"] {
  cursor: pointer;
}
.vue__time-picker .dropdown ul li[disabled]:hover{background:transparent;opacity:.3;cursor:pointer}
</style>