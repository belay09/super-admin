<script setup>
const showEditBadge = ref(false);
const recommendationId = ref(null);
function showDrinkEdit(id) {
  recommendationId.value = id;
  if (showEditBadge.value) {
    showEditBadge.value = false;
    setTimeout(() => {
      showEditBadge.value = true;
    }, 400);
  } else {
    showEditBadge.value = true;
  }
}

const makeRefetch = ref(false);

function changeRefetch() {
  makeRefetch.value = true;
  setTimeout(() => {
    makeRefetch.value = false;
  }, 100);
}
</script>

<template>
  <div class="w-full py-6">
    <div class="grid grid-cols-5 items-start">
      <!-- -------------------Drinks add and edit-------------------- -->
      <div class="col-span-2 pr-10 border-r">
        <Configurations-Badges-Add
          v-if="!showEditBadge"
          @add="changeRefetch"
        ></Configurations-Badges-Add>
        <Configurations-Badges-Edit
          v-else
          :id="recommendationId"
          @edit="changeRefetch"
        ></Configurations-Badges-Edit>

        <!-- ----------------------Add new button------------------- -->
        <button
          v-if="showEditBadge"
          @click="showEditBadge = false"
          class="primary-button bg-primary-600 text-white secondary-border py-3 mt-4 w-full"
        >
          <span>Add New</span>
          <Icon name="heroicons:plus-small-solid" class="text-2xl"></Icon>
        </button>
      </div>

      <!-- -------------------Drinks list-------------------- -->

      <div class="col-span-3 pl-10">
        <Configurations-Badges-List
          :make-refetch="makeRefetch"
          @edit="showDrinkEdit"
        ></Configurations-Badges-List>
      </div>
    </div>
  </div>
</template>
