
<script setup>
import { ref } from 'vue';
import { format, parseISO } from 'date-fns';

import mutator from "@/composables/auth-mutation";
import useNotify from "@/use/notify";
const { notify } = useNotify();
const props = defineProps({
  message: {
  type: Object,
  required: false,
}
});
const emit = defineEmits(['refresh'])
const delate = () => {
// Send a variable to the parent function
const dataToSend = "Hello from child component!";
emit('childEvent', props.menu);

};
console.log("from image ",props.menu)
const showImageButton = ref(false);

const showButton = () => {
  showImageButton.value = true;
};

const hideButton = () => {
  showImageButton.value = false;
};

const currentIndex = ref(0);

const changeImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length;
};
const delateFunction = () => {
var tempId = props.menu.media.id
console.log(" from delate",tempId)
const{
    mutate: removeMutation,
      loading: removeMutationLoading,
      onDone: removeMutationDone,
      onError: removeMutationError,
    } = mutator(delateMedia, "");
    removeMutation({
        _eq: tempId,
      }); 
      removeMutationDone((result) => {
      notify({
  title: "image successfully delated",
  borderClass: "border-l-8 border-green-800",
  cardClass: "bg-green-300 text-white text-white",
});
emit('refresh');

})
}
</script>

<style scoped>

</style>


<template>
<div :class="{ 'bg-[#F0E4E5]': !message.isSeen }" class="flex-col w-full p-2 ">    <div class="flex justify-between items-center  overflow-y-auto  w-full">
        <div class="flex w-full gap-2 items-center">
            <Icon name="dashicons:food" width="30" height="30" color="gray-900"/>
            <h1 class="text-md font-poppins font-normal  capitalize  pl-2"> {{message.title}}</h1>
        </div>
        <div class="flex  ">
          {{format(parseISO(message.createdAt), 'dd,MMM')}}
        </div>
    </div>
    <p class="text-sm font-poppins font-light text-gray-700  capitalize  p-5"> {{message.message}} </p>
</div>
  </template>
  