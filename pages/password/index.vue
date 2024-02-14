<script setup>
import loginMutation from "@/graphql/mutations/admin/reset.gql";
import { useAuthStore } from "@/stores/auth.js";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";
import anonymousMutation from "@/composables/anonymous-mutation";

const emit = defineEmits(["close"]);
const { handleSubmit, isSubmitting } = useForm({});
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const { notify } = useNotify();
const email = ref("");
const password = ref("");
const ConfirmPassword = ref("");
const passwordError = ref("");

console.log("token", authStore.place_hasura_access_token);

/**                  Parse jwt token------------------------------------ */

/**---------------------Email login---------------------- */
const {
  mutate: emailLogin,
  onDone: emailLoginDone,
  onError,
  loading: emailLoginLoading,
} = anonymousMutation(loginMutation);
emailLoginDone((result) => {
  router.push("/");
  notify({
    title: "Nicely done we will redirect you to login page",
    description: result.data?.message,
    type: "success",
    cardClass: "bg-green-300 text-white",
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

/* ----------------------Create custom token for thirdy part authentication and
  Verify
*/

// Login Handler

const handleLogin = handleSubmit(() => {
  // console.log("clicked");

  if (password.value !== ConfirmPassword.value) {
    passwordError.value = "Passwords do not match";
  } else {
    passwordError.value = "";

    emailLogin({
      confirm_password: ConfirmPassword.value,
      password: password.value,
      token: route.query.token,
    });
  }
});
</script>
<template>
  <div class="w-full h-full xl:h-screen flex bg-primary-600 justify-center">
    <div class="w-1/4 bg-primary-600 h-full flex-col">
      <div
        class="flex items-center justify-center lg:pt-[150px] xl:pt-[300px] pb-4"
      >
        <img
          class="w-[200px] h-[200px]"
          src="/public/images/static/admin_login.png"
          alt="logo"
        />
      </div>
      <h1
        class="text-white text-center text-3xl capitalize pb-2 w-[90%] mx-auto capitalize"
      >
        place admin reset password page
      </h1>
    </div>
    <div
      class="w-3/4 bg-primary-50 h-full flex flex-col items-center justify-center p-5"
    >
      <div
        class="flex flex-col justify-center w-[450px] mx-auto border-[] rounded-lg border-gray-200 p-5"
      >
        <div class="flex mx-auto self-center my-3 gap-5">
          <div class="justify-center">
            <img
              class="w-[60px] h-[60px]"
              src="/public/images/static/logo.png"
              alt="logo"
            />
          </div>
          <div
            class="text-primary-600 font-poppins text-lg font-bold flex-col capitalize my-auto self-center'"
          >
            <h1>SHEGER</h1>
            <h1>GEBETA</h1>
          </div>
        </div>
        <p class="text-gray-700 text-center text-md capitalize pb-2">
          Please enter your New password to use it for logging to your Sheger
          Gebeta account. If you face during Reset, please contact our customer
          support agents.
        </p>
        <form action="" @submit.prevent="handleLogin">
          <HTextfield
            type="password"
            :name="'password'"
            v-model="password"
            :trailingIcon="'mingcute:lock-line'"
            class="py-3.5 px-2 mb-1"
            rules="required"
          >
            <template v-slot:label>
              <div class="text-sm font-medium leading-[35px]">password</div>
            </template>
          </HTextfield>

          <HTextfield
            type="password"
            :name="'confirm'"
            v-model="ConfirmPassword"
            :trailingIcon="'mingcute:lock-line'"
            class="py-3.5 px-2 mb-4"
            rules="required"
          >
            <template v-slot:label>
              <div class="text-sm font-medium leading-[35px]">
                Confirm password
              </div>
            </template>
          </HTextfield>

          <span v-if="passwordError" class="error-message text-red-600 mx-2">{{
            passwordError
          }}</span>
          <div class="p-2">

            <button
            type="submit"
            for="comment"
            class="text-white bg-primary-600 w-full  rounded-md py-2 text-lg capitalize font-medium leading-[35px] mb-4 font-body text-secondary  :text-white"
          >
            Reset password
            <Icon v-if="emailLoginLoading" name="eos-icons:bubble-loading" class="text-2xl text-white" />

          </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
