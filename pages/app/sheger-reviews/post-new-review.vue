<script setup>
definePageMeta({
  layout: "home",
});

const placeItems = ref([
  {
    name: "Hotels",
    id: "Hotels",
    logo: "/images/temporary/kuriftu.png",
  },
  {
    name: "Restaurants",
    id: "Restaurants",
    logo: "/images/temporary/kuriftu.png",
  },
  {
    name: "Cafes",
    id: "Cafes",
    logo: "/images/temporary/kuriftu.png",
  },
  {
    name: "Caterings",
    id: "Caterings",
    logo: "/images/temporary/kuriftu.png",
  },
]);

const dishTitleItems = ref([
  {
    name: "Chicken Burger",
    id: "Chicken Burger",
  },
  {
    name: "Beef Burger",
    id: "Beef Burger",
  },
  {
    name: "Veggie Burger",
    id: "Veggie Burger",
  },
  {
    name: "Beef Burger",
    id: "Beef Burger",
  },
]);

const menuTypeItems = ref([
  {
    name: "Food",
    id: "Food",
  },
  {
    name: "Drink",
    id: "Drink",
  },
]);
</script>

<template>
  <div class="px-20">
    <!-- --------------------------------Top-------------------------------- -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-medium">Post New Review</h1>
      <div class="primary-button border bg-primary-600 text-white font-medium">
        <p class="mx-6">Post Now</p>
      </div>
    </div>

    <!-- --------------------------------Form-------------------------------- -->

    <form class="flex gap-7">
      <!-- ------------------------------Left------------------------------- -->
      <div class="flex-[50%]">
        <!------------------------------- Place--------------------------- -->

        <H-SingleSelect
          name="place"
          id="place"
          label="Type"
          :items="placeItems"
          v-model="place"
        >
          <template v-slot:header="{ item }">
            <div class="flex items-center gap-3">
              <div>
                <img :src="item.logo" class="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p class="text-sm">{{ item.name }}</p>
              </div>
            </div>
          </template>

          <template v-slot:row="{ item }">
            <div class="flex items-center gap-3">
              <div>
                <img :src="item.logo" class="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p class="text-sm">{{ item.name }}</p>
              </div>
            </div>
          </template>
        </H-SingleSelect>
        <!-- ------------------------------Description-------------------------->

        <HTextarea
          name="description"
          id="description"
          label="Description"
          v-model="description"
        />

        <!-- ------------------------------Dish Title----------------------------->

        <H-SingleSelect
          name="Dish_Title"
          id="dish_title"
          label="Dish Title"
          :items="dishTitleItems"
          v-model="dishTitle"
        ></H-SingleSelect>

        <!----------------------------------------------Price (ETB)------------------------------------------>

        <HTextfield
          type="number"
          name="Price"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100">Price (ETB)</p>
          </template>
        </HTextfield>

        <!----------------------------------------Menu Type---------------------------------------->

        <H-SingleSelect
          name="menu_type"
          id="menu_type"
          label="Menu Type"
          :items="menuTypeItems"
          v-model="menuType"
        ></H-SingleSelect>

        <!----------------------------------------Preparation Time (Minutes)-------------------------->

        <HTextfield
          type="number"
          name="Preparation Time"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100 mb-2">Preparation Time (Minutes)</p>
          </template>
        </HTextfield>

        <!----------------------------------------Ingredient ( Use comma to seprate)---------------------------------------->

        <HTextfield
          type="text"
          name="Ingredient"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100 mb-2">
              Ingredient ( Use comma to seprate)
            </p>
          </template>
        </HTextfield>

        <!----------------------------------------Tag---------------------------------------->

        <H-MultiSelect
          name="menu_tag"
          id="menu_tag"
          :items="menuTypeItems"
          label="Tag"
          v-model="placeType"
          show-by="name"
        >
        </H-MultiSelect>
      </div>

      <!-----------------------------------Right---------------------------- -->
      <div class="flex-[50%]">
        <!--------------------------------Video Url-------------------------- -->

        <HTextfield
          type="text"
          name="Video Url"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          placeholder="https://www.youtube.com/watch?v=Zz5cu72GQfE"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100 mb-2">Video Url</p>
          </template>
        </HTextfield>

        <!--------------------------------Sides-------------------------- -->

        <HTextfield
          type="text"
          name="Side"
          class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
          rules="required"
        >
          <template #label>
            <p class="text-sheger-gray-100 mb-2">Sides</p>
          </template>
        </HTextfield>

        <!----------------------------------Goes well with-------------------------- -->
        <H-SingleSelect
          name="place"
          id="place"
          label="Type"
          :items="placeItems"
          v-model="place"
        >
          <template v-slot:header="{ item }">
            <div class="flex items-center gap-3">
              <div>
                <img :src="item.logo" class="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p class="text-sm">{{ item.name }}</p>
              </div>
            </div>
          </template>

          <template v-slot:row="{ item }">
            <div class="flex items-center gap-3">
              <div>
                <img :src="item.logo" class="w-10 h-10 rounded-full" />
              </div>
              <div>
                <p class="text-sm">{{ item.name }}</p>
              </div>
            </div>
          </template>
        </H-SingleSelect>

        <!----------------------------------------Image Upload---------------------------------------->
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

        <!-------------------------------Uploaded Files------------------------------- -->

        <div class="flex flex-col gap-4">
          <p class="text-lg font-medium">Uploaded Files</p>
          <div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <img
                  src="/images/temporary/default-food-image.png"
                  class="w-[50px] h-[50px] object-cover"
                />
                <div>
                  <p class="text-lg font-medium">IMG=99KJ0-.png</p>
                  <p class="text-sm font-light text-sheger-gray-100">
                    Feb 2, 2023. image
                  </p>
                </div>
              </div>
              <!--progress -->
              <div class="bg-primary-600 h-[3px] w-[200px]" />

              <div>
                <Icon name="uil:trash-alt" class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
