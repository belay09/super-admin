<script setup>
definePageMeta({
	layout: "home",
});

const placeItems = ref([
	{
		name: "Hotels",
		id: "Hotels",
		logo: "/images/temporary/kuriftu.png",
	},
	{
		name: "Restaurants",
		id: "Restaurants",
		logo: "/images/temporary/kuriftu.png",
	},
	{
		name: "Cafes",
		id: "Cafes",
		logo: "/images/temporary/kuriftu.png",
	},
	{
		name: "Caterings",
		id: "Caterings",
		logo: "/images/temporary/kuriftu.png",
	},
]);

const dishTitleItems = ref([
	{
		name: "Chicken Burger",
		id: "Chicken Burger",
	},
	{
		name: "Beef Burger",
		id: "Beef Burger",
	},
	{
		name: "Veggie Burger",
		id: "Veggie Burger",
	},
	{
		name: "Beef Burger",
		id: "Beef Burger",
	},
]);

const menuTypeItems = ref([
	{
		name: "Food",
		id: "Food",
	},
	{
		name: "Drink",
		id: "Drink",
	},
]);

const image = ref();
const selectedThumbnails = ref();
</script>

<template>
	<div class="px-20">
		<!-- --------------------------------Top-------------------------------- -->
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-medium">Post New Review</h1>
			<div class="font-medium text-white border primary-button bg-primary-600">
				<p class="mx-6">Post Now</p>
			</div>
		</div>

		<!-- --------------------------------Form-------------------------------- -->

		<form class="flex gap-7">
			<!-- ------------------------------Left------------------------------- -->
			<div class="flex-[50%]">
				<!------------------------------- Place--------------------------- -->

				<H-SingleSelect
					name="place"
					id="place"
					label="Type"
					:items="placeItems"
					v-model="place"
				>
					<template v-slot:header="{ item }">
						<div class="flex items-center gap-3">
							<div>
								<img :src="item.logo" class="w-10 h-10 rounded-full" />
							</div>
							<div>
								<p class="text-sm">{{ item.name }}</p>
							</div>
						</div>
					</template>

					<template v-slot:row="{ item }">
						<div class="flex items-center gap-3">
							<div>
								<img :src="item.logo" class="w-10 h-10 rounded-full" />
							</div>
							<div>
								<p class="text-sm">{{ item.name }}</p>
							</div>
						</div>
					</template>
				</H-SingleSelect>
				<!-- ------------------------------Description-------------------------->

				<HTextarea
					name="description"
					id="description"
					label="Description"
					v-model="description"
				/>

				<!-- ------------------------------Dish Title----------------------------->

				<H-SingleSelect
					name="Dish_Title"
					id="dish_title"
					label="Dish Title"
					:items="dishTitleItems"
					v-model="dishTitle"
				></H-SingleSelect>

				<!----------------------------------------------Price (ETB)------------------------------------------>

				<HTextfield
					type="number"
					name="Price"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
				>
					<template #label>
						<p class="text-sheger-gray-100">Price (ETB)</p>
					</template>
				</HTextfield>

				<!----------------------------------------Menu Type---------------------------------------->

				<H-SingleSelect
					name="menu_type"
					id="menu_type"
					label="Menu Type"
					:items="menuTypeItems"
					v-model="menuType"
				></H-SingleSelect>

				<!----------------------------------------Preparation Time (Minutes)-------------------------->

				<HTextfield
					type="number"
					name="Preparation Time"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Preparation Time (Minutes)</p>
					</template>
				</HTextfield>

				<!----------------------------------------Ingredient ( Use comma to seprate)---------------------------------------->

				<HTextfield
					type="text"
					name="Ingredient"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">
							Ingredient ( Use comma to seprate)
						</p>
					</template>
				</HTextfield>

				<!----------------------------------------Tag---------------------------------------->

				<H-MultiSelect
					name="menu_tag"
					id="menu_tag"
					:items="menuTypeItems"
					label="Tag"
					v-model="placeType"
					show-by="name"
				>
				</H-MultiSelect>
			</div>

			<!-----------------------------------Right---------------------------- -->
			<div class="flex-[50%]">
				<!--------------------------------Video Url-------------------------- -->

				<HTextfield
					type="text"
					name="Video Url"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					placeholder="https://www.youtube.com/watch?v=Zz5cu72GQfE"
					rules="required"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Video Url</p>
					</template>
				</HTextfield>

				<!--------------------------------Sides-------------------------- -->

				<HTextfield
					type="text"
					name="Side"
					class="border-gray-300 focus:border-primary-600 dark:bg-transparent"
					rules="required"
				>
					<template #label>
						<p class="mb-2 text-sheger-gray-100">Sides</p>
					</template>
				</HTextfield>

				<!----------------------------------Goes well with-------------------------- -->
				<H-SingleSelect
					name="place"
					id="place"
					label="Type"
					:items="placeItems"
					v-model="place"
				>
					<template v-slot:header="{ item }">
						<div class="flex items-center gap-3">
							<div>
								<img :src="item.logo" class="w-10 h-10 rounded-full" />
							</div>
							<div>
								<p class="text-sm">{{ item.name }}</p>
							</div>
						</div>
					</template>

					<template v-slot:row="{ item }">
						<div class="flex items-center gap-3">
							<div>
								<img :src="item.logo" class="w-10 h-10 rounded-full" />
							</div>
							<div>
								<p class="text-sm">{{ item.name }}</p>
							</div>
						</div>
					</template>
				</H-SingleSelect>

				<!----------------------------------------Image Upload---------------------------------------->
				<HFileUploadWrapper
					name="file"
					:maxFileSize="1024 * 1024 * 10"
					:fileLimit="3"
					folder="applications_form"
					description="upload file"
					placeholder="select multiple files"
					v-model="image"
					:init="image"
					:disabled="false"
					:showStar="false"
					v-model:thumbnails="selectedThumbnails"
				/>
			</div>
		</form>
	</div>
</template>
