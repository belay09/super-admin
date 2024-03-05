<script setup>
import list from "@/composables/auth-list-query.js";

import useNotify from "@/use/notify";
import { useAuthStore } from "@/stores/auth.js";
import update from "@/graphql/mutations/admin/update.gql";
import Authorizer from "@/composables/Authorizer.js";
const authStore = useAuthStore();
const { notify } = useNotify();
const { handleSubmit } = useForm({});
const passwordError = ref("");
const count = ref(0);


const currentPassword=ref()
const password=ref("")
const confirmPassword=ref("")

const modalPhone = ref(false);
const people = ref({});

// const { onResult: adminDone, onError: adminERR } = list(admin, "authClient");

// adminDone((result) => {
//   // selectTags.value=result.data.basicsTags;
//   people.value = result.data.placeUsers;
//   count.value = result.data.placeUsersAggregate.aggregate.count;
//   console.log("admin", people.value);
// });

const modal = ref(false);
const load = ref(false);

const {
  mutate: updateProfile,
  onDone: updateProfileDone,
  onError: updateProfileError,
  loading: updateProfileLoading,
} = Authorizer(update);
updateProfileDone((result) => {
  notify({
    title: "You Successfully Update Your Password ",
    description: result.data?.message,
    type: "success",
  });
  modal.value = false;
  modalPhone.value = false;
});
updateProfileError((error) => {
  notify({
    title: "Some thing went wrong",
    description: error.message,
    type: "error",
  });
});

const passwordChange = handleSubmit(() => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = "Passwords do not match";
  } else {
    passwordError.value = "";
    let params = {
      old_password: currentPassword.value,
      new_password: password.value,
      confirm_new_password: confirmPassword.value,
    };
    updateProfile({
      params,
    });
  }
});
</script>
<template>
  <div>
  <form action="" @submit.prevent="passwordChange">
    <div
      class="w-[80%] h-full flex bg-white-100 justify-center pl-2 rounded-md border-[1px]"
    >
      <div
        class="w-[30%] flex-col bg-white-100 justify-between items-center p-5 mt-2"
      >
        <h1 class="text-lg font-poppins font-medium capitalize pt-0">
          update password
        </h1>
        <h1
          class="text-xs font-poppins font-normal capitalize text-gray-600 pt-0"
        >
          update your password
        </h1>
      </div>
      <div class="flex-col w-full justify-between p-6">
        <div class="flex-col w-[50%]">
          <HTextfield
            type="password"
            :name="'oldPassword'"
            v-model="currentPassword"
            :trailingIcon="'mdi:eye-outline'"
            iconLeadingClass="pl-10"
            rules="required"
          >
            <template v-slot:label>
              <div
                class="text-sm mb-2 font-medium leading-[35px] text-secondary"
              >
                Current Password
              </div>
            </template>
            <template v-slot:leading>
              <div class="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon
                  name="teenyicons:key-solid"
                  color="black"
                  class="w-5 h-5"
                />
              </div>
            </template>
          </HTextfield>
        </div>
        <div class="flex-col w-[50%]">
          <HTextfield
            type="password"
            :name="'password'"
            v-model="password"
            :trailingIcon="'mdi:eye-outline'"
            iconLeadingClass="pl-10"
            class=""
            rules="required"
            placeholder=""
          >
            <template v-slot:label>
              <div
                class="text-sm mb-2 mt-2 font-medium leading-[35px] text-secondary"
              >
                New Password
              </div>
            </template>
            <template v-slot:leading>
              <div class="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon
                  name="teenyicons:key-solid"
                  color="black"
                  class="w-5 h-5"
                />
              </div>
            </template>
          </HTextfield>
        </div>
        <div class="flex-col w-[50%]">
          <HTextfield
          rules="required"
            type="password"
            :name="'ConfirmPassword'"
            v-model="confirmPassword"
            :trailingIcon="'mdi:eye-outline'"
            iconLeadingClass="pl-10"

          >
            <template v-slot:label>
              <div
                class="text-sm mb-2 mt-2 font-medium leading-[35px] text-secondary"
              >
                Confirm Password
              </div>
            </template>
            <template v-slot:leading>
              <div class="absolute left-3 top-1/2 -translate-y-1/2">
                <Icon
                  name="teenyicons:key-solid"
                  color="black"
                  class="w-5 h-5"
                />
              </div>
            </template>
          </HTextfield>
        </div>
        <span v-if="passwordError" class="error-message text-red-600 my-2">{{
          passwordError
        }}</span>

        <div class="flex-col w-[50%] justify-center items-center mt-2">
          <HButton
            type="submit"
            :inputClass="'text-white bg-primary-500 w-full  rounded-md py-2 text-lg capitalize font-medium leading-[35px] mb-4 font-body text-secondary  :text-white'"
            name="passwordChange"
          >
          </HButton>
        </div>
      </div>
    </div>
  </form>
  </div>
</template>
