<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
const props = defineProps({
	entity: {
		type: [Array, Object, String],
		required: true,
	},
});

const router = useRouter();
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
</script>
<template>
	<ModalsCreatePayment :place="entity" v-model="openCreatePaymentModal" />
	<div class="p-4 cursor-pointer space-y-4 border border-gray-300 rounded-lg">
		<div class="flex items-center justify-between">
			<p class="text-lg font-medium leading-7">
				{{ entity.organizationLegalName }}
			</p>
			<Popover class="relative">
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
		<div class="space-y-1">
			<p class="text-sm text-gray-600">Places</p>
			<div class="flex gap-x-2 pb-2 w-full overflow-x-auto">
				<div
					v-for="i in 10"
					:key="i"
					class="flex hover:border-primary-600 flex-shrink-0 items-center gap-x-2 border border-gray-200/80 w-fit px-2 py-1 rounded-xl"
				>
					<img
						class="w-10 h-10 rounded-full"
						src="https://img.freepik.com/premium-vector/hotel-ornament-logo-design_420872-4.jpg"
						alt="logo"
					/>
					<div>
						<p class="text-xs text-gray-600">Zion image</p>
						<span class="text-xs bg-green-200 px-3 rounded-md text-green-600"
							>Cafe</span
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
