<script setup>
import addBillingAddressMutation from "@/graphql/mutations/billing/add-billing-address.gql";
import getBillingAddress from "@/graphql/mutations/billing/get-address.gql";

/**-----------------------Navigation----------------------------- */

const props = defineProps({
	placeId: {
		type: Number,
		required: true,
	},
});

import useNotify from "@/use/notify";

const { notify } = useNotify();
const router = useRouter();
const route = useRoute();

const emit = defineEmits(["next", "prev"]);
const next = () => {
	router.push(`/app/places/${props.placeId}`);
};
const prev = () => {
	emit("prev");
};

const paymentMethods = ref([
	{
		name: "bank",
		id: "BANK",
	},
	{
		name: "Cash",
		id: "CASH",
	},
	{
		name: "wallet",
		id: "WALLET",
	},
	{
		name: "Santim Pay",
		id: "SANTIM_PAY",
	},
]);

const cityId = ref();
const areaId = ref();
const tinNumberUrl = ref([]);
const businessLicenseUrl = ref([]);
const billingAddress = ref({});
const place = ref();

const coordinates = ref({});
const updateMapVal = (v) => {
	coordinates.value.lat = v.position.lat;
	coordinates.value.long = v.position.lng;
};

const filter = ref({
	placeId: {
		_eq: props.placeId,
	},
});
/**-----------------------Get Billing Address----------------------------- */
const { loading, onError, onResult, refetch } = authFetch(getBillingAddress, {
	filter: filter,
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
});

onResult((result) => {
	if (result.data?.billingsBillingAddress) {
		cityId.value = result.data.billingsBillingAddress[0].city;
		areaId.value = result.data.billingsBillingAddress[0].area;
		coordinates.value = {
			lat: result.data.billingsBillingAddress[0].location.coordinates[0],
			long: result.data.billingsBillingAddress[0].location.coordinates[1],
		};
		console.log("coordinates", coordinates.value);
		place.value = result.data.billingsBillingAddress[0].place;
		billingAddress.value = result.data.billingsBillingAddress[0];
		tinNumberUrl.value.push(result.data.billingsBillingAddress[0].tinNumberUrl);
		businessLicenseUrl.value.push(
			result.data.billingsBillingAddress[0].businessLicenseUrl
		);
	}
});

/**-----------------------Add Billing Address----------------------------- */

const {
	mutate: addBillingMutate,
	onError: addBillingError,
	onDone: addBillingDone,
	loading: addBillingLoading,
} = authMutation(addBillingAddressMutation);

addBillingDone((result) => {
	console.log("place data", result.data.billingAddress.returning[0].place);
	place.value = result.data.billingAddress.returning[0].place;
	notify({
		title: "Billing Address Added",
		description: "Billing Address Added Successfully",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});
	openCreatePayment.value = true;
});

const handleSubmit = () => {
	addBillingMutate({
		input: {
			...billingAddress.value,
			placeId: props.placeId,
			cityId: cityId.value.id,
			areaId: areaId.value.id,
			location: [
				parseFloat(coordinates.value.lat),
				parseFloat(coordinates.value.long),
			],
		},
	});
};

const openCreatePayment = ref(false);
</script>
<template>
	<ModalsCreatePayment
		@createDone="next"
		:place="place"
		v-model="openCreatePayment"
	/>
	<div class="space-y-12">
		<form action="" class="grid p-4 gap-x-8 gap-y-12 grid-cols-3">
			<h1 class="text-xl text-sheger-gray-600">Basic Billing Info</h1>
			<h1 class="text-xl text-sheger-gray-600">Address</h1>
			<h1 class="text-xl text-sheger-gray-600">Contact Person</h1>
			<div class="space-y-6">
				<HTextfield
					name=" Org Legal Name"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="Organization Name"
					v-model="billingAddress.organizationLegalName"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Org Legal Name</p>
					</template>
				</HTextfield>
				<HTextfield
					name="TIN Number"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="01938739277"
					v-model="billingAddress.tinNumber"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">TIN Number</p>
					</template>
				</HTextfield>
				<HTextfield
					name="contactEmail"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="01938739277"
					v-model="billingAddress.contactEmail"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Contact Email</p>
					</template>
				</HTextfield>
				<HSingleSelect
					name="payment-method"
					v-model="billingAddress.paymentMethod"
					label="Payment Method"
					:items="paymentMethods"
				/>
			</div>
			<div class="space-y-6">
				<SelectorsCity :init="cityId" name="city" v-model="cityId" />

				<SelectorsArea :init="areaId" name="area" v-model="areaId" />
				<CommonMapSelector
					name="location"
					class="w-full"
					@updateMapVal="updateMapVal"
					:lat="coordinates.lat"
					:long="coordinates.long"
					v-if="!loading"
				/>
			</div>
			<div class="space-y-6">
				<HTextfield
					name=" Full Name"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="Contact Person’s Full Name"
					v-model="billingAddress.contactPersonName"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Full Name</p>
					</template>
				</HTextfield>

				<HTextfield
					name="Phone Number"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="01938739277"
					v-model="billingAddress.contactPersonPhone"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Phone Number</p>
					</template>
				</HTextfield>
				<HTextfield
					name="Alt Phone Number"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="01938739277"
					v-model="billingAddress.contactPersonAltPhone"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Alternative Phone Number</p>
					</template>
				</HTextfield>
			</div>

			<div class="col-span-3 grid grid-cols-2 gap-x-8">
				<div>
					<p class="mb-2 text-sheger-gray-100">Tin Document</p>

					<HFileUploadWrapper
						name="Tin Document"
						:maxFileSize="1024 * 1024 * 10"
						:fileLimit="1"
						folder="applications_form"
						description="Tin Document"
						placeholder="select Tin Document"
						:disabled="false"
						:showStar="false"
						v-model="tinNumberUrl"
						:init="tinNumberUrl"
					/>
				</div>
				<div>
					<p class="mb-2 text-sheger-gray-100">Business license</p>
					<HFileUploadWrapper
						name="Business license"
						:maxFileSize="1024 * 1024 * 10"
						:fileLimit="1"
						folder="applications_form"
						description="Business license"
						placeholder="select Business license"
						:disabled="false"
						:showStar="false"
						v-model="businessLicenseUrl"
						:init="businessLicenseUrl"
					/>
				</div>
			</div>
		</form>

		<!-- --------------------------------------navigation-------------------------------- -->
		<div class="flex items-center justify-between my-2">
			<button
				class="primary-button border flex items-center gap-4"
				@click="prev()"
			>
				<Icon name="uil:arrow-left" class="w-6 h-6" />
				Previous
			</button>

			<button
				type="button"
				class="primary-button border flex items-center gap-4 text-white bg-primary-600"
				@click="handleSubmit()"
			>
				{{ addBillingLoading ? "Submitting..." : "Submit" }}
			</button>
		</div>
	</div>
</template>
