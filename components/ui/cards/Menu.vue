<script setup>
import deleteMenuMutation from "@/graphql/mutations/menu/delete.gql";
import useNotify from "@/use/notify";
import { format } from "date-fns";
import { onClickOutside } from "@vueuse/core";

/**-------------------------Globals------------------------- */
const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
});

const { notify } = useNotify();
const emit = defineEmits(["onDelete", "onEdit"]);

/**------------------------Handle delete--------------------- */
const { mutate, onDone, onError, loading } = authMutation(deleteMenuMutation);

function handleDelete() {
  mutate({
    id: props.menu.id,
  });
}
onDone((result) => {
  showRemoveFromMenuModal.value = false;
  emit("onDelete");
  notify({
    title: "Menu deleted",
    description: "Menu  deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
});

onError((error) => {
  showRemoveFromMenuModal.value = false;
  notify({
    title: "Error",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});
/**--------------------------Click outside------------------- */
const menuActionsContainer = ref(null);
onClickOutside(menuActionsContainer, (e) => (showMoreAction.value = false));

const showMoreAction = ref(false);

function openMoreAction(event) {
  event.stopPropagation();
  showMoreAction.value = !showMoreAction.value;
}

/**--------------------------Modals------------------- */
const showUpdateMenuModal = ref(false);
function openUpdateMenuModal(event) {
  event.stopPropagation();
  showMoreAction.value = false;
  showUpdateMenuModal.value = !showUpdateMenuModal.value;
}

const showRemoveFromMenuModal = ref(false);
function openRemoveMenuModal(event) {
  event.stopPropagation();
  showMoreAction.value = false;
  showRemoveFromMenuModal.value = !showRemoveFromMenuModal.value;
}

const showMarkUsUpdatedModal = ref(false);
function openMarkUsUpdatedModal(event) {
  event.stopPropagation();
  showMoreAction.value = false;

  showMarkUsUpdatedModal.value = !showMarkUsUpdatedModal.value;
}
</script>

<template>
  <!-- -------------------Edit Menu--------------------- -->
  <Modals-Modal :autoClose="true" v-model="showUpdateMenuModal">
    <template #header>
      <div class="flex items-center justify-between pb-4 px-10">
        <h3 class="text-lg font-medium text-gray-900">Update Menu Item</h3>
        <button>
          <Icon
            name="system-uicons:close"
            class="text-4xl"
            @click="showUpdateMenuModal = false"
          />
        </button>
      </div>
    </template>
    <template #content>
      <MenusEdit :menu-id="menu.id" @on-edit="emit('onEdit')"></MenusEdit>
    </template>
  </Modals-Modal>
  <!-- -----------------------Remove from menu ---------------- -->
  <ModalsConfirmation
    v-model="showRemoveFromMenuModal"
    title="Remove Menu"
    @confirm="handleDelete"
    sure-question="Are you sure you want to remove the menu ?"
    description="This action is irreversible and will permanently remove the menu and its related data."
  ></ModalsConfirmation>

  <!-- -----------------------Remove from menu ---------------- -->
  <ModalsConfirmation
    v-model="showMarkUsUpdatedModal"
    title="Mark Us Updated"
    sure-question="Are you sure you want to make this menu as Updated ?"
  ></ModalsConfirmation>
  <div class="w-full 2xl:max-w-4xl">
    <div
      class="grid grid-cols-8 gap-4 lg:gap-8 secondary-border rounded-lg w-full relative"
    >
      <div
        class="col-span-3 lg:col-span-3 bg-[image:var(--image-url)] bg-no-repeat bg-center bg-cover rounded-l-lg"
        :style="{ '--image-url': `url(${menu.media.url})` }"
      ></div>
      <div
        class="col-span-5 lg:col-span-5 flex flex-col space-y-2 lg:space-y-4 py-4 pr-2 lg:pr-6"
      >
        <div class="flex justify-between w-full">
          <p class="secondary-text iphone5:text-lg">ETB {{ menu.price }}</p>

          <div class="relative">
            <button @click="openMoreAction" class="hover:cursor-pointer">
              <Icon name="iwwa:option" class="w-8 h-8" />
            </button>

            <!-- -----------------------Extend date and Remove from feature --------------- -->
            <div
              ref="menuActionsContainer"
              v-if="showMoreAction"
              class="absolute top-7 right-0 w-72 flex flex-col gap-y-4 shadow-xl bg-white rounded-lg p-5"
            >
              <!-- ----------------Pend Place---------- -->
              <button
                @click="openUpdateMenuModal"
                class="flex gap-3 items-center"
              >
                <Icon name="uil:edit-alt" class="text-2xl shrink-0" />
                <p class="text-lg">Update Menu Info</p>
              </button>

              <!-- ----------------Mark Us Updated---------- -->
              <button
                @click="openMarkUsUpdatedModal"
                class="flex gap-3 items-center"
              >
                <Icon name="uil:check-circle" class="text-2xl shrink-0" />
                <p class="text-lg whitespace-nowrap">Mark Us Updated</p>
              </button>
              <!-- ----------------Remove menu Item---------- -->
              <button
                @click="openRemoveMenuModal"
                class="flex gap-3 items-center text-primary-600"
              >
                <Icon name="uil:trash-alt" class="text-2xl shrink-0" />
                <p class="text-lg whitespace-nowrap">Remove from Menu Item</p>
              </button>
            </div>
          </div>
        </div>
        <p class="lg:text-2xl dark:text-white">
          {{ menu.title }}
        </p>

        <div
          v-if="menu.menuTags.length > 0"
          class="flex flex-wrap secondary-text text-lg font-medium pb-4"
        >
          <p
            v-for="menuTag in menu.menuTags"
            :key="menuTag.tag.id"
            class="pr-2"
          >
            #{{ menuTag.tag.title }}
          </p>
        </div>

        <div class="flex space-x-4 items-start">
          <Icon
            name="uil:stopwatch"
            class="text-black text-xl lg:text-3xl dark:text-white"
          />
          <div>
            <p class="primary-text lg:text-base">Preparation Time</p>
            <p class="primary-text lg:text-base">
              {{}} {{ menu.timeToPrepare }} Minutes
            </p>
          </div>
        </div>

        <p
          class="hidden text-sheger_brown-200 dark:text-sheger_light_gray-400 lg:block"
        >
          {{ menu.ingridients }}
        </p>

        <div class="flex items-center space-x-4">
          <Icon
            name="uis:calender"
            class="text-sheger_dark_gray-100 dark:text-white"
          />
          <p
            class="whitespace-nowrap text-sm text-sheger_dark_gray-100 dark:text-white"
          >
            Updated:
            {{ format(new Date(), "dd MMM, yyyy") }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
