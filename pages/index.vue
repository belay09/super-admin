<script setup>
import mobileLoginMutation from "@/graphql/mutations/auth/mobile-login.gql";
import loginMutation from "@/graphql/mutations/auth/login.gql";
import createCustomToken from "@/graphql/mutations/auth/create-custom-token.gql";
import { useAuthStore } from "@/stores/auth.js";
import { useForm } from "vee-validate";
import useNotify from "@/use/notify";

const xHasuraRole = useCookie("x-hasura-role");
const emailOrPhone = ref("");
const password = ref("");
const { notify } = useNotify();
const authStore = useAuthStore();
const { onLogin, getToken } = useApollo();
const router = useRouter();
const route = useRoute();

// ------------------------Mutations--------------------

/**-------------------Phone number login--------------------------- */
const {
	mutate: mobileLogin,
	onDone: mobileLoginDone,
	onError: mobileLoginError,
	loading: mobileLoginLoading,
} = anonymousMutation(mobileLoginMutation);

// onDone

mobileLoginDone((result) => {
	// Set user on state
	authStore.setUser(result.data?.mobile_login?.user);

	// Set access token on cookie
	onLogin(result.data?.mobile_login?.access_token, "Authorizer");

	//Execute createTokenMutation
	createTokenMutation({
		idToken: result.data?.mobile_login?.id_token,
	});
});

// On Error

mobileLoginError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

/**-------------------Email login--------------------------- */
const {
	mutate: emailLogin,
	onDone: emailLoginDone,
	onError: emailLoginError,
	loading: emailLoginLoading,
} = anonymousMutation(loginMutation);

emailLoginDone((result) => {
	authStore.setUser(result.data?.login?.user);
	createTokenMutation({
		idToken: result.data?.login?.id_token,
	});
});
emailLoginError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

/**-------------------Create Custome Token Mutation------------------------- */

const {
	mutate: createTokenMutation,
	onDone: createTokenDone,
	loading: createTokenLoading,
	onError: createTokenOnError,
} = anonymousMutation(createCustomToken);

// On Done
createTokenDone((result) => {
	// Set hasura access token on state

	authStore.sethasuraAccessToken(
		result.data?.create_custom_token?.hasura_access_token
	);

	// parse hasura access token and get user info
	const userData = parseJwtToken(
		result.data?.create_custom_token?.hasura_access_token
	);
	if (userData.metadata["x-hasura-allowed-roles"].includes("shegeradmin")) {
		xHasuraRole.value = "shegeradmin";
		authStore.setXHasuraRole("shegeradmin");
	}
	if (userData.metadata["x-hasura-allowed-roles"].includes("encoder")) {
		xHasuraRole.value = "encoder";
		authStore.setXHasuraRole("encoder");
	}
	// set user info on state
	authStore.setUserId(userData.metadata["x-hasura-user-id"]);

	onLogin(result.data?.create_custom_token?.hasura_access_token, "authClient");

	if (!!getToken("authClient")) {
		router.replace("/app");
	}
});

// On Error
createTokenOnError((error) => {
	notify({
		title: "Some thing went wrong",
		description: error.message,
		type: "error",
		borderClass: "border-l-8 border-red-300",
	});
});

/**  -----------------------handlers------------------------- */

// Login
const handleLogin = () => {
	if (validateInput(emailOrPhone.value) === "phone") {
		let input = {
			phone_number: emailOrPhone.value,
			password: password.value,
		};
		mobileLogin({
			input,
		});
	} else {
		let input = {
			email: emailOrPhone.value,
			password: password.value,
		};
		emailLogin({
			input,
		});
	}
};
</script>
<template>
	<div class="flex h-screen">
		<!----------------------------------Left Side Image ---------------------------->
		<div
			class="flex-[30%] bg-primary-600 flex flex-col items-center justify-center px-10"
		>
			<img src="/images/static/admin_login.png" alt="image" />
			<p class="text-4xl text-white capitalize">Sheger gebeta Administrator</p>
		</div>

		<!-----------------------------------Right side ------------------------------->
		<div class="flex-[70%] flex flex-col items-center justify-center gap-6">
			<div class="flex flex-col items-center justify-center gap-5">
				<!---------------------Logo----------------------------->
				<img src="/images/static/sheger-admin-logo.png" alt="image" />
				<p class="w-[50%] text-center text-sheger-gray-100 font-light">
					Please enter your credential to login to your Sheger Gebeta account.
					If you face during logging in, please contact our customer support
					agents.
				</p>
			</div>
			<div>
				<!---------------------Form----------------------------->
				<form class="flex flex-col gap-5 w-[25rem]">
					<!--------------------Email or phone number----------------------------->
					<div>
						<HTextfield
							placeholder="Email or PhoneNumber"
							name="Email or PhoneNumber"
							v-model="emailOrPhone"
							rules="required|email_phone"
							type="text"
						>
							<template #label>
								<div class="">
									<span
										class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
										>Email Or Phone Number</span
									>
								</div>
							</template>
						</HTextfield>
					</div>

					<!-----------------------------Password-------------------------------->

					<div>
						<HTextfield
							placeholder="Password"
							name="Password"
							v-model="password"
							rules="required|password"
							trailing-icon="heroicons:eye"
							type="password"
						>
							<template #label>
								<div class="">
									<span
										class="text-sheger_brown-200 dark:text-sheger_light_gray-400"
										>Password</span
									>
								</div>
							</template>
						</HTextfield>
					</div>

					<div
						class="px-6 py-3 font-bold text-center text-white rounded-md bg-primary-600 disabled:opacity-50 hover:cursor-pointer"
						type="submit"
						@click.prevent="handleLogin"
					>
						<Icon
							v-if="mobileLoginLoading || emailLoginLoading"
							name="eos-icons:bubble-loading"
							class="text-2xl text-white"
						/>
						Login
					</div>
				</form>
			</div>
		</div>
	</div>
</template>
