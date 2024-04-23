<script setup>
import { ref, watch, toRefs, onMounted } from "vue";
import { useField } from "vee-validate";
import { useDebounceFn } from "@vueuse/core";

const emit = defineEmits(["update:modelValue", "returnedObject"]);
const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
    required: false,
  },

  modelValue: {
    type: [String, Number, Object, Boolean],
    default: undefined,
  },

  items: {
    type: Array,
    default: () => [],
  },

  // place holder
  placeholder: {
    type: String,
    default: "Select one",
  },
  placeholderClass: {
    type: String,
    default: "",
  },

  // label
  label: {
    type: String,
    required: false,
  },
  labelClass: {
    type: String,
    default: "",
  },

  returnObject: {
    type: Boolean,
    default: false,
  },

  rules: {
    type: String,
    default: "",
  },
  class: {
    type: String,
    default: "",
  },

  headerClass: {
    type: String,
    required: false,
    default: "",
  },

  // list item
  listContainerClass: {
    type: String,
    required: false,
  },
  itemClass: {
    type: String,
    required: false,
    default: "",
  },
  showBy: {
    type: String,
    default: "name",
  },
  returnBy: {
    type: String,
    default: "id",
  },
});

function getInitialValue() {
  if (props.returnObject) {
    if (props.modelValue) {
      return props.modelValue.id;
    }
  } else {
    return props.modelValue;
  }
}

const singleSelect = ref(null);
const { items } = toRefs(props) || [];
const show = ref(false);
const {
  errorMessage,
  value: inputValue,
  meta,
} = useField(props.name, props.rules, {
  initialValue: getInitialValue(),
});

const selectedItem = ref(null);

const outside = useDebounceFn(() => {
  show.value = false;
}, 300);

const set = (item) => {
  inputValue.value = item["id"];
  selectedItem.value = item;
  show.value = false;
  if (props.returnObject) {
    emit("update:modelValue", item);
  } else {
    emit("update:modelValue", item.id);
    emit("returnedObject", item);
  }
};
const clear = () => {
  selectedItem.value = null;
  inputValue.value = "";
  selected.value = "";
  show.value = false;
  emit("update:modelValue", undefined);
  emit("update:selected", undefined);
  emit("onSelectionFound", undefined);
};

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      console.log("first", newVal);
      if (props.returnObject) {
        inputValue.value = newVal?.id;
        selectedItem.value = newVal;
      } else {
        inputValue.value = newVal;
        selectedItem.value = props.items.find((item) => item.id == newVal);
      }
    } else {
      selectedItem.value = null;
      inputValue.value = "";
    }
  }
);

/**------------------------Watch items----------------------- */
watch(
  () => props.items,
  (newVal) => {
    let tempSelectedItem = props.items.find(
      (item) => item.id == props.modelValue
    );

    if (tempSelectedItem) {
      selectedItem.value = tempSelectedItem;
      placeHolder.value = selectedItem.name;
    }
  }
);

onClickOutside(singleSelect, (e) => (show.value = false));

watchEffect(() => {
  if (props.modelValue) {
    if (props.returnObject) {
      if (props.modelValue) {
        selectedItem.value = props.modelValue;
        if (selectedItem.value?.id != "") {
          inputValue.value = props.modelValue.id;
        }
      }
    } else {
      selectedItem.value = props.items.find(
        (item) => item.id == props.modelValue
      );
      if (selectedItem.value) {
        inputValue.value = props.modelValue;
      }
    }
  }
});
</script>
<template>
  <div class="relative w-full" ref="singleSelect">
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
    </div>

    <!-- -----------------Heading---------------- -->

    <div
      @click="show = !show"
      class="flex items-center justify-between px-3 py-3 rounded-md shadow-sm font-body secondary-border w-full"
      :class="[props.headerClass, errorMessage ? 'border-red-500' : '']"
    >
      <!------------------- Leading icon----------- -->

      <!-- -----------------Left Side----------------- -->

      <div v-if="selectedItem" @click="show = true">
        <slot name="header" :item="selectedItem">
          <div class="">
            {{ selectedItem[showBy] }}
          </div>
        </slot>
      </div>
      <div class="text-gray-500" :class="placeholderClass" v-else>
        {{ props.placeholder || "Select" }}
      </div>

      <!---------------- Chevron trailing icon ------------------->

      <div
        v-if="selectedItem"
        @click="clear"
        class="absolute inset-y-0 right-0 flex items-center pr-3 hover:cursor-pointer"
      >
        <Icon name="heroicons:x-mark-20-solid" color="gray" class="text-xl" />
      </div>
      <div v-else class="absolute inset-y-0 right-0 flex items-center pr-3">
        <Icon name="tabler:chevron-down" color="gray" class="text-xl" />
      </div>
    </div>

    <!-------------------Body-------------------  -->
    <ul
      v-show="show"
      class="absolute z-50 w-full h-auto overflow-x-hidden overflow-y-scroll text-base bg-white border rounded-md shadow max-h-56"
      :class="[props.listContainerClass ? props.listContainerClass : '']"
    >
      <li v-for="item in items" :key="item.id" @click="set(item)">
        <slot name="row" :item="item">
          <div
            :class="[props.itemClass ? props.itemClass : '']"
            class="relative flex items-center justify-between px-3 py-3 overflow-auto border-b cursor-pointer select-none hover:bg-blue-50"
          >
            <span class="block capitalize break-words">{{ item[showBy] }}</span>

            <!-- ---------------Check ------------>
            <!-- <div class="flex space-x-1">
              <Icon
                v-if="inputValue == item.id"
                name="ic:round-check"
                width="25"
                height="25"
                color="#003F7D"
                class="cursor-pointer text-inherit"
              />
            </div> -->
          </div>
        </slot>
      </li>
    </ul>
    <p
      v-if="errorMessage"
      :visible="errorMessage"
      class="mt-1 text-sm text-red-500 font-body"
      id="email-error"
    >
      {{ errorMessage }} &nbsp;
    </p>
  </div>
</template>
<style scoped>
.zz {
  z-index: 99;
}

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
  background: #c3ddfd;
  border-radius: 3px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #c3ddfd;
}
</style>
