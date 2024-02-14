<script setup>
const search = ref("");
</script>

<template>
  <div>
    <div class="flex items-center justify-end pb-10 gap-x-5">
      <H-Textfield
        name="search"
        type="text"
        placeholder="Search here"
        trailing-icon="uil:search"
        v-model="search"
      ></H-Textfield>

      <!-- <div class="border rounded-md py-3 px-4">
        <Icon
          name="heroicons-outline:adjustments"
          class="text-2xl cursor-pointer z-30"
        />
      </div> -->
    </div>

    <div class="grid grid-cols-3">
      <!-- ------------------------Area--------- -->
      <ConfigurationsLocationsArea
        :search="search"
      ></ConfigurationsLocationsArea>

      <!-- ------------------------City--------- -->
      <ConfigurationsLocationsCity></ConfigurationsLocationsCity>
    </div>
  </div>
</template>
