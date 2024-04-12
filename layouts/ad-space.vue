<script></script>

<template>
  <NuxtLayout name="advertisement">
    <div class="flex">
      <!-- ----------------Message type links----------- -->
      <div
        class="flex flex-col space-y-8 text-xl py-10 secondary-text font-medium w-[15%]"
      >
        <nuxt-link active-class="text-primary-600" to="/app/ad-space"
          >Hotels</nuxt-link
        >
        <nuxt-link
          active-class="text-primary-600"
          to="/app/ad-space/restaurants"
          >Restaurants</nuxt-link
        >
        <nuxt-link active-class="text-primary-600" to="/app/ad-space/cafes"
          >Cafes</nuxt-link
        >
        <nuxt-link active-class="text-primary-600" to="/app/ad-space/caterings"
          >Caterings</nuxt-link
        >
        <nuxt-link active-class="text-primary-600" to="/app/ad-space/reviews"
          >Reviews</nuxt-link
        >
      </div>

      <div class="w-[85%] pl-10 border-l">
        <slot></slot>
      </div>
    </div>
  </NuxtLayout>
</template>
