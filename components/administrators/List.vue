<script setup>
definePageMeta({
  layout: "base",
});
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import admin from "@/graphql/query/admin/query.gql";
import list from "@/composables/auth-list-query.js";
import { format, parseISO } from "date-fns";
import mutator from "@/composables/auth-mutation";
import invited from "@/graphql/mutations/admin/invite.gql";
import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth.js";
import revokeMutate from "@/graphql/mutations/admin/revoke.gql";
import reactivateMutate from "@/graphql/mutations/admin/reactivate.gql";
const authStore = useAuthStore();
const { notify } = useNotify();
const { handleSubmit } = useForm({});

const formattedCreatedAt = ref("");
const count = ref(0);
const revoke = ref(false);
const reactivate = ref(false);
const add = ref(false);
const item = ref({});
const email = ref("");
const selectedItemId = ref(null);
const base64File = ref(null);
const selectItems = [
  { id: 1, name: "Administrator" },
  { id: 2, name: "Data Encoder" },
  // Add more items as needed
];
const loading = ref(true);
const people = ref({});
const router = useRouter();
// if (!authStore.place_hasura_access_token) {
//   router.push('/')
// }
const {
  onResult: adminDone,
  onError: adminERR,
  refetch,
} = list(admin, "authClient");

adminDone((result) => {
  // selectTags.value=result.data.basicsTags;
  people.value = result.data.usersUsers;
  count.value = result.data.usersUsersAggregate.aggregate.count;
  console.log("admin", people.value);
  loading.value = false;
});

const toggleAdd = () => {
  add.value = !add.value; // Toggle the boolean value
};
const toggleRevoke = (data) => {
  console.log("revoke email", email.value);
  email.value = data;
  revoke.value = true; // Toggle the boolean value
};
const toggleReactivate = (data) => {
  email.value = data;
  console.log("ractivate email", email.value);
  reactivate.value = true; // Toggle the boolean value
};
const {
  mutate: invite,
  onError: onError,
  onDone: inviteDone,
} = mutator(invited, "");
inviteDone((result) => {
  notify({
    title: "Invite Successfully Sent",
    borderClass: "border-l-8 border-green-800",
    cardClass: "bg-green-300 text-white text-white",
  });
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    cardClass: "bg-red-200",
  });
});

function updateName(selectedItemId) {
  const selectedItem = selectItems.find((item) => item.id === selectedItemId);

  if (selectedItem) {
    if (selectedItem.name === "Administrator") {
      return "PLACE_OWNER";
    } else if (selectedItem.name === "Data Encoder") {
      return "PLACE_DATA_ENCODER";
    }
  }
  return null; // Return null if the item is not found or doesn't match any condition
}
const finish = handleSubmit(() => {
  const updatedRoleName = updateName(selectedItemId.value);
  if (updatedRoleName) {
    // Use the updated role name in the invite function
    invite({
      GivenName: item.value.name,
      MiddleName: item.value.lastname,
      family_name: item.value.family,
      email: item.value.email,
      phone_number: "+251" + item.value.phone,
      role: updatedRoleName,
      place_id: people.value[0].placeId,
    });

    // Log the updated array for verification
    console.log(selectItems);
  } else {
    console.error("Invalid selectedItemId:", selectedItemId);
  }
});
const {
  mutate: revokee,
  onError: revokeonError,
  onDone: revokeDone,
} = mutator(revokeMutate, "");
revokeDone((result) => {
  notify({
    title: "Successfully revoked",
    description:
      result.data.updatePlaceUsers.returning[0].user.fullName +
      " Can not Login Again",
    borderClass: "border-l-8 border-green-800",
    cardClass: "bg-green-300 text-white text-white",
  });
  refetch();
  revoke.value = false;
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    cardClass: "bg-red-200",
  });
});
const Revoke = () => {
  revokee({
    _eq: email.value,
  });
};

const {
  mutate: reactivatee,
  onError: reactivateonError,
  onDone: reactivateDone,
} = mutator(reactivateMutate, "");
reactivateDone((result) => {
  notify({
    title: "Successfully Reactivate",
    description:
      result.data.updatePlaceUsers.returning[0].user.fullName +
      " Can Login Again",

    borderClass: "border-l-8 border-green-800",
    cardClass: "bg-green-300 text-white text-white",
  });
  refetch();
  reactivate.value = false;
});
onError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
    cardClass: "bg-red-200",
  });
});
const ReactivateFunction = () => {
  reactivatee({
    _eq: email.value,
  });
};
// Function to determine user status based on priority
const determineUserStatus = (userRoles) => {
  if (userRoles.some((role) => role.userRole.value === "SHEGERADMIN")) {
    return "Sheger Admin";
  } else if (userRoles.some((role) => role.userRole.value === "encoder")) {
    return "Encoder";
  } else {
    return "User";
  }
};
</script>
<template>
  <div v-if="loading" class="w-full rounded">
    <!-- Placeholder for current plan details -->
    <div class="flex w-[90%] justify-between animate-pulse">
      <div class="h-8 w-1/3 mb-2 bg-gray-300 rounded"></div>
      <div class="flex items-center">
        <div class="skeleton-placeholder h-10 w-48 mr-2 rounded"></div>
      </div>
    </div>

    <!-- Placeholder for administrators table -->
    <div class="mt-8 flow-root animate-pulse">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-200">
              <tr>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  #
                </th>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Full Name
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Email
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Role
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Created at
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <!-- Placeholder for table rows -->
              <tr v-for="person in 8" :key="person.email">
                <td class="whitespace-nowrap py-5 pr-3 text-sm sm:pl-0">
                  <div class="skeleton-placeholder h-7 w-7 flex-shrink-0"></div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="skeleton-placeholder h-7 w-2/3"></div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="skeleton-placeholder h-7 w-2/3"></div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm">
                  <div class="skeleton-placeholder h-7 w-2/3"></div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="skeleton-placeholder h-7 w-2/3"></div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="skeleton-placeholder h-7 w-2/3"></div>
                </td>
                <td
                  class="relative whitespace-nowrap py-5 pl-6 pr-4 text-right text-sm font-medium sm:pr-0"
                >
                  <!-- Placeholder for menu button -->
                  <div class="skeleton-placeholder h-7 w-7 flex-shrink-0"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!loading" class="w-[90%] h-full">
    <div class="flex justify-between">
      <h1 class="text-2xl capitalize font-inter">{{ count }} Administrators</h1>
      <div class="flex items-center">
        <button
          @click="toggleAdd"
          class="bg-primary-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          <Icon
            name="uiw:user-add"
            color="white"
            width="20"
            height="20"
            class="self-center mr-2 font-inter"
          ></Icon>
          Add Administrator
        </button>
      </div>
    </div>
    <div class="">
      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8"
          >
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-200">
                <tr>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    #
                  </th>

                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Full Name
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    email
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Created at
                  </th>
                  <th
                    scope="col"
                    class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="person in people" :key="person.email">
                  <td class="whitespace-nowrap py-5 pr-3 text-sm sm:pl-0">
                    <div class="h-7 w-7 flex-shrink-0">
                      <img
                        v-if="person.image"
                        class="h-7 w-7 rounded-full ml-2"
                        :src="person.image"
                        alt=""
                      />
                      <img
                        v-else
                        class="h-7 w-7 rounded-full ml-2"
                        src="data:image/png;base64,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"
                        alt=""
                      />
                    </div>
                  </td>
                  <td
                    class="whitesfullNamepace-nowrap px-3 py-5 text-sm text-gray-500"
                  >
                    <div class="text-gray-900">{{ person.fullName }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="text-gray-900">{{ person.email }}</div>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm">
                    <span :style="{ color: person.status ? 'green' : 'red' }">
                      {{ person.status ? "Active" : "Revoked" }}
                    </span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {{ determineUserStatus(person.userRoles) }}
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {{ format(parseISO(person.createdAt), "dd/MM/yyyy") }}
                  </td>
                  <td
                    class="relative whitespace-nowrap py-5 pl-6 pr-4 text-right text-sm font-medium sm:pr-0"
                  >
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
                          class="absolute right-0 z-10 mt-2.5 w-44 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                        >
                          <MenuItem v-slot="{ active }">
                            <button
                              @click="toggleReactivate(person.id)"
                              :class="[
                                active
                                  ? 'bg-primary-100 text-black'
                                  : 'text-gray-900',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
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
                              @click="toggleRevoke(person.id)"
                              :class="[
                                active
                                  ? 'bg-primary-50 text-black'
                                  : 'text-gray-900',
                                'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                              ]"
                            >
                              <Icon
                                name="uil:lock"
                                color="black"
                                width="20"
                                height="20"
                              ></Icon>

                              <h1 class="ml-3">Revoke access</h1>
                            </button>
                          </MenuItem>
                        </MenuItems>
                      </transition>
                    </Menu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalsMod
    :modelValue="revoke"
    v-slot:ModalContent
    v-bind:wrapper-class="'relative transform  overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[25vw] sm:p-0'"
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
        <h1 class="text-lg font-poppins text-primary-600 font-bold capitalize">
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
      <h1 class="text-md font-normal font-poppins text-center pb-4">
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
  </ModalsMod>
  <ModalsMod
    :modelValue="reactivate"
    v-slot:ModalContent
    v-bind:wrapper-class="' rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg lg:max-w-[25vw] sm:p-0'"
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
        <h1 class="text-lg font-poppins text-primary-600 font-bold capitalize">
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
      <h1 class="text-md font-normal font-poppins text-center pb-4">
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
  </ModalsMod>

  <Modals-Modals
    :modelValue="add"
    v-slot:ModalContent
    v-bind:wrapper-class="'relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[35vw] sm:p-0'"
  >
    <form action="" @submit.prevent="finish">
      <div class="col-span-full mx-8 my-4">
        <div class="flex justify-between mb-3">
          <h1 class="text-xl font-poppins text-black capitalize font-inter">
            Invite Administrators
          </h1>
          <button type="button" @click="add = false">
            <Icon
              name="ph:x"
              color="black"
              width="20"
              height="20"
              class="self-center"
            ></Icon>
          </button>
        </div>

        <div class="col-span-full my-2">
          <HTextfield
            rules="required"
            name="first"
            v-model="item.name"
            :mainDiv="'my-2'"
          >
            <template #label>
              <h1
                class="text-base font-poppins font-normal text-[#524848] capitalize"
              >
                First name
              </h1>
            </template>
          </HTextfield>
        </div>
        <div class="col-span-full my-2">
          <HTextfield
            rules="required"
            name="middle"
            v-model="item.lastname"
            :mainDiv="'my-2'"
          >
            <template #label>
              <h1
                class="text-base font-poppins font-normal text-[#524848] capitalize"
              >
                Middle name
              </h1>
            </template>
          </HTextfield>
        </div>
        <div class="col-span-full my-2">
          <HTextfield
            rules="required"
            name="family"
            v-model="item.family"
            :mainDiv="'my-2'"
          >
            <template #label>
              <h1
                class="text-base font-poppins font-normal text-[#524848] capitalize"
              >
                last name
              </h1>
            </template>
          </HTextfield>
        </div>

        <div class="col-span-full my-2">
          <HTextfield
            rules="required|email"
            name="email"
            v-model="item.email"
            :mainDiv="'my-2'"
          >
            <template #label>
              <h1
                class="text-base font-poppins font-normal text-[#524848] capitalize"
              >
                Email Address
              </h1>
            </template>
          </HTextfield>
        </div>
        <div class="col-span-full my-2">
          <h1
            class="text-base font-poppins font-normal text-[#524848] contact phone number capitalize"
          >
            Phone
          </h1>
          <div>
            <div class="mt-2 flex rounded-md shadow-sm">
              <span
                class="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-gray-500 sm:text-sm"
                >+251</span
              >
              <input
                v-model="item.phone"
                type="number"
                name="company-website"
                id="company-website"
                class="block w-full flex-1 pl-2 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring--600 sm:text-sm sm:leading-6"
                placeholder=" 900000000"
              />
            </div>
          </div>
        </div>
        <div class="sm:col-span-3">
          <div class="mt-2">
            <HListselect
              v-model="selectedItemId"
              :items="selectItems"
              placeholder="Select an option"
              name="mySelect"
              :class="'w-full h-10 border-[1px] border-gray-300 rounded-md'"
              rules="required"
            >
              <template #label>
                <h1
                  class="text-base font-poppins font-normal text-[#524848] capitalize"
                >
                  role
                </h1>
              </template>
            </HListselect>
          </div>
        </div>
        <div class="flex my-4 justify-center">
          <button
            type="submit"
            for="comment"
            class="block text-md font-normal font-poppins text-white capitalize font mt-2 bg-primary-100 rounded-lg px-4 py-3"
          >
            Invite Administrator
          </button>
        </div>
      </div>
    </form>
  </Modals-Modals>
</template>

<style scoped>
.skeleton-placeholder {
  background-color: #e2e8f0; /* Light gray background color */
  border-radius: 0.25rem; /* Rounded corners */
}
</style>







