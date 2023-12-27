<script setup>
/*----------------------------Globals-----------------------------*/
// const props = defineProps({
//   place: {
//     type: Object,
//     required: true,
//   },
// });
console.log("object");
</script>

<template>
<div class="w-full flex flex-col space-y-6">
    <p class="font-medium text-xl ">Contact</p>
    <!-- -------------------------Place Phone number----------------- -->

    <div class="flex items-center space-x-2">
      <div class="">
        <Icon
          name="heroicons:phone-arrow-up-right-20-solid"
          class=""
        />
      </div>
      <p
        class="whitespace-nowrap text-sheger_brown-200 text-sm xl:text-lg"
      >
        +251993534293
      </p>
    </div>

    <!-- -------------------------Place Email----------------- -->

    <div class="flex items-center space-x-2">
      <div class="">
        <Icon name="heroicons:envelope-solid" class="" />
      </div>
      <p
        class="whitespace-nowrap text-sheger_brown-200 text-sm xl:text-lg underline"
      >
        test@gmail.com
      </p>
    </div>

    <!-- -------------------------Place Webite link----------------- -->

    <div class="flex items-center space-x-2">
      <div class="">
        <Icon name="uil:globe" class="" />
      </div>
      <a
        href="www.test.com"
        target="_blank"
        class="whitespace-nowrap text-sheger_brown-200 text-sm xl:text-lg underline"
      >
        Webiste link
      </a>
    </div>

    <div class="w-1/2 border"></div>

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
