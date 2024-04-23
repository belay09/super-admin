<script setup>
import { ref } from "vue";
import { useAxios } from "@vueuse/integrations/useAxios";
import axios from "axios";
import { Icon } from "@iconify/vue";

defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  wrapperClass: {
    type: [String, Object],
    default: "",
  },
  inputClass: {
    type: [String, Object],
    default: "",
  },
  iconClass: {
    type: [String, Object],
    default: "",
  },
  iconsContainerClass: {
    type: [String, Object],
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "close"]);
const item = ref("");
const instance = axios.create({
  baseURL: "https://api.iconify.design",
});
const selectedIcon = ref();
const immediateVal = ref(true);
const limit = ref(100);
const offset = ref(0);
const is_selected = ref();
const total = ref(0);
const { data, isFinished, execute } = useAxios(
  `/search?query=add&pretty=1&limit=${limit.value}&start=${offset.value}`,
  { method: "GET" },
  instance,
  { immediate: immediateVal.value }
);

const fetch = () => {
  offset.value = 0;
  execute(
    `/search?query=${item.value}&pretty=1&limit=${limit.value}&start=${offset.value}`
  );
};

const select = (val) => {
  selectedIcon.value = `https://api.iconify.design/${val.split(":")[0]}/${
    val.split(":")[1]
  }.svg`;
  is_selected.value = val;
  emit("update:modelValue", selectedIcon.value);
  emit("close");
};

const paginate = () => {
  offset.value = offset.value + 6;
  execute(
    `/search?query=${item.value}&pretty=1&limit=${limit.value}&start=${offset.value}`
  );
};

watch(
  () => item.value,
  () => {
    if (item.value.length < 1)
      return execute(
        `/search?query=add&pretty=1&limit=${limit.value}&start=${offset.value}`
      );
    immediateVal.value = false;
    fetch();
  }
);
</script>
<template>
  <div class="flex flex-col items-center p-5" :class="wrapperClass">
    <div class="flex items-center mb-5 gap-x-5">
      <input
        v-model="item"
        class="w-full py-2 border-2 rounded-md border-primary-300 focus:border-primary-600 focus:outline-none focus:ring-0"
        placeholder="Search Icon"
        :class="inputClass"
      />
    </div>
    <div v-if="isFinished" class="w-full max-h-80 overflow-y-scroll">
      <div class="grid gap-5 grid-cols-6" :class="iconsContainerClass">
        <div
          v-for="(icon, index) in data.icons"
          :key="index"
          class="col-span-1"
        >
          <Icon
            :icon="icon"
            width="30"
            height="30"
            @click="select(icon)"
            class="duration-200 cursor-pointer"
            :class="[
              is_selected == icon ? 'bg-blue-100 rounded-md p-0.5' : '',
              iconClass,
            ]"
          />
        </div>
      </div>
    </div>
    <div v-else class="w-full">
      <div class="grid gap-5 grid-cols-6" :class="iconsContainerClass">
        <div v-for="i in 36" :key="i" class="col-span-1">
          <p class="skeleton bg-gray-300 w-6 h-6"></p>
        </div>
      </div>
    </div>
  </div>
</template>
