<script setup>
import update from '@/graphql/mutations/admin/update.gql'
import Authorizer from '@/composables/Authorizer.js'
import { useAuthStore } from '@/stores/auth.js'
import useNotify from '@/use/notify'
const authStore = useAuthStore()
const { notify } = useNotify()
const { handleSubmit } = useForm({})
const item = ref({})
item.value.email = authStore?.user?.email
item.value.phone = authStore?.user?.phone_number
const {
  mutate: updateProfile,
  onDone: updateProfileDone,
  onError: updateProfileError,
  loading: updateProfileLoading
} = Authorizer(update)
updateProfileDone((result) => {
  notify({
    title: 'You Successfully Update Your Information ',
    description: result.data?.message,
    type: 'success',
  })
  modalPhone.value = false
})
updateProfileError((error) => {
  notify({
    title: 'Some thing went wrong',
    description: error.message,
    type: 'error',
    cardClass: 'bg-red-200'
  })
})

const modalPhone = ref(false)
const handlePhoneChange = handleSubmit(() => {
  console.log('clicked')
  let params = {
    phone_number: item.value.phone,
    email: item.value.email
  }
  updateProfile({
    params
  })
})
</script>

<template>
   <ModalsMod
    :modelValue="modalPhone"
    v-slot:ModalContent
    v-bind:wrapper-class="'relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[31vw] sm:p-0'"
  >
    <div class="flex justify-between px-7 pt-7">
      <div class="flex gap-1">
        <h1 class="text-xl font-poppins text-black font-medium capitalize">
          update profile
        </h1>
      </div>
      <button @click="modalPhone = false">
        <Icon
          name="ph:x"
          color="black"
          width="20"
          height="20"
          class="self-center"
        ></Icon>
      </button>
    </div>
    <div class="w-full px-7 py-4">
      <form action="" @submit.prevent="handlePhoneChange">
        <div class="w-full ">
          <div class=" my-2">
            <h1
              class="font-medium text-md leading-[35px] font-body text-secondary  :text-white capitalize"
            >
              Phone Number
            </h1>
            <HTextfield
              rules="required"
              name="phone"
              v-model="item.phone"
              :mainDiv="'my-2 w-full'"
            />
          </div>
          <div class=" my-2">
            <h1
              class="font-medium text-md leading-[35px] font-body text-secondary  :text-white capitalize"
            >
              email
            </h1>
            <HTextfield
              rules="required"
              name="email"
              v-model="item.email"
              :mainDiv="'my-2 w-full'"
            />
          </div>

          <HButton
            type="submit"
            :inputClass="'text-white bg-primary-500 w-full  rounded-md py-2 text-lg capitalize font-medium leading-[35px] mb-4 font-body text-secondary  :text-white'"
            name="Change phone"
          >
          </HButton>
        </div>
      </form>
    </div>
  </ModalsMod>
  <div
        class="w-[80%] h-full my-4 flex-col bg-white-100 justify-center items-center pl-2 rounded-md border-[1px]"
      >
        <div class="w-full flex bg-white-100 justify-between items-center p-5">
          <h1 class="text-lg font-poppins font-medium capitalize pt-0">
            contact information
          </h1>
          <button @click="modalPhone=true" type="button" class="border-[1px] rounded py-1 px-3 mr-10">
            <Icon
              name="ri:edit-line"
              width="20"
              height="20"
              class="self-center text-primary-500 mr-1 font-poppins"
            ></Icon>
            Edit
          </button>
        </div>
        <div class="flex w-[50%] justify-between pl-5 mb-2">
          <div class="flex-col">
            <h1
              class="text-sm font-poppins font-normal capitalize text-gray-600 pt-0"
            >
              phone number
            </h1>
            <h1 class="text-sm font-poppins font-normal capitalize pt-0">
              {{ item.phone }}
            </h1>
          </div>
          <div class="flex-col">
            <h1
              class="text-sm font-poppins font-normal capitalize text-gray-600 pt-0"
            >
              email
            </h1>
            <h1 class="text-sm font-poppins font-normal capitalize pt-0">
              {{ item.email }}
            </h1>
          </div>
        </div>
      </div>
</template>