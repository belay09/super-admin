<script setup>
const contents = ref([
  {
    name: "Categories",
    id: "categories",
  },
  {
    name: "Place Tag",
    id: "placeTag",
  },
  {
    name: "Menu Tag",
    id: "menuTag",
  },
  {
    name: "Ambiance",
    id: "ambiance",
  },
  {
    name: "Amenity",
    id: "amenity",
  },
  {
    name: "Social Media",
    id: "socialMedia",
  },
  {
    name: "Report Type",
    id: "reportType",
  },
  {
    name: "Support Type",
    id: "supportType",
  },
  {
    name: "Badge",
    id: "badge",
  },
  {
    name: "Location",
    id: "location",
  },
]);

const activeIndex = ref(0);
const scrollIntoView = (index) => {
  const contentElement = document.getElementById(`content-${index}`);
  if (contentElement) {
    contentElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "start",
    });
  }
};

let windowHeight = 0; // Initialize with zero

const handleScroll = () => {
  // Update the windowHeight on each scroll event
  windowHeight = window.innerHeight;
  const contentElements = document.querySelectorAll(".content");
  const middlePosition = windowHeight / 2;

  let closestDistance = Number.MAX_VALUE;
  let closestIndex = null;

  contentElements.forEach((contentElement, index) => {
    const rect = contentElement.getBoundingClientRect();
    const distanceToMiddle = Math.abs(
      rect.top + rect.height / 2 - middlePosition
    );

    if (distanceToMiddle < closestDistance) {
      closestDistance = distanceToMiddle;
      closestIndex = index;
    }
  });

  if (closestIndex !== null) {
    activeIndex.value = closestIndex;
  }
};

const handleButtonClick = (index) => {
  activeIndex.value = index;
  scrollIntoView(index);
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="grid grid-cols-5 gap-x-6">
    <!-- Use Nuxt link for navigation -->
    <div class="col-span-1">
      <div
        id="sidebar"
        class="flex flex-col space-y-6 border-r fixed w-56 py-12"
      >
        <button
          v-for="(content, index) in contents"
          @click="handleButtonClick(index)"
          :key="index"
          :class="{ 'text-primary-600': index === activeIndex }"
          class="duration-300 text-left text-lg"
        >
          {{ content.name }}
        </button>
      </div>
    </div>

    <div class="col-span-4">
      <div id="content" class="pb-44">
        <!-- Use Nuxt dynamic route to display content -->
        <div
          v-for="(content, index) in contents"
          :key="index"
          :id="'content-' + index"
          class="content my-6"
        >
          <Configurations-AddTag :content="content" />
        </div>
      </div>
    </div>
  </div>
  <div></div>
</template>
