<script setup>
import update from '@/graphql/mutations/admin/update.gql'
import Authorizer from '@/composables/Authorizer.js'
import { useAuthStore } from '@/stores/auth.js'
import useNotify from '@/use/notify'

const authStore = useAuthStore()
const { notify } = useNotify()
const { handleSubmit } = useForm({})
const item = ref({})
item.value.first = authStore?.user?.given_name
item.value.last = authStore?.user?.middle_name
item.value.family = authStore?.user?.family_name
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
  modal.value = false
})
updateProfileError((error) => {
  notify({
    title: 'Some thing went wrong',
    description: error.message,
    type: 'error',
    cardClass: 'bg-red-200'
  })
})

const modal = ref(false)
const handleNameChange = handleSubmit(() => {
  console.log('clicked')
  let params = {
    given_name: item.value.first,
    middle_name: item.value.last,
    family_name: item.value.family
  }
  updateProfile({
    params
  })
})

</script>

<template>
    <ModalsMod
    :modelValue="modal"
    v-slot:ModalContent
    v-bind:wrapper-class="'relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg md:max-w-[35vw] mx-8 sm:p-0'"
  >
    <div class="flex justify-between px-7 pt-7">
      <div class="flex gap-1">
        <h1 class="text-xl font-poppins text-black font-medium capitalize">
          update profile
        </h1>
      </div>
      <button @click="modal = false">
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
      <form action="" @submit.prevent="handleNameChange">
        <div class="w-full flex-col ">
          <div class=" w-full  my-2">
            <h1
              class="font-medium text-md leading-[35px] font-body text-secondary  :text-white capitalize"
            >
              first name
            </h1>
            <HTextfield
              rules="required"
              name="first"
              v-model="item.first"
              :mainDiv="'my-2 w-full'"
            />
          </div>
          <div class="col-span-full my-2">
            <h1
              class="font-medium text-md leading-[35px] font-body text-secondary  :text-white capitalize"
            >
              middle name
            </h1>
            <HTextfield
              rules="required"
              name="last"
              v-model="item.last"
              :mainDiv="'my-2'"
            />
          </div>
          <div class="col-span-full my-2">
            <h1
              class="font-medium text-md leading-[35px] font-body text-secondary  :text-white capitalize"
            >
              last name
            </h1>
            <HTextfield
              rules="required"
              name="family"
              v-model="item.family"
              :mainDiv="'my-2'"
            />
          </div>

          <HButton
            type="submit"
            :inputClass="'text-white bg-primary-500 w-full  rounded-md py-2 text-lg capitalize font-medium leading-[35px] mb-4 font-body text-secondary  :text-white'"
            name="Change Name"
          >
          </HButton>
        </div>
      </form>
    </div>
  </ModalsMod>
<div
        class="w-[80%] flex-col bg-white-100 justify-center items-center pl-2 rounded-md border-[1px]"
      >
        <div class="w-full flex bg-white-100 justify-between items-center p-5">
          <h1 class="text-lg font-poppins font-medium capitalize pt-0">
            personal information
          </h1>
          <button @click="modal=true" type="button" class="border-[1px] rounded py-1 px-3 mr-10">
            <Icon
              name="ri:edit-line"
              width="20"
              height="20"
              class="self-center text-primary-500 mr-1 font-inter"
            ></Icon>
            Edit
          </button>
        </div>
        <div class="flex w-full justify-between pl-5 mb-2">
          <div class="flex-col">
            <h1
              class="text-sm font-poppins font-normal capitalize text-gray-600 pt-0"
            >
              first name
            </h1>
            <h1 class="text-sm font-poppins font-normal capitalize pt-0">
              {{ item.first }}
            </h1>
          </div>
          <div class="flex-col">
            <h1
              class="text-sm font-poppins font-normal capitalize text-gray-600 pt-0"
            >
              middle name
            </h1>
            <h1 class="text-sm font-poppins font-normal capitalize pt-0">
              {{ item.last }}
            </h1>
          </div>
          <div class="flex-col mr-24">
            <h1
              class="text-sm font-poppins font-normal capitalize text-gray-600 pt-0"
            >
              last name
            </h1>
            <h1 class="text-sm font-poppins font-normal capitalize pt-0">
              {{ item.family }}
            </h1>
          </div>
        </div>
      </div>
</template>