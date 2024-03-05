<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
const dummyZoom = 12;

const dummyCenter = [9.10469, 38.675331];
const stats = [
  { id: 1, name: "Burger " },
  { id: 2, name: "French Fries " },
  { id: 3, name: "Pizza " },
  { id: 4, name: "Italian" },
];
const dummyPlaceLocations = [
  {
    area: { name: "Location 1" },
    location: { coordinates: [9.10469, 38.675331] },
  },
];
const recipes = [
  {
    __typename: "recipe",
    id: 81,
    title: "Lasagna with pankac",
    rating: 3,
    owner: 67,
    instructions:
      '"first do awerfrasdfasdfasdasdasdsdasdasd,,,,next asdweijwedwkediweiwendfwejnd dwedwed wef we ,,,,then asdfawefawefwefawef awe fwe we ad"',
    Like_number: 1,
    ingredient: '"milk,,,,potato,,,,dench,,,,nice"',
    images:
      "https://res.cloudinary.com/dmr0drawd/image/upload/v1700053780/xjjcklar4ytvqtaa8guc.jpg",
    durations: 12,
    descriptions:
      "Bread the eggplant. Mix together the herb, Parmesan, and panko coating in one shallow bowl, and whisk 2 eggs with a dash of almond milk in another. Dip each eggplant slice into the egg mixture before tossing it in the panko. Make sure the eggplant is well-coated on all sides!",
    categories: "lunch",
  },
  {
    __typename: "recipe",
    id: 52,
    title: "Pasta",
    rating: 2,
    owner: 2,
    instructions: '""',
    Like_number: 2,
    ingredient: '""',
    images:
      "http://res.cloudinary.com/dmr0drawd/image/upload/v1697875761/pfoess2kqehsvfnxomnf.jpg",
    durations: 12,
    descriptions:
      "Bread the eggplant. Mix together the herb, Parmesan, and panko coating in one shallow bowl, and whisk 2 eggs with a dash of almond milk in another. Dip each eggplant slice into the egg mixture before tossing it in the panko. Make sure the eggplant is well-coated on all sides!",
    categories: "breakfast",
  },
  {
    __typename: "recipe",
    id: 51,
    title: "Fruit panch",
    rating: 0,
    owner: 2,
    instructions: '""',
    Like_number: 2,
    ingredient: '""',
    images:
      "http://res.cloudinary.com/dmr0drawd/image/upload/v1697875664/sqppiljwaf0upwmr5t9u.jpg",
    durations: 12,
    descriptions:
      "Bread the eggplant. Mix together the herb, Parmesan, and panko coating in one shallow bowl, and whisk 2 eggs with a dash of almond milk in another. Dip each eggplant slice into the egg mixture before tossing it in the panko. Make sure the eggplant is well-coated on all sides!",
    categories: "dinner",
  },
  {
    __typename: "recipe",
    id: 54,
    title: "sandwich with egg",
    rating: 5,
    owner: 2,
    instructions: '""',
    Like_number: 2,
    ingredient: '""',
    images:
      "http://res.cloudinary.com/dmr0drawd/image/upload/v1697876209/h2sjryagp4aoycw7yas6.jpg",
    durations: 45,
    descriptions:
      "Bread the eggplant. Mix together the herb, Parmesan, and panko coating in one shallow bowl, and whisk 2 eggs with a dash of almond milk in another. Dip each eggplant slice into the egg mixture before tossing it in the panko. Make sure the eggplant is well-coated on all sides!",
    categories: "lunch",
  },
  {
    __typename: "recipe",
    id: 88,
    title: "lasagna",
    rating: null,
    owner: 67,
    instructions:
      '"afvsdfvdfvdfvdfvsdfv,,,,sfv sdf fs fs f rf rf er fe rf r ,,,,a fe rf re f fse rf s rf ser f er fr f"',
    Like_number: 0,
    ingredient: '"fvdfvdfvdfv,,,,sfvsdfvdf,,,,asfv"',
    images:
      "https://res.cloudinary.com/dmr0drawd/image/upload/v1700147556/zht3qyu9ly6eqrc14a3o.png",
    durations: 44,
    descriptions:
      "Bread the eggplant. Mix together the herb, Parmesan, and panko coating in one shallow bowl, and whisk 2 eggs with a dash of almond milk in another. Dip each eggplant slice into the egg mixture before tossing it in the panko. Make sure the eggplant is well-coated on all sides!",
    categories: "breakfast",
  },
];

const dummyData = [
  { rating: 1, barValue: 1, barTotal: 10 },
  { rating: 2, barValue: 2, barTotal: 5 },
  { rating: 3, barValue: 5, barTotal: 5 },
  { rating: 4, barValue: 1, barTotal: 10 },
  { rating: 5, barValue: 1, barTotal: 10 },

  // Add more dummy data objects as needed
];
</script>
<!-- 
<template>
      <TabGroup>
        <TabList class="flex   border-b border-gray-300 gap-8">
          <Tab
            as="template"
            v-slot="{ selected }"
          >
          <button
              :class="[
                'border-b-2 border-gray-200 text-lg',
                selected
                ? 'border-primary-100 text-primary-100' : 'border-transparent text-black hover:border-gray-50 hover:text-gray-700', 'whitespace-nowrap border-b-3 py-5 px-2 text-sm font-medium',
              ]"
            >
          All
          </button>
          </Tab>
          <Tab
            as="template"
            v-slot="{ selected }"
          >
            <button
              :class="[
                'border-b-2 border-gray-200 text-lg',
                selected
                ? 'border-primary-100 text-primary-100' : 'border-transparent text-black hover:border-gray-50 hover:text-gray-700', 'whitespace-nowrap border-b-2 py-5 px-1 text-sm font-medium',
              ]"
            >
          Reported
          </button>
          </Tab>
        </TabList>
  
        <TabPanels class="mt-5">
          <TabPanel class=" overflow-y-auto divide-y-2 w-full ">
            <HReviewComment :harrasment="true"/>
            <HReviewComment :harrasment="false"/>
            <HReviewComment :harrasment="false"/>
            <HReviewComment :harrasment="true"/>
            <HReviewComment :harrasment="false"/>
            <HReviewComment :harrasment="false"/>

            
          </TabPanel>
          <TabPanel class="
              rounded-xl bg-white flex-col p-3'
            "
          >
          
       </TabPanel>
        </TabPanels>
      </TabGroup>
  </template>
   -->
