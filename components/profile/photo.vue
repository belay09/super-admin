<script setup>
import update from '@/graphql/mutations/admin/update.gql'
import Authorizer from '@/composables/Authorizer.js'
import { useAuthStore } from '@/stores/auth.js'
import useNotify from '@/use/notify'
import mutator from "@/composables/auth-mutation";
import upload from '@/graphql/mutations/file-upload/upload.gql'

const authStore = useAuthStore()
const { notify } = useNotify()
const { handleSubmit } = useForm({})
const item = ref({})
const load = ref(false)
const base64File2 = ref(null)
const imageUrls=ref(null)
imageUrls.value = authStore?.user?.picture


watch(
  () => imageUrls.value,
  (value) => {
    let params = {
      picture: value
    }
    updateProfile({
      params
    })
  }
);

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
  openUpload.value = false
  authStore.user.picture = imageUrls.value

})
updateProfileError((error) => {
  notify({
    title: 'Some thing went wrong',
    description: error.message,
    type: 'error',
    cardClass: 'bg-red-200'
  })
})

const openUpload = ref(false)

</script>

<template>


  <div
    class="w-[80%] h-full flex-col bg-white-100 justify-center items-center my-3 pl-2 rounded-md border-[1px]"
  >
    <!-- <div v-if="load" class="w-full">
      <CommanProgress
        color1="bg-primary-100"
        color2="bg-primary-50"
        color3="bg-primary-50"
        height="h-1"
      />
    </div> -->
    <div
      class="w-full h-full flex-col bg-white-100 justify-center items-center p-5 relative"
    >
      <div
        class="w-full h-full flex-col bg-white-100 justify-center items-center p- relative"
      >
        <div
          class="w-full h-full flex-col bg-white-100 justify-center items-center p- relative"
        >
          <div class="relative inline-block">
            <!-- <img
              :src="item?.imageUrls"
              alt="logo"
              class="w-[60px] h-[60px] rounded-full justify-start"
            /> -->
            <CommonProfileUpload  v-model="imageUrls" />
            
          </div>

          <h1 class="text-lg font-poppins font-medium capitalize pt-2">
            {{ item.first }} {{ item.last }} {{ item.family }}
          </h1>
          <h1
            class="text-xs text-gray-600 font-poppins font-light capitalize text-start"
          >
            Sheger Admin
          </h1>
        </div>
      </div>
    </div>
  </div>
</template>
