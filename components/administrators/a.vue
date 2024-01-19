

<!-- <script setup>
const router = useRouter();
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
const search = ref("");
const items = ref([]);
const sort = ref([{ name: "desc" }]);
const offset = ref(0);
const limit = ref(20);
const length = ref(100);
const showAddAdministratorModal = ref(false);
const revoke = ref(false)
const reactivate = ref(false)

const headers = [
  {
    text: "Name",
    value: "name",
  },
  {
    text: "Email",
    value: "email",
  },

  {
    text: "Role",
    value: "role",
  },
  {
    text: "Status",
    value: "status",
  },

  {
    text: "Action",
    value: "action",
  },
];

items.value = [
  {
    id: 1,
    name: "Selamu dawit",
    email: "selamudev@gmail.com",
    status: "active",
    role: "Data encoder",

    created_at: "2022 Jan 22",
  },
  {
    id: 2,
    name: "Yontan tesfaye",
    email: "selamudev@gmail.com",
    status: "revoked",
    role: "Administrator",
    created_at: "2022 Jan 22",
  },
  {
    id: 3,
    name: "Selamu dawit",
    email: "selamudev@gmail.com",
    status: "revoked",
    role: "Administrator",
    created_at: "2022 Jan 22",
  },
  {
    id: 4,
    name: "Samuel Noah",
    email: "selamudev@gmail.com",
    status: "active",
    role: "Data encoder",
    created_at: "2022 Jan 22",
  },
];

const {
  mutate: reactivatee,
  onError: reactivateonError,
  onDone: reactivateDone
} = mutator(reactivateMutate, '')
reactivateDone((result) => {
  notify({
    title: 'Successfully Reactivate',
    description:
      result.data.updatePlaceUsers.returning[0].user.fullName +
      ' Can Login Again',

    borderClass: 'border-l-8 border-green-800',
    cardClass: 'bg-green-300 text-white text-white'
  })
  refetch()
  reactivate.value = false
})
onError((error) => {
  notify({
    title: 'Some thing went wrong',
    description: error.message,
    type: 'error',
    cardClass: 'bg-red-200'
  })
})
const ReactivateFunction = () => {
  reactivatee({
    _eq: email.value
  })
}
const Revoke = () => {
  revokee({
    _eq: email.value
  })
}

const toggleRevoke = (data) => {
  console.log('revoke email', email.value)
  email.value = data
  revoke.value = true 
}
const toggleReactivate = (data) => {
  email.value = data
  console.log('reactivate email', email.value)
  reactivate.value = true 
}
const loading = ref(false);
loading.value = false;
const clickRow = (item) => {

};

</script>
<template>
  <Modals-Modals :autoClose="true" :modelValue="showAddAdministratorModal">
    <template #header>
      <div class="flex items-center justify-between pb-4">
        <h3 class="text-lg font-medium text-gray-900">Invite Administrator</h3>
        <button>
          <Icon
            name="system-uicons:close"
            class="text-4xl"
            @click="showAddAdministratorModal = false"
          />
        </button>
      </div>
    </template>
    <template #content>
      <Administrators-Add />
    </template>
  </Modals-Modals>
  <div class="w-full pl-10 pr-16 py-6">
    <div class="flex items-center justify-between">
      <p class="text-2xl text-sheger-gray-600 font-medium">4 Administrators</p>
      <button
        @click="showAddAdministratorModal = true"
        class="primary-button block bg-primary-600"
      >
        <Icon
          name="mingcute:user-add-line"
          class="text-xl text-white"
          color=""
        />
        <span class="text-white">Add Administrator</span>
      </button>
    </div>

    <div class="flex flex-col space-y-8 py-6">
      <div class="">
        <h-table
          :headers="headers"
          :items="items"
          v-model:sort="sort"
          :loading="loading"
          @click:row="clickRow"
          supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
          supportHeaderClass="bg-gray-100 border"
          tableHeaderStyle=" bg-gray-200  "
          tableBodyRowStyle="border py-6"
          rowHeadStyle="py-6"
        >
          <template v-slot:name="{ item }">
            <div class="secondary-flex-row">
              <div>
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="user image"
                  class="w-10 h-10 rounded-full"
                />
              </div>
              <div>
                <p>{{ item.name }}</p>
              </div>
            </div>
          </template>

          <template v-slot:status="{ item }">
            <p
              v-if="item.status === 'active'"
              class="text-green-600 font-medium"
            >
              Active
            </p>
            <p
              v-if="item.status === 'revoked'"
              class="text-red-600 font-medium"
            >
              Revoked
            </p>
          </template>

          <template v-slot:action="{ item }">
            <Menu as="div" class="relative">
              <MenuButton class="-m-4 flex items-center p-1.5">
                <span class="sr-only">Open user menu</span>

                <div
                  class="align-center flex items-center lg:pl-3 lg:pr-5 py-1 md:px-1 sm:px-1 px-1 rounded-3xl"
                >
                  <Icon
                    name="charm:menu-kebab"
                    color="black"
                    width="20"
                    height="20"
                  ></Icon>
                </div>
              </MenuButton>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="absolute right-0 z-50 mt-2.5 w-44 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                >
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="toggleReactivate(person.userId)"
                      :class="[
                        active ? 'bg-primary-50 text-black' : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-1 py-2 text-sm',
                      ]"
                    >
                      <Icon
                        name="bx:lock-open-alt"
                        color="black"
                        width="20"
                        height="20"
                      ></Icon>

                      <h1 class="ml-3">Reactivate access</h1>
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="toggleRevoke(person.userId)"
                      :class="[
                        active
                          ? 'bg-primary-50 text-black-100'
                          : 'text-gray-900',
                        'group flex w-full items-center rounded-md px-1 py-2 text-sm',
                      ]"
                    >
                      <Icon
                        name="uil:lock"
                        color="red"
                        width="20"
                        height="20"
                      ></Icon>

                      <h1 class="ml-3">Revoke access</h1>
                    </button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </template>
          <template v-slot:created_at="{ item }">
            <p class="tertiary-text">
              {{ item.created_at }}
            </p>
          </template>
        </h-table>
      </div>
    </div>
  </div>
  <Modals-Modals
    :modelValue="revoke"
    v-slot:ModalContent
    v-bind:wrapper-class="'relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[30vw] sm:p-0'"
  >
    <div class="flex justify-between p-7">
      <div class="flex gap-1">
        <Icon
          name="uil:lock"
          color="red"
          width="20"
          height="20"
          class="self-center"
        ></Icon>
        <h1 class="text-lg font-poppins text-primary-100 font-bold capitalize">
          revoke access
        </h1>
      </div>
      <button @click="revoke = false">
        <Icon
          name="ph:x"
          color="black"
          width="20"
          height="20"
          class="self-center"
        ></Icon>
      </button>
    </div>
    <div class="flex-col justify-center px-7">
      <h1 class="text-sm font-normal font-poppins text-center pb-4">
        Are you sure you want to revoke access?
      </h1>
      <p class="text-sm font-poppins font-light text-gray-500 text-center">
        Revoking access to the user will result on the user unable to
        login,update menu and change the place profile
      </p>
    </div>
    <div class="flex justify-between px-10 pb-3">
      <button
        @click="revoke = false"
        for="comment"
        class="block text-md font-normal font-poppins text-white capitalize mt-2 bg-red-500 rounded-lg px-10 py-1"
      >
        Cancel
      </button>

      <button
        @click="Revoke"
        for="comment"
        class="text-md font-normal font-poppins text-gray-700 capitalize mt-2 border-[1px] border-gray-400 rounded-lg px-10 py-1"
      >
        Revoke
      </button>
    </div>
  </Modals-Modals>
  <Modals-Modals
    :modelValue="reactivate"
    v-slot:ModalContent
    v-bind:wrapper-class="'relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[30vw] sm:p-0'"
  >
    <div class="flex justify-between p-7">
      <div class="flex gap-1">
        <Icon
          name="bx:lock-open-alt"
          color="red"
          width="20"
          height="20"
          class="self-center"
        ></Icon>
        <h1 class="text-lg font-poppins text-primary-100 font-bold capitalize">
          reactivate access
        </h1>
      </div>
      <button @click="reactivate = false">
        <Icon
          name="ph:x"
          color="black"
          width="20"
          height="20"
          class="self-center"
        ></Icon>
      </button>
    </div>
    <div class="flex-col justify-center px-7">
      <h1 class="text-sm font-normal font-poppins text-center pb-4">
        Are you sure you want to reactivate access?
      </h1>
      <p class="text-sm font-poppins font-light text-gray-500 text-center">
        Revoking access to the user will result on the user unable to
        login,update menu and change the place profile
      </p>
    </div>
    <div class="flex justify-between px-5 pb-3">
      <button
        @click="reactivate = false"
        for="comment"
        class="block text-md font-normal font-poppins text-white capitalize mt-2 bg-red-500 rounded-lg px-10 py-1"
      >
        Cancel
      </button>

      <button
        @click="ReactivateFunction"
        for="comment"
        class="text-md font-normal font-poppins text-gray-700 capitalize mt-2 border-[1px] border-gray-400 rounded-lg px-10 py-1"
      >
        Reactivate
      </button>
    </div>
  </Modals-Modals>

</template> -->
