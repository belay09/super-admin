<script setup></script>
<template>
	<div class="flex flex-col px-5 py-6 space-y-5 border rounded-lg">
		<!-- -------------------Pricing header--------------------- -->
		<p class="text-2xl font-semibold text-sheger-gray-100">
			{{ formInput?.plan_name }}
		</p>

		<p class="text-sheger-gray-100">{{ formInput.description }}</p>
		<p class="text-xl font-medium text-sheger-gray-100">
			<span v-if="formInput.lamp_sum_price">ETB</span>
			{{ formInput.lamp_sum_price }}
			<span v-if="formInput.lamp_sum_price">/</span>
			{{ formInput.frequency }}
		</p>

		<!-- ------------------Plan futures------------- -->

		<div class="flex flex-col space-y-4 secondary-text">
			<div
				v-for="(item, index) in features"
				:key="index"
				class="relative secondary-flex-row"
			>
				<Icon name="uil:check" class="text-2xl" />
				<p>{{ item.description }}</p>
				<button
					@click="
						[
							(singleFeature = features[index]),
							(editIndex = index),
							(isEdit = true),
						]
					"
				>
					<Icon
						name="tabler:edit"
						class="absolute top-0 text-xl text-primary-600 -right-2"
					/>
				</button>
			</div>
		</div>

		<!-- ----------------------Submit------------------- -->
		<div class="flex items-end h-full">
			<button
				@click="onSubmit"
				type="submit"
				class="block w-full py-3 mt-4 primary-button secondary-border"
			>
				<span>Save</span>
			</button>
		</div>
	</div>
</template>
