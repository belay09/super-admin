
import type { Icon } from 'vue3-carousel';

import type { HSwitch } from '#build/components';
<script setup></script>
<template>
  <div class="flex flex-col justify-center items-center mt-10">
    <!-----------------------------top-------------------------------------->
    <div class="flex gap-4">
      <div class="flex items-center gap-3 border w-fit px-5 py-1 rounded-lg">
        <Icon
          name="teenyicons:location-outline"
          class="text-primary-600 w-6 h-6"
        />
        <div class="text-gray-800 font-light">
          <p>Addis Ababa</p>
          <p>Bole Rwanda</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon
            name="material-symbols:edit-location-alt-outline-rounded"
            class="w-5 h-5"
          />
          <div>|</div>
          <Icon name="uiw:delete" class="w-5 h-5" />
        </div>
      </div>
      <div class="flex items-center gap-3 border w-fit px-5 py-1 rounded-lg">
        <Icon name="tabler:route-2" class="text-sheger-gray-100 w-6 h-6" />
        <div class="text-gray-800 font-light">
          <p>Addis Ababa</p>
          <p>Bole Rwanda</p>
        </div>
        <div class="flex items-center gap-3">
          <Icon
            name="material-symbols:edit-location-alt-outline-rounded"
            class="w-5 h-5"
          />
          <div>|</div>
          <Icon name="uiw:delete" class="w-5 h-5" />
        </div>
      </div>
    </div>

    <div>
      <!-- ------------------------------------City---------------------------------- -->
      <HTextfield
        placeholder="Addis Ababa"
        name="City"
        v-model="city"
        rules="requiredN"
        type="text"
      >
        <template #label>
          <div class="iphone5:my-2 lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >City</span
            >
          </div>
        </template>
      </HTextfield>

      <!--------------------------------------Area-------------------------------------- -->
      <HTextfield
        placeholder="Bole"
        name="Area"
        v-model="area"
        rules="requiredN"
        type="text"
      >
        <template #label>
          <div class="iphone5:my-2 lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Area</span
            >
          </div>
        </template>
      </HTextfield>

      <!---------------------------------------Coordinates--------------------------------------->

      <HTextfield
        placeholder="8.984989, 16.904549"
        name="Coordinates"
        v-model="coordinates"
        rules="requiredN"
        type="text"
      >
        <template #label>
          <div class="iphone5:my-2 lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Coordinates</span
            >
          </div>
        </template>
      </HTextfield>

      <!-- ----------------------------------------Set as main location-------------------------------- -->
      <div class="flex justify-between">
        <p class="">Set as main location</p>
        <HSwitch/>
      </div>

      <!----------------------------------------------Add Location------------------------------------>
      <div class="flex items-center gap-3 primary-button border  ">
        <Icon name="fluent:location-add-16-regular" class="w-5 h-5"/>
        Add Location
      </div>
    </div>
  </div>
</template>
