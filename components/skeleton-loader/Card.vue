<template>
  <div
    class="flex animate-pulse flex-col border max-w-lg p-[25px] rounded-xl text-sm hover:cursor-pointer"
  >
    <!-- Header Skeleton -->
    <div class="flex items-start justify-between">
      <div class="flex w-full gap-3">
        <div class="self-start w-20 h-20 mr-1 bg-gray-300 shrink-0"></div>
        <div class="flex flex-col w-full gap-2">
          <div class="flex justify-between">
            <h1 class="w-3/4 text-xl font-medium bg-gray-300"></h1>
            <div class="relative">
              <button class="hover:cursor-pointer">
                <div class="w-8 h-8 bg-gray-300"></div>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-x-4 gap-y-2">
            <div class="px-2 py-1 bg-gray-300 rounded-sm"></div>
            <div class="px-2 py-1 bg-gray-300 rounded-sm"></div>
            <div class="px-2 py-1 bg-gray-300 rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Other Place Data Skeleton -->
    <div class="flex flex-col gap-4 my-2 text-sheger-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
        <span
          class="w-20 h-5 underline bg-gray-300 rounded decoration-sheger_brown-200 leading"
        ></span>
      </div>
      <div class="flex flex-wrap gap-3 pb-4 secondary-text">
        <span
          v-for="i in 3"
          :key="i"
          class="w-20 h-5 underline bg-gray-300 rounded decoration-sheger_brown-200 leading"
        ></span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
        <span
          class="w-40 h-5 underline bg-gray-300 rounded decoration-sheger_brown-200 leading"
        ></span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
        <span
          class="w-40 h-5 underline bg-gray-300 rounded decoration-sheger_brown-200 leading"
        ></span>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-5 h-5 bg-gray-300 rounded-full"></div>
        <span
          class="w-40 h-5 underline bg-gray-300 rounded decoration-sheger_brown-200 leading"
        ></span>
      </div>
    </div>
  </div>
</template>
