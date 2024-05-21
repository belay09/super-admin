<script setup>
import editEditMutation from "@/graphql/mutations/entities/edit.gql";
import useNotify from "@/use/notify";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

const { notify } = useNotify();

const props = defineProps({
	entity: {
		type: [Array, Object, String],
		required: true,
	},
	hasAction: {
		type: Boolean,
		default: true,
	},
	wrapperClass: String,
});

const emits = defineEmits(["editDone"]);

const router = useRouter();

const {
	mutate: editMutate,
	onDone: editDone,
	onError: editError,
	loading: editLoading,
} = authMutation(editEditMutation);

editDone(() => {
	notify({
		title: "Updated successfully",
		description: "Updated successfully",
		type: "success",
		borderClass: "border-l-8 border-green-300",
	});

	toggleActiveModal.value = true;
	togglePendModal.value = true;
	toggleCloseModal.value = true;
});

const onEditMutate = (newStatus) => {
	editMutate({
		input: {
			status: newStatus,
		},
		id: props.entity.id,
	});

	emits("editDone");
};

const goToBillingDetail = () => {
	router.push({
		path: `/app/billings/${props.entity.id}`,
		query: {
			name: props.entity.organizationLegalName,
		},
	});
};

const goToPlaceCreation = () => {
	router.push({
		path: "/app/places/register-new-place",
		query: {
			entityId: props.entity.id,
		},
	});
};

const goEditEntity = () => {
	router.push({
		path: "/app/entity/add",
		query: {
			step: 0,
			id: props.entity.id,
		},
	});
};

const openCreatePaymentModal = ref(false);
const toggleActiveModal = ref(false);
const togglePendModal = ref(false);
const toggleCloseModal = ref(false);
</script>
<template>
	<ModalsConfirmation
		@confirm="onEditMutate('ACTIVE')"
		v-model="toggleActiveModal"
		title="Activate Entity"
		sure-question="Are you sure you want to activate the entity?"
	></ModalsConfirmation>

	<ModalsConfirmation
		@confirm="onEditMutate('PENDING')"
		v-model="togglePendModal"
		title="Pend Entity"
		sure-question="Are you sure you want to pend the entity?"
	></ModalsConfirmation>

	<ModalsConfirmation
		@confirm="onEditMutate('CLOSED')"
		v-model="toggleCloseModal"
		title="Close Entity"
		sure-question="Are you sure you want to close the entity?"
	></ModalsConfirmation>

	<ModalsCreatePayment :place="entity" v-model="openCreatePaymentModal" />
	<div
		:class="wrapperClass"
		@click="!hasAction ? goToPlaceCreation() : null"
		class="p-4 cursor-pointer space-y-4 border border-gray-300 rounded-lg"
	>
		<div class="flex items-center justify-between">
			<p class="text-lg font-medium leading-7">
				{{ entity.organizationLegalName }}
			</p>
			<Popover v-if="hasAction" class="relative">
				<PopoverButton class="hover:bg-gray-100 rounded-full w-9 h-9">
					<Icon
						class="text-2xl cursor-pointer"
						name="ph:dots-three-outline-vertical-fill"
					/>
				</PopoverButton>

				<PopoverPanel
					class="absolute right-0 z-10 min-w-[280px] p-4 mt-1.5 bg-white rounded-lg shadow-lg class"
				>
					<ul class="space-y-3">
						<li
							@click.stop="goToPlaceCreation"
							class="flex items-center text-base cursor-pointer gap-x-4"
						>
							<Icon class="text-xl" name="material-symbols:add" />
							<span>Add Place</span>
						</li>
						<li
							@click.stop="goEditEntity"
							class="flex items-center text-base cursor-pointer gap-x-4"
						>
							<Icon class="text-xl" name="carbon:edit" />
							<span>Edit Entity</span>
						</li>
						<li
							@click.stop="openCreatePaymentModal = true"
							class="flex items-center text-base cursor-pointer gap-x-4"
						>
							<Icon class="text-xl" name="wpf:renew-subscription" />
							<span>Upgrade Subscription</span>
						</li>
						<li
							@click.stop="goToBillingDetail"
							class="flex items-center text-base cursor-pointer gap-x-4"
						>
							<Icon class="text-xl" name="mingcute:document-3-line" />
							<span>Billing History</span>
						</li>
						<li
							@click="toggleActiveModal = true"
							class="flex items-center gap-3"
						>
							<Icon name="majesticons:open" class="text-xl shrink-0" />
							<p>Activate Entity</p>
						</li>
						<li @click="togglePendModal = true" class="flex items-center gap-3">
							<Icon name="carbon:pending" class="text-2xl shrink-0" />
							<p class="whitespace-nowrap">Pend Entity</p>
						</li>
						<li
							@click="toggleCloseModal = true"
							class="text-primary-500 flex items-center text-base cursor-pointer gap-x-4"
						>
							<Icon class="text-xl" name="jam:close-rectangle" />
							<span>Close Entity</span>
						</li>
					</ul>
				</PopoverPanel>
			</Popover>
		</div>
		<div class="flex gap-x-2">
			<Icon class="text-xl" name="mingcute:location-line" />
			<span class="text-sm text-gray-600">Addis Ababa</span>
			<span class="text-sm text-gray-600">Megenagna</span>
		</div>
		<div class="flex gap-x-2">
			<Icon class="text-xl" name="material-symbols:person-outline" />
			<p class="text-sm text-gray-600">{{ entity.contactPersonName }}</p>
		</div>
		<div class="flex gap-x-6">
			<div class="flex gap-x-2">
				<Icon class="text-xl" name="ic:baseline-phone" />
				<div>
					<p class="text-sm text-gray-600">
						+251 {{ entity.contactPersonPhone }}
					</p>
					<p class="text-sm text-gray-600">
						+251 {{ entity.contactPersonAltPhone }}
					</p>
				</div>
			</div>
			<div class="flex gap-x-2">
				<Icon class="text-xl" name="ic:outline-email" />
				<p class="text-sm text-gray-600">{{ entity.contactEmail }}</p>
			</div>
		</div>

		<div class="flex gap-x-12">
			<NuxtLink :to="entity.tinNumberUrl" target="_blank" class="space-y-1">
				<p class="text-xs text-gray-600">TIN Document</p>
				<div
					class="flex gap-x-2 border hover:border-primary-600 border-gray-300 rounded-lg w-fit px-2 py-1 items-center"
				>
					<Icon name="mingcute:document-3-line" />
					<p class="text-xs">{{ entity.tinNumber }}</p>
					<Icon name="akar-icons:link-out" />
				</div>
			</NuxtLink>
			<NuxtLink
				:to="entity.businessLicenseUrl"
				target="_blank"
				class="space-y-1"
			>
				<p class="text-xs text-gray-600">Business document</p>
				<div
					class="flex gap-x-2 border hover:border-primary-600 border-gray-300 rounded-lg w-fit px-2 py-1 items-center"
				>
					<Icon name="mingcute:document-3-line" />
					<p class="text-xs">Document</p>
					<Icon name="akar-icons:link-out" />
				</div>
			</NuxtLink>
		</div>
		<div v-if="entity.places.length > 0" class="space-y-1">
			<p class="text-sm text-gray-600">Places</p>
			<div class="flex gap-x-2 pb-2 w-full overflow-x-auto">
				<div
					@click="$router.push(`/app/places/${place.id}`)"
					v-for="(place, i) in entity.places"
					:key="i"
					class="flex hover:border-primary-600 flex-shrink-0 items-center gap-x-2 border border-gray-200/80 w-fit px-2 py-1 rounded-xl"
				>
					<img
						class="w-10 h-10 rounded-full"
						:src="
							place.light_logo && place.light_logo.url
								? place.light_logo.url
								: 'https://cdn.hahu.jobs/public/sheger-gebeta/6f1fedea-f5cf-4cea-afe8-1f0e807a4d3d.png'
						"
						alt="logo"
					/>

					<div>
						<p class="text-xs text-gray-600">{{ place.name }}</p>
						<span
							class="text-xs lowercase bg-gray-200 px-3 rounded-md text-gray-600"
							>{{ place.type }}</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
