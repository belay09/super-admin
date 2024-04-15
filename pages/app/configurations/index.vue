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
    name: "Cousins",
    id: "cousins",
  },
  {
    name: "Social Media",
    id: "socialMedia",
  },

  {
    name: "Badge",
    id: "badge",
  },
  {
    name: "Location",
    id: "location",
  },
  {
    name: "Place service",
    id: "placeService",
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
  if (activeIndex.value >= 5) {
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
  layout: "configuration",
});
</script>

<template>
  <div class="grid grid-cols-5 gap-x-6">
    <!-- Use Nuxt link for navigation -->
    <div class="col-span-1">
      <div
        id="sidebar"
        class="fixed flex flex-col w-56 py-12 space-y-6 border-r"
      >
        <button
          v-for="(content, index) in contents"
          @click="handleButtonClick(index)"
          :key="index"
          :class="{ 'text-primary-600': index === activeIndex }"
          class="text-lg text-left duration-300"
        >
          {{ content.name }}
        </button>
      </div>
    </div>

    <div class="col-span-4">
      <div id="content" class="pb-44">
        <!-- ------------------Section 1 for scroll---------- -->
        <div v-if="activeIndex < 6">
          <!-- ------------------Categories section---------------- -->
          <div :id="'content-' + 0" class="my-6 content">
            <Configurations-Categories />
          </div>
          <div :id="'content-' + 1" class="my-6 content">
            <Configurations-Tags />
          </div>
          <!-- ------------------Ambiance section---------------- -->
          <div :id="'content-' + 2" class="my-6 content">
            <Configurations-Ambiances />
          </div>

          <!-- ------------------Amenity section---------------- -->
          <div :id="'content-' + 3" class="my-6 content">
            <Configurations-Amenities />
          </div>
          <!-- -----------------Cousins section---------- -->

          <div :id="'content-' + 4" class="my-6 content">
            <ConfigurationsCousins />
          </div>

          <!-- ------------------Social Medias section---------------- -->
          <div :id="'content-' + 5" class="my-6 content">
            <Configurations-SocialMedias />
          </div>
        </div>
        <!-- ------------------Badges---------------- -->
        <div
          v-else-if="activeIndex == 6"
          :id="'content-' + 5"
          class="my-6 content"
        >
          <Configurations-Badges />
        </div>

        <!-- ------------------Location---------------- -->
        <div
          v-else-if="activeIndex == 7"
          :id="'content-' + 6"
          class="my-6 content"
        >
          <Configurations-Locations />
        </div>

        <!-- ------------------Place Service---------------- -->
        <div
          v-else-if="activeIndex == 7"
          :id="'content-' + 7"
          class="h-full my-6 content"
        >
          <Configurations-PlaceService />
        </div>
      </div>
    </div>
  </div>
  <div></div>
</template>
