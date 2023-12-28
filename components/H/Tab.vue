<script setup>
/*-------------------------Globals--------------------*/

const emit = defineEmits(["update:currentTabIndex"]);
const props = defineProps({
  tabs: {
    type: Array,
    default: () => [],
  },

  currentTabIndex: {
    type: Number,
    default: 0,
    required: false,
  },
  tabClass: {
    type: String,
    default: "",
  },

  tabContainerClass: {
    type: String,
    default: "",
  },
});

/*............Tab ............*/
const selectedTab = ref(props.currentTabIndex);
const indicator = ref(null);
const indicatorContainer = ref(null);

function tabWidth() {
  const element = document.getElementById(`tab-${selectedTab.value}`);
  return element.offsetWidth;
}
function changeTab(index) {
  selectedTab.value = index;
  moveIndicator();
  emit("update:currentTabIndex", index);
}

const moveIndicator = () => {
  const element = document.getElementById(`tab-${selectedTab.value}`);
  const rect = element.getBoundingClientRect();
  const position = rect.left + window.pageXOffset;

  if (indicatorContainer.value) {
    indicator.value.style.left = `${
      position - indicatorContainer.value.getBoundingClientRect().left
    }px`;
  }

  indicator.value.style.width = `${tabWidth()}px`;
};

watch(
  () => props.currentTabIndex,
  (newValue) => {
    selectedTab.value = props.currentTabIndex;
    moveIndicator();
  }
);

onMounted(() => {
  setTimeout(() => {
    moveIndicator();
  }, 100);
});
</script>

<template>
  <ClientOnly>
    <HeadlessTabGroup :selectedIndex="selectedTab" @change="changeTab" as="div">
      <HeadlessTabList
        @scroll="moveIndicator"
        as="div"
        class="flex space-x-6 lg:justify-start scroll overflow-x-scroll"
        :class="tabContainerClass"
      >
        <HeadlessTab
          :id="`tab-${index}`"
          :class="[
            selectedTab === index ? 'text-primary-600 ' : '',
            'outline-none focus:outline-none duration-500 ease-in-out leading-none  md:text-xl cursor-pointer whitespace-nowrap',
            tabClass,
          ]"
          as="div"
          v-for="(tab, index) in tabs"
          :key="tab.value"
        >
          <slot
            name="tab"
            :tabData="{
              tab: tab,
              isActive: selectedTab === index,
            }"
          >
            {{ tab.name }}
          </slot>
        </HeadlessTab>
      </HeadlessTabList>
      <div
        ref="indicatorContainer"
        class="relative w-full border-b py-2 overflow-hidden"
      >
        <div
          ref="indicator"
          class="absolute duration-200 left-0 bottom-0 h-0.5 bg-primary-600"
        ></div>
      </div>

      <HeadlessTabPanels as="div">
        <HeadlessTabPanel as="div" v-for="tab in tabs" :key="tab.value">
          <slot :name="tab.value"></slot>
        </HeadlessTabPanel>
      </HeadlessTabPanels>
    </HeadlessTabGroup>
  </ClientOnly>
</template>
