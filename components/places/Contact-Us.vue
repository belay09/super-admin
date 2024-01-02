<script setup>
/*----------------------------Globals-----------------------------*/
// const props = defineProps({
//   place: {
//     type: Object,
//     required: true,
//   },
// });
</script>

<template>
  <div class="w-full flex flex-col space-y-8">
    <p class="font-medium text-xl">Contact</p>
    <!-- -------------------------Place Phone number----------------- -->

    <div class="flex items-center space-x-2">
      <div class="">
        <Icon name="heroicons:phone-arrow-up-right-20-solid" class="" />
      </div>
      <p class="text-sheger-gray-100 text-lg">+251993534293</p>
    </div>

    <!-- -------------------------Place Email----------------- -->

    <div class="flex items-center space-x-2">
      <div class="">
        <Icon name="heroicons:envelope-solid" class="" />
      </div>
      <p class="text-sheger-gray-100 text-lg underline">test@gmail.com</p>
    </div>

    <div class="w-1/2 border"></div>

    <!-- -------------------------Place Webite link----------------- -->
    <p class="text-xl">Follow on Social Media</p>

    <div class="flex justify-start space-x-6">
      <a href="https://www.tiktok.com/@shegergebeta?lang=en">
        <div
          class="w-7 h-7 border rounded-full bg-white flex flex-col items-center justify-center"
        >
          <Icon name="ic:baseline-tiktok" class="text-primary-600" />
        </div>
      </a>

      <a href="https://www.youtube.com/@ShegerGebeta">
        <div
          class="w-7 h-7 border rounded-full bg-white flex flex-col items-center justify-center"
        >
          <Icon name="uil:youtube" class="text-primary-600" />
        </div>
      </a>
      <a href="https://www.instagram.com/shegergebeta/?hl=en">
        <div
          class="w-7 h-7 border rounded-full bg-white flex flex-col items-center justify-center"
        >
          <Icon name="uil:instagram-alt" class="text-primary-600" />
        </div>
      </a>
      <a href="https://twitter.com/sheger_gebeta/status/1452136022393987074">
        <div
          class="w-7 h-7 border rounded-full bg-white flex flex-col items-center justify-center"
        >
          <Icon name="akar-icons:x-fill" class="text-primary-600" />
        </div>
      </a>
    </div>

    <!-- -------------------------Place Social medias----------------- -->
    <!-- <div v-if="place.placeSocialMedias" class="flex flex-col space-y-6">
      <p class=" text-xl">Follow on Social Media</p>

      <div class="flex md:justify-start space-x-6">
        <NuxtLink
          v-for="socialMedia in place.placeSocialMedias"
          :key="socialMedia.id"
          :to="socialMedia.socialMedia?.url"
          target="_blank"
          class="w-7 h-7 border rounded-full bg-white flex flex-col items-center justify-center"
        >
          <Icon name="uil:youtube" class="text-primary-600" />
        </NuxtLink>
      </div>
    </div> -->
  </div>
</template>
