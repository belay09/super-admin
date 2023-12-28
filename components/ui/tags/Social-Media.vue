<script setup>

defineProps({
    name: {
        type: String,
        required: true,
    },
    icon_name: {
        type: String,
        required: true,
    },
})
</script>
<template>
    <div class="border w-fit px-3 py-1">
        <Icon :name="icon_name" />
        <span class="ml-2 text-sm font-semibold text-gray-600">{{ name }}</span>
        <Icon name="ion:close-outline" class="ml-2 w-4 h-4 hover:cursor-pointer hover:text-primary-600" />
    </div>
</template>