<script setup>
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});

/**--------------------Featured place value------------- */
function featuredPlaceValue(value) {
  if (value === "RECENTLY_OPENED_PLACE") {
    return {
      name: "Recently Opened",
      class: " text-[#47FF6F]",
    };
  } else if (value === "WEEKLY_RECOMMENDED_PLACE") {
    return {
      name: "Weekly Recommended",
      class: "text-[#9747FF]",
    };
  } else if (value === "SEASONAL_PLACE") {
    return {
      name: "Seasonal",
      class: "text-[#477BFF]",
    };
  }
}

/**----------------------Detail page link------- */
const detailPageLink = computed(() => {
  return `/app/places/${props.place.id}`;
});
</script>
<template>
  <NuxtLink
    :to="detailPageLink"
    class="flex flex-col border max-w-[397px] p-[25px] rounded-xl my-4 text-sm"
  >
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex gap-3 w-full">
        <!-- Logo -->
        <div class="w-20 h-20 self-start shrink-0 mr-1">
          <!-- Image -->
          <img
            src="/images/temporary/Hotel_Logo.png"
            alt=""
            class="object-cover w-full h-full rounded-xl"
          />
        </div>
        <!-- Middle -->
        <div class="flex flex-col gap-2 w-full">
          <!-- Name -->
          <div class="flex justify-between">
            <h1 class="text-xl font-medium">{{ place.name }}</h1>
            <!-- Option Icon -->
            <div class="hover:cursor-pointer">
              <Icon name="iwwa:option" class="w-8 h-8" />
            </div>
          </div>
          <!-- status -->
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <div class="bg-sheger-green-100 px-2 py-1 rounded-sm">
              <p class="text-sheger-green-600 font-medium">Active</p>
            </div>
            <div class="bg-primary-100 px-2 py-1 rounded-sm">
              <p class="text-primary-600 font-medium">Restaurant</p>
            </div>
            <div
              v-for="featuredType in place.featured_places"
              class="bg-gray-100 px-2 py-1 rounded-sm"
              :class="
                featuredPlaceValue(featuredType.featured_place_type?.value)
                  .class
              "
            >
              <p class="font-medium">
                {{
                  featuredPlaceValue(featuredType.featured_place_type?.value)
                    .name
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Body -->
    <div class="flex flex-col gap-4 my-2 text-sheger-gray-100">
      <!-- Rating and like -->
      <div class="flex items-center justify-between">
        <!-- Rating -->
        <div class="flex items-center gap-2">
          <Icon name="iwwa:star" class="w-6 h-6" />
          <p class="">3/5 <span class="">(1,234 reviews)</span></p>
        </div>
        <!-- dash -->
        <div>
          <p class="">|</p>
        </div>
        <!-- Like -->
        <div class="flex items-center gap-2">
          <Icon name="heroicons:heart-solid" class="w-6 h-6" />
          <p class="">2.5K <span class="">Likes</span></p>
        </div>
      </div>
      <!-- Location -->
      <div class="flex items-center gap-3">
        <Icon name="carbon:map" class="h-5 w-5" />
        <p class="">22 Mazoriya, Addis Ababa</p>
      </div>
      <!-- Tags -->
      <div class="flex flex-wrap secondary-text pb-4">
        <p
          v-for="placeTag in place.placeTags"
          :key="placeTag.tag.id"
          class="pr-2"
        >
          #{{ placeTag.tag.title }}
        </p>
      </div>
      <!-- menu update -->

      <div class="flex items-center gap-3">
        <Icon name="carbon:calendar" class="h-5 w-5" />
        <p class="">Menu last updated: 2 days ago</p>
      </div>

      <!-- last payed -->
      <div class="flex items-center gap-3">
        <Icon name="carbon:calendar" class="h-5 w-5" />
        <p class="">Last payed: 2 days ago</p>
      </div>
    </div>
  </NuxtLink>
</template>
