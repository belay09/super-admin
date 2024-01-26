<script setup>
const contents = ref([
  {
    name: "Categories",
    id: "categories",
  },
  {
    name: "Tags",
    id: "tag",
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
  // {
  //   name: "Report Type",
  //   id: "reportType",
  // },
  // {
  //   name: "Support Type",
  //   id: "supportType",
  // },
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
  if (activeIndex.value == 5 || activeIndex.value == 6) {
    return;
  }
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
        <!-- ------------------Section 1 for scroll---------- -->
        <div v-if="activeIndex != 5 && activeIndex != 6">
          <!-- ------------------Categories section---------------- -->
          <div :id="'content-' + 0" class="content my-6">
            <Configurations-Categories />
          </div>
          <div :id="'content-' + 1" class="content my-6">
            <Configurations-Tags />
          </div>
          <!-- ------------------Ambiance section---------------- -->
          <div :id="'content-' + 2" class="content my-6">
            <Configurations-Ambiances />
          </div>

          <!-- ------------------Amenity section---------------- -->
          <div :id="'content-' + 3" class="content my-6">
            <Configurations-Amenities />
          </div>

          <!-- ------------------Social Medias section---------------- -->
          <div :id="'content-' + 4" class="content my-6">
            <Configurations-SocialMedias />
          </div>
        </div>
        <!-- ------------------Badges---------------- -->
        <div
          v-else-if="activeIndex == 5"
          :id="'content-' + 5"
          class="content my-6"
        >
          <Configurations-Badges />
        </div>
      </div>
    </div>
  </div>
  <div></div>
</template>
