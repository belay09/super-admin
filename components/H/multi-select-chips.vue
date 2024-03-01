<script setup>
import { ref } from "vue";
// import { ChevronDownIcon } from "@heroicons/vue/outline";
import { onClickOutside } from "@vueuse/core";
import { useField } from "vee-validate";
// import useClickOutside from '@/composable/clickOutside';

const props = defineProps({
  modelValue: {
    type: [String, Array, Object],
    default: () => [],
  },
  name: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    default: [],
  },
  returnBy: {
    type: String,
    default: "id",
  },
  showBy: {
    type: String,
    default: "name",
  },
  chipsStyle: {
    type: String,
    required: false,
  },
  init: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
    required: false,
  },
  value: {
    type: String,
    default: "id",
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  trailingIcon: {
    type: String,
    default: "heroicons-solid:chevron-down",
  },
  rules: {
    type: String,
    default: "",
    required: false,
  },
  listClass: {
    type: String,
  },
  deletedItem: {
    type: String,
  },
  label: {
    type: String,
    required: false,
  },
  labelClass: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Search",
  },
});

const chips = ref([]);
const show = ref(false);
const search = ref(undefined);
const selected = ref({});
const set = ref(true);
const list_select = ref(null);

const emit = defineEmits([
  "update:modelValue",
  "update:selected",
  "search",
  "onChange",
]);

//=================== functions ============================

const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: props.modelValue,
});

const select = (val) => {
  selected.value[val[props.value]] = !selected.value[val[props.value]];
  if (!Object.values(selected.value).includes(false)) {
    chips.value.push(val);
    inputValue.value = chips.value.map((chip) => chip.id);
  } else {
    delete selected.value[val.id];
    chips.value = chips.value.filter((e) => e.id != val.id);
    inputValue.value = chips.value.map((chip) => chip.id);
  }
  emit(
    "update:modelValue",
    props.returnBy ? chips.value.map((e) => e[props.returnBy]) : chips.value
  );
  emit(
    "onChange",
    props.returnBy ? chips.value.map((e) => e[props.returnBy]) : chips.value
  );
};

const queryList = () => {
  emit("search", search.value);
};

/**---------------------Merge init value------------------ */

function mergeInit() {
  chips.value = [
    ...new Map(props.init.map((item) => [item[props.value], item])).values(),
  ];
  for (const val of chips.value) {
    selected.value[val[props.value]] = !selected.value[val[props.value]];
  }
  emit(
    "update:modelValue",
    props.returnBy ? chips.value.map((e) => e[props.returnBy]) : chips.value
  );
}

if (props.init) {
  mergeInit();
}

watch(
  () => props.init,
  (val) => {
    mergeInit();
  },
  {
    deep: true,
  },
  {
    immediate: true,
  }
);

const deleteChip = (index) => {
  let id = chips.value[index].id;
  chips.value.splice(index, 1);
  delete selected.value[id];
  if (chips.value?.length < 1) {
    inputValue.value = chips.value;
  }

  emit(
    "update:modelValue",
    props.returnBy ? chips.value.map((e) => e[props.returnBy]) : chips.value
  );
  emit(
    "onChange",
    props.returnBy ? chips.value.map((e) => e[props.returnBy]) : chips.value
  );
};
// const backspaceDelete = ({ which }) => {
//   which === 8 && currentInput.value === "" && chips.value.pop();
// };

onClickOutside(list_select, (e) => (show.value = false));
</script>

<template>
  <div class="relative w-full">
    <div class="flex gap-x-2">
      <!-- -----------------Label----------------- -->
      <slot name="label"> </slot>
      <label
        class="pb-2 text-sheger-gray-100"
        :class="labelClass"
        v-if="props.label"
        :for="props.id ? props.id : ''"
        >{{ props.label }}</label
      >
      <span
        v-if="rules.includes('required') && !props.disabled"
        class="text-red-600"
        >*</span
      >
    </div>
    <div class="flex flex-wrap justify-start gap-3 my-2" v-if="show">
      <div
        class="flex items-center justify-center break-words"
        :class="[chipsStyle || 'px-1 bg-gray-200']"
        v-for="(chip, i) of chips"
        :key="chip.label"
      >
        <span
          class="flex flex-wrap w-full overflow-hidden text-sm whitespace-nowrap"
        >
          {{ chip[showBy] }}
        </span>
        <Icon
          name="heroicons-solid:x"
          class="w-4 h-4 ml-1 hover:cursor-pointer hover:text-primary"
          @click="deleteChip(i)"
        />
      </div>
    </div>
    <div
      class="flex flex-wrap bg-white relative pr-7 rounded-md py-1.5 px-2 gap-1 border-gray-300 border-[1px]"
    >
      <input
        class="flex-1 w-full border-none rounded-md focus:outline-none min-w-5"
        name="select"
        @click="show = true"
        v-model="search"
        @input="queryList"
        @blur="outside"
        :disabled="false"
        :placeholder="placeholder"
      />
      <div
        v-if="trailingIcon"
        class="absolute inset-y-0 right-0 flex items-center pr-1 ml-2 pointer-events-none"
        @click="show = true"
      >
        <Icon :name="trailingIcon" class="w-5 h-5 ml-2 text-gray-400" />
      </div>
    </div>
    <div class="flex flex-wrap justify-start gap-3 my-2" v-if="!show">
      <div
        class="flex items-center justify-center break-words"
        :class="[chipsStyle || 'px-1 bg-gray-200']"
        v-for="(chip, i) of chips"
        :key="chip.label"
      >
        <span
          class="flex flex-wrap w-full overflow-hidden text-sm whitespace-nowrap"
        >
          {{ chip[showBy] }}
        </span>
        <Icon
          name="heroicons-solid:x"
          class="w-4 h-4 ml-1 hover:cursor-pointer hover:text-primary"
          @click="deleteChip(i)"
        />
      </div>
    </div>
    <ul
      ref="list_select"
      v-show="show"
      class="absolute z-10 w-full overflow-auto text-base bg-white border shadow border-primary max-h-56 rounded-b-md"
      :class="[listClass || '']"
    >
      <li class="h-1">
        <h-progress
          v-if="loading"
          class="w-full rounded-xl"
          color1="bg-primary-lite"
          color2="bg-primary"
          color3="bg-primary-dark"
          height="h-1"
        ></h-progress>
      </li>
      <li
        v-for="(item, index) in items"
        @click="select(item)"
        class="relative px-3 py-3 text-gray-600 border-b cursor-pointer select-none hover:bg-primary/30"
        :key="index"
      >
        <div class="flex items-center justify-between">
          <span class="block font-semibold text-gray-600 truncate">
            {{ item[showBy] }}
          </span>
          <Icon
            name="uis:check"
            v-if="multiple && selected[item[value]]"
            class="w-5 h-5 text-gray-600"
          />
        </div>
      </li>
    </ul>
    <p
      :visible="errorMessage"
      class="mt-2 text-sm text-red-600"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
<style scoped>
/* width */
::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px white;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #d34553;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #d34553;
}
</style>
