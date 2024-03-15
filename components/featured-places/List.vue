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

const pageTracker = ref(props.modelValue);
const featuredValue = ref("");
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
  <div class="flex flex-col py-6 space-y-8">
    <div class="flex items-center justify-between">
      <p class="text-xl font-medium">
        Showing {{ totalPage > 0 ? pageTracker : 0 }} /{{ totalPage }}
      </p>

      <div class="flex items-center gap-8">
        <nuxt-link
          to="/app/featured-places/add-new-features"
          class="block primary-button bg-primary-600"
        >
          <Icon name="lucide:building-2" class="text-xl text-white" color="" />
          <span class="text-white">Feature New</span>
        </nuxt-link>
        <H-Page
          v-model:model-value="pageTracker"
          :total-page="totalPage"
        ></H-Page>
      </div>
    </div>
    <div class="grid grid-cols-3 w-[85%] gap-8" v-if="!loading">
      <Ui-Cards-FeaturedPlace
        v-for="place in places"
        :place="place"
        :key="place.id"
        :featuredValue="featuredValue"
        @edit="emit('refetch')"
      />
    </div>

    <div class="grid grid-cols-3 w-[85%] gap-8" v-else>
      <SkeletonLoaderCard v-for="i in 6" :key="i" />
    </div>
  </div>
</template>
