<script setup>
/*----------------------------Globals-----------------------------*/
const props = defineProps({
  place: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="w-full flex flex-col space-y-6">
    <p class="font-medium text-xl dark:text-white">Contact</p>
    <!-- -------------------------Place Phone number----------------- -->

    <div class="flex items-center space-x-2">
      <div class="dark:text-white">
        <Icon
          name="heroicons:phone-arrow-up-right-20-solid"
          class="dark:text-white"
        />
      </div>
      <p
        class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400 text-sm xl:text-lg"
      >
        {{ place.contactPhoneNumber }}
      </p>
    </div>

    <!-- -------------------------Place Email----------------- -->

    <div class="flex items-center space-x-2">
      <div class="dark:text-white">
        <Icon name="heroicons:envelope-solid" class="dark:text-white" />
      </div>
      <p
        class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400 text-sm xl:text-lg underline"
      >
        {{ place.contactEmail }}
      </p>
    </div>

    <!-- -------------------------Place Webite link----------------- -->

    <div class="flex items-center space-x-2">
      <div class="dark:text-white">
        <Icon name="uil:globe" class="dark:text-white" />
      </div>
      <a
        :href="place.contactWebsite"
        target="_blank"
        class="whitespace-nowrap text-sheger_brown-200 dark:text-sheger_light_gray-400 text-sm xl:text-lg underline"
      >
        Website link
      </a>
    </div>

    <div class="w-1/2 border"></div>

    <!-- -------------------------Place Social medias----------------- -->
    <div v-if="place.placeSocialMedias" class="flex flex-col space-y-6">
      <p class="dark:text-white text-xl">Follow on Social Media</p>

      <div class="flex md:justify-start space-x-6">
        <NuxtLink
          v-for="socialMedia in place.placeSocialMedias"
          :key="socialMedia.id"
          :to="socialMedia.socialMedia?.url"
          target="_blank"
          class="w-7 h-7 flex flex-col items-center justify-center"
        >
          <img
            :src="socialMedia?.socialMedia?.icon?.lightIconUrl"
            alt=" social media icon"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
