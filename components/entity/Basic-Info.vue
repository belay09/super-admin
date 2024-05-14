<script setup>
import addEntity from "@/graphql/mutations/billing/add-billing-address.gql";
import getEntity from "@/graphql/query/entity/item.gql";
import { useForm } from "vee-validate";

/**-----------------------Navigation----------------------------- */

import useNotify from "@/use/notify";

const { handleSubmit } = useForm();

const { notify } = useNotify();
const router = useRouter();
const route = useRoute();

const emit = defineEmits(["next", "prev"]);
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
const entityAddress = ref({});
const place = ref();

const coordinates = ref({});
const updateMapVal = (v) => {
	coordinates.value.lat = v.position.lat;
	coordinates.value.long = v.position.lng;
};

/**-----------------------Get Billing Address----------------------------- */
const filter = ref(parseInt(route.query?.id));
const { loading, onError, onResult, refetch } = authFetch(getEntity, {
	filter: filter,
	client: toRef("authClient"),
	role: toRef("shegeradmin"),
});

onResult((result) => {
	const entity = result.data.entity;
	if (result.data?.entity) {
		cityId.value = entity.cityId;
		areaId.value = entity.areaId;
		entityAddress.value = entity;
		coordinates.value.lat = entity.location[0];
		coordinates.value.long = entity.location[1];

		if (entity.businessLicenseUrl) {
			businessLicenseUrl.value.push(entity.businessLicenseUrl);
		}
		if (entity.tinNumberUrl) {
			tinNumberUrl.value.push(entity.tinNumberUrl);
		}
	}
});

/**-----------------------Add Billing Address----------------------------- */

const {
	mutate: addEntityMutate,
	onError: addEntityError,
	onDone: addEntityDone,
	loading: addEntityLoading,
} = authMutation(addEntity);

addEntityDone((result) => {
	router.push({
		path: route.path,
		query: {
			step: 1,
			id: result.data.insertEntity.returning[0].id,
			name: result.data.insertEntity.returning[0].organizationLegalName,
		},
	});
});

const onSubmit = handleSubmit(() => {
	delete entityAddress.value.city;
	delete entityAddress.value.area;
	delete entityAddress.value.place;
	delete entityAddress.value.__typename;

	entityAddress.value.cityId = cityId.value;
	entityAddress.value.areaId = areaId.value;

	addEntityMutate({
		input: {
			...entityAddress.value,
			location: [
				parseFloat(coordinates.value.lat),
				parseFloat(coordinates.value.long),
			],
			tinNumberUrl: tinNumberUrl.value[0],
			businessLicenseUrl: businessLicenseUrl.value[0],
		},
	});
});
</script>
<template>
	<div class="space-y-6">
		<form action="" class="grid gap-x-8 gap-y-6 grid-cols-3">
			<h1 class="text-xl text-sheger-gray-600">Basic Info</h1>
			<h1 class="text-xl text-sheger-gray-600">Address</h1>
			<h1 class="text-xl text-sheger-gray-600">Contact Person</h1>
			<div class="space-y-6">
				<HTextfield
					name=" Org Legal Name"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="Organization Name"
					v-model="entityAddress.organizationLegalName"
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
					v-model="entityAddress.tinNumber"
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
					v-model="entityAddress.contactEmail"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Contact Email</p>
					</template>
				</HTextfield>
				<HSingleSelect
					name="payment-method"
					v-model="entityAddress.paymentMethod"
					label="Payment Method"
					:items="paymentMethods"
					rules="required"
				/>
			</div>
			<div class="space-y-6">
				<SelectorsCity name="city" v-model="cityId" />
				<SelectorsArea name="area" v-model="areaId" />
				<CommonMapSelector
					name="location"
					class="w-full"
					@updateMapVal="updateMapVal"
					:lat="coordinates.lat"
					:long="coordinates.long"
				/>
			</div>
			<div class="space-y-6">
				<HTextfield
					name=" Full Name"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
					placeholder="Contact Person’s Full Name"
					v-model="entityAddress.contactPersonName"
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
					v-model="entityAddress.contactPersonPhone"
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
					v-model="entityAddress.contactPersonAltPhone"
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
				class="primary-button border disabled:opacity-50 disabled:cursor-not-allowed flex items-center !px-12 gap-4 text-white bg-primary-600"
				disabled="true"
				@click="$emit('prev')"
			>
				<Icon name="material-symbols:arrow-back-ios" />
				Previous
			</button>
			<button
				type="button"
				class="primary-button border flex items-center !px-12 gap-4 text-white bg-primary-600"
				@click="onSubmit()"
			>
				{{ addEntityLoading ? "Submitting..." : "Next" }}
				<Icon name="material-symbols:arrow-forward-ios" />
			</button>
		</div>
	</div>
</template>
