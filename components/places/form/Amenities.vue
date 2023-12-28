<script setup>
const amenities = ref([
  {
    name: "Wifi",
    id: "Wifi",
    icon: "uil:wifi",
  },
  {
    name: "Parking",
    id: "Parking",
    icon: "lucide:parking-circle",
  },
  {
    name: "Air Conditioner",
    id: "Air Conditioner",
    icon: "iconoir:air-conditioner",
  },
]);

const placeAmenities = ref([
  {
    amenity: {
      title: "Wifi",
    },
    placeAmenityResources: [
      {
        media: {
          url: "/images/temporary/default-food-image.png",
        },
      },
    ],
  },
  {
    amenity: {
      title: "Parking",
    },
    placeAmenityResources: [
      {
        media: {
          url: "/images/temporary/default-food-image.png",
        },
      },
    ],
  },
  {
    amenity: {
      title: "Air Conditioner",
    },
    placeAmenityResources: [
      {
        media: {
          url: "/images/temporary/default-food-image.png",
        },
      },
    ],
  },
]);

const placeAmenityDescription = ref("");
</script>
<template>
  <div class="flex">
    <!-- Left -->
    <div class="flex flex-col gap-4 flex-[50%] px-10">
      <!-------------------------------Amenity---------------------->
      <H-SingleSelect
        name="place_amenity"
        id="place_amenity"
        label="Amenity"
        :items="amenities"
        v-model="placeAmenity"
      >
        <template v-slot:header="{ item }">
          <div class="flex items-center gap-x-5">
            <div class="border-r pr-4">
              <Icon :name="item.icon" class="text-2xl cursor-pointer z-30" />
            </div>
            <p>{{ item.name }}</p>
          </div>
        </template>
        <template v-slote:row="{ item }">
          <div class="flex items-center gap-x-5">
            <div class="border-r pr-4">
              <Icon :name="item.icon" class="text-2xl cursor-pointer z-30" />
            </div>
            <p>{{ item.name }}</p>
          </div>
        </template>
      </H-SingleSelect>

      <!-------------------------------Description----------------------------------->
      <H-Textarea
        name="place_amenity_description"
        id="place_amenity_description"
        label="Description"
        placeholder="Description"
        v-model="placeAmenityDescription"
      ></H-Textarea>

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
    <!-- right -->
    <div class="flex-[50%]">
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-x-4 gap-y-6"
      >
        <UiCardsAmenityItemCard
          v-for="amenity in placeAmenities"
          :key="amenity"
          :amenity="amenity"
        ></UiCardsAmenityItemCard>
      </div>
    </div>
  </div>
</template>
