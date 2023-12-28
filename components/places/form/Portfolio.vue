<script setup>
const portfolios = ref([
  {
    title: "Served Lunch at National Assembly of Doctors",
    date: "12 Feb, 2023",
    images: [
      "/images/temporary/default-food-image.png",
      "/images/temporary/default-food-image.png",
      "/images/temporary/default-food-image.png",
    ],
  },
]);
</script>

<template>
  <div class="flex px-20 py-10">
    <!-----------------------------------Left-------------------------------------------------- -->
    <div class="flex-[50%] px-10 flex flex-col gap-4 border-r mx-2">
      <!-- ----------------------------------------- Title ---------------------------------------->
      <HTextfield
        type="text"
        name="Title"
        class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
        rules="required"
      >
        <template #label>
          <p class="text-sheger-gray-100">Title</p>
        </template>
      </HTextfield>

      <!----------------------------------------------Date------------------------------------------>
      <HDatePicker
        id="date"
        name="date"
        label="Date"
        class=""
        trailing-icon="uil:calender"
        trailing-icon-class="lg:text-sheger-gray-100"
      ></HDatePicker>

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
                class="w-[100px]"
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

      <!------------------------------- Add btn --------------------------->

      <div class="primary-button border">
        <Icon name="uil:plus" class="w-6 h-6" />
        <span class="">Add</span>
      </div>
    </div>

    <!------------------------------------Right----------------------------------------->

    <div class="flex-[50%]">
      
      <!-------------------------------------- Preview------------------------------------------------- -->
      
      <UiCardsPortfolioItemCard
        class="w-full"
        :portfolio="portfolios[0]"
      ></UiCardsPortfolioItemCard>
    </div>
  </div>
</template>
