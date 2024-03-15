<script setup>
const emit = defineEmits(["update:modelValue", "refetch"]);
const props = defineProps({
  modelValue: {
    type: Number,
    default: () => 1,
  },
  places: {
    type: Array,
    required: true,
    default: () => [],
  },
  totalPage: {
    type: Number,
    required: true,
    default: () => 1,
  },
  currentTab: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
    default: () => false,
  },
});

/**-------------------Feature selected places---------------------- */
const featuredValue = ref("");
const pageTracker = ref(props.modelValue);
watch(
  () => props.modelValue,
  (newVal) => {
    pageTracker.value = newVal;
  }
);
watch(pageTracker, (newVal) => {
  emit("update:modelValue", newVal);
});
watchEffect(() => {
  featuredValue.value = props.currentTab.value;
});
onMounted(() => {
  featuredValue.value = props.currentTab.value;
});
</script>

<template>
  <div class="grid grid-cols-3 gap-4 py-8">
    <!-- ---------------------List places--------------------- -->
    <div class="flex flex-col col-span-2 pr-12 border-r gap-y-8">
      <p class="text-xl font-medium">
        Showing {{ totalPage > 0 ? pageTracker : 0 }} /{{ totalPage }}
      </p>
      <div class="grid grid-cols-2 gap-8" v-if="!loading">
        <Ui-Cards-FeaturedPlace
          v-for="place in places"
          :place="place"
          :key="place.id"
          :featuredValue="featuredValue"
          @edit="emit('refetch')"
        />
      </div>

      <div class="grid grid-cols-2 gap-8" v-else>
        <SkeletonLoader-Card v-for="i in 2" :key="i" />
      </div>
    </div>

    <FeaturedPlacesAdd
      class="col-span-1 pl-8 pr-12"
      :featuredValue="featuredValue"
      @add="emit('refetch')"
    ></FeaturedPlacesAdd>

    <!-- ---------------------List selected places--------------------- -->
  </div>
</template>
