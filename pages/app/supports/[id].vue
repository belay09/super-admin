<script setup>
const router = useRouter();
definePageMeta({
  layout: "home",
});
</script>

<template>
  <div class="py-6 px-12">
    <div
      class="flex justify-between items-center pb-6 border-b-2 border-sheger-gray-300"
    >
      <div
        @click="router.back()"
        class="secondary-flex-row text-sheger-gray-100 hover:cursor-pointer py-4"
      >
        <Icon name="heroicons:arrow-left-20-solid" class="text-2xl"></Icon>
        <p class="text-2xl font-semibold">Problem with Updating Menu</p>
      </div>
      <div class="flex space-x-6 items-center">
        <button class="primary-button block bg-primary-600">
          <Icon
            name="mingcute:user-add-line"
            class="text-xl text-white"
            color=""
          />
          <span class="text-white">Mark as Addressed</span>
        </button>
        <button class="primary-button block secondary-border">
          <Icon name="mingcute:user-add-line" class="text-xl" color="" />
          <span class="">Reply</span>
        </button>
        <button class="primary-button block secondary-border">
          <Icon name="mingcute:user-add-line" class="text-xl" color="" />
          <span class="">Delete</span>
        </button>
      </div>
    </div>

    <!-- ---------------------------Name-------------------------- -->
    <div class="flex justify-between items-center py-6">
      <!-- -----------------Profile Picture----------------- -->
      <div class="secondary-flex-row">
        <div>
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="user image"
            class="w-10 h-10 rounded-full"
          />
        </div>
        <div>
          <p>Selamu Dawit</p>
          <p class="secondary-text">selamudev@gmail.com</p>
        </div>
      </div>
      <!-- -------------------Time----------------------- -->
      <p class="secondary-text">23 Feb, 2023</p>
    </div>

    <!-- -------------------------Body------------------------ -->
    <div class="w-9/12 flex flex-col space-y-6">
      <p>Hi!</p>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
        ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis
        dis parturient montes, nascetur ridiculus mus
      </p>
      <div class="pl-8">
        <p v-for="i in 5" :key="i">
          <span>{{ i }}. </span>
          Nunc ultrices lacus mollis arcu lobortis, et lacinia dolor tempor.
        </p>
      </div>

      <p>
        FDonec quam felis, ultricies nec, pellentesque eu, pretium quis,
        sem.Nulla consequat massa quis enim. Donec pede justo, fringilla vel,
        aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet
        a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium.
        Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.
      </p>

      <p>Thanks</p>
      <p>Jane</p>
    </div>
  </div>
</template>
