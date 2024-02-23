<script setup>
import { format, parseISO } from "date-fns";

const router = useRouter();
const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
});
/***--------------------------Table data------------------- */
const sort = ref([{ name: "desc" }]);
const offset = ref(0);
const limit = ref(20);
const length = ref(100);
const headers = [
	{
		text: "Name",
		value: "name",
	},
	{
		text: "Message",
		value: "message",
	},

	{
		text: "Created at",
		value: "createdAt",
	},
];

const loading = ref(true);
loading.value = false;
const clickRow = (item) => {
	router.push("/app/supports/12");
};
</script>

<template>
	<div class="flex flex-col py-6 space-y-8">
		<div class="flex items-center justify-between">
			<p class="text-xl font-medium text-sheger-gray-100">
				Showing 9/12 entries
			</p>
			<H-Page></H-Page>
		</div>

		<div class="">
			<h-table
				:headers="headers"
				:items="items"
				v-model:sort="sort"
				:loading="loading"
				@click:row="clickRow"
				supporterClass="shadow-md  overflow-x-auto overflow-y-hidden rounded-md border border-gray-200"
				supportHeaderClass="bg-gray-100 border"
				tableHeaderStyle="secondary-border  bg-gray-50"
				tableBodyRowStyle="border py-6  hover:bg-primary-100"
				rowHeadStyle="secondary-text"
			>
				<template v-slot:name="{ item }">
					<div class="secondary-flex-row">
						<div>
							<img
								:src="item.user.photoUrl"
								alt="user image"
								class="w-10 h-10 rounded-full"
							/>
						</div>
						<div>
							<p>{{ item.user.fullName }}</p>
							<p class="secondary-text">selamudev@gmail.com</p>
						</div>
					</div>
				</template>

				<!-- <template v-slot:status="{ item }">
					<p class="bg-sheger-green-100 rounded-full py-0.5 text-center w-16">
						active
					</p>
				</template>

				<template v-slot:review_content="{ item }">
					<p class="tertiary-text">Lorem ipsum dolor, sit amet</p>
				</template> -->
				<template v-slot:message="{ item }">
					<p class="font-bold">
						{{ item.message.substring(0, 60) + "..." }}
					</p>
				</template>

				<template v-slot:createdAt="{ item }">
					<p class="tertiary-text">
						{{ format(parseISO(item.createdAt), "dd MMM yyyy") }}
					</p>
				</template>
			</h-table>
		</div>
		<div class="mt-5">
			<HPaginate
				v-model:offset="offset"
				:items-per-page="limit"
				:total-data="length"
			/>
		</div>
	</div>
</template>
