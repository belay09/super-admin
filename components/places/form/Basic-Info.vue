<script setup>
const placeTypeItems = ref([
  {
    name: "Hotels",
    id: "Hotels",
  },
  {
    name: "Restaurants",
    id: "Restaurants",
  },
  {
    name: "Cafes",
    id: "Cafes",
  },
  {
    name: "Caterings",
    id: "Caterings",
  },
]);
</script>

<template>
  <div class="flex">

    <!-- ----------------------------------------------Left-------------------------------- -->
    
    <div class="flex-[50%] px-20">

      <!-------------------------------------- image upload------------------------------------------------- -->

      <div
        class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg p-8"
      >
        <Icon name="uil:cloud-upload" class="w-20 h-20" />
        <div class="input_field flex flex-col w-max mx-auto text-center">
          <label>
            <input
              class="text-sm cursor-pointer w-36 hidden"
              type="file"
              accept="image/*"
              multiple
            />
            <div>
              Drag and drop here or
              <span class="text-primary-600">Browse</span>
            </div>
          </label>

          <div class="">Select images that are Square and 10MB</div>
        </div>
      </div>

      <!--------------------------------------------------- Place Name------------------------------- -->

      <HTextfield
        type="text"
        name="PlaceName"
        class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
      >
        <template #label>
          <p class="text-sheger-gray-100">Place Name</p>
        </template>
      </HTextfield>

      <!------------------------------------------------cousins----------------------------------------->

      <HTextfield
        type="text"
        name=""
        class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
      >
        <template #label>
          <p class="text-sheger-gray-100">Cousins</p>
        </template>
      </HTextfield>

      <!------------------------------------------------ Type--------------------------------------------->

      <H-SingleSelect
        name="place_type"
        id="place_type"
        label="Type"
        :items="placeTypeItems"
        v-model="placeType"
      ></H-SingleSelect>

      <!-------------------------------------------------- tag--------------------------------------->

      <H-MultiSelect
        name="place_tag"
        id="place_tag"
        :items="placeTypeItems"
        label="Tag"
        v-model="placeType"
      >
      </H-MultiSelect>

      <!-- --------------------------------------------------Ambiance----------------------------------- -->
      <H-MultiSelect
        name="place_ambiance"
        id="place_ambiance"
        :items="placeTypeItems"
        label="Ambiance"
        v-model="placeType"
      >
      </H-MultiSelect>
    </div>

    <!-- Right -->
    <div class="flex-[50%] px-20">
      <div class="text-xl font-medium">Contact</div>

      <!------------------------------------Phone Number--------------------------------------->
      
      <HTextfield
        leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
        leading-text="+251"
        placeholder="9000000000"
        name="Phone Number"
        v-model="phoneNumber"
        rules="ethio_phone"
        type="text"
      >
        <template #label>
          <div class="lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Phone Number</span
            >
          </div>
        </template>
      </HTextfield>
      
      <!---------------------------------Alternative Phone Number------------------------------------>
      <HTextfield
        leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
        leading-text="+251"
        name="Phone Number"
        v-model="alternativephoneNumber"
        rules="ethio_phone"
        type="text"
        placeholder="9000000000"
      >
        <template #label>
          <div class="lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Alternative Phone Number</span
            >
          </div>
        </template>
      </HTextfield>

      <!-------------------------------------Contact Email----------------------------->
      <HTextfield
        placeholder="email@example.com"
        name="Email"
        v-model="email"
        rules="requiredN|email"
        type="text"
      >
        <template #label>
          <div class="iphone5:my-2 lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Contact Email</span
            >
          </div>
        </template>
      </HTextfield>

      <!---------------------------------------------Website-------------------------- -->
      <HTextfield
        placeholder="www.example.com"
        name="Website"
        v-model="website"
        rules="requiredN"
        type="text"
      >
        <template #label>
          <div class="iphone5:my-2 lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Contact Website</span
            >
          </div>
        </template>
      </HTextfield>

      <!-- ------------------------------------Social Media ------------------------ -->

      <div class="text-xl font-medium my-3">Social Media</div>
      <div>
        <!------------------------------------------- Display--------------------------------- -->
        <UiTagsSocialMedia
          name="Facebook"
          icon_name="uiw:facebook"
        ></UiTagsSocialMedia>

        <!---------------------------------------- Select Icon---------------------------------- -->

        <div class="flex items-center gap-2 my-2">
          <div class="border p-2 rounded-l-20">
            <Icon name="uil:facebook-f" class="w-6 h-6 text-gray-500" />
            <Icon
              name="heroicons:chevron-down-solid"
              class="w-6 h-6 text-gray-500"
            />
          </div>
          <HTextfield
            placeholder="facebook.com/username"
            name="Facebook"
            v-model="facebook"
            rules="requiredN"
            type="text"
          >
          </HTextfield>
          <div>
            <Icon name="uil:plus" class="w-6 h-6 text-gray-500" />
          </div>
        </div>
      </div>

      <!-- ----------------------------------Offer Takeout---------------------------------- -->
      
      <div class="flex items-start justify-between my-3">
        <div class="text-xl font-medium">Offer Takeout</div>
        <HSwitch name=""></HSwitch>
      </div>
      
      <!-- -------------------------------------OrderNumber---------------------------------- -->

      <HTextfield
        leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
        leading-text="+251"
        name="Phone Number"
        v-model="OrderNumber"
        rules="ethio_phone"
        type="text"
        placeholder="9000000000"
      >
        <template #label>
          <div class="lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Order Number</span
            >
          </div>
        </template>
      </HTextfield>

      <!-- ----------------------------------------Alternative Order Number--------------------- -->
      
      <HTextfield
        leading-text-class="bg-sheger-gray-300 h-full rounded-l-md flex items-center px-2 absolute top-[2%] left-[0%]"
        leading-text="+251"
        name="Phone Number"
        v-model="AlternativeOrderNumber"
        rules="ethio_phone"
        type="text"
        placeholder="9000000000"
      >
        <template #label>
          <div class="lg:my-2">
            <span class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
              >Alternative Order Number</span
            >
          </div>
        </template>
      </HTextfield>
    </div>
  </div>
</template>
