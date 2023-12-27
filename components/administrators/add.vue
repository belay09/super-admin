<script setup>
const roles = ref([
  {
    name: "Administrator",
    id: "Administrator",
  },
  {
    name: "Data encoder",
    id: "Data encoder",
  },
  {
    name: "Data verifier",
    id: "Data verifier",
  },
]);
const role = ref(null);
</script>

<template>
  <form class="flex flex-col space-y-6">
    <!-- ------------------------Image section-------------- -->
    <div>
      <p class="secondary-text lg:text-lg">Profile Image</p>
      <div>
        <img
          src="/images/temporary/upload-image-2.png"
          class="w-full py-2"
          alt="upload temporary image"
        />
      </div>
    </div>

    <!-- ----------------------Name------------------- -->

    <H-Textfield
      id="name"
      name="name"
      label="Name"
      placeholder="Name"
      type="text"
    ></H-Textfield>

    <!-- ----------------------Email------------------- -->

    <H-Textfield
      id="email"
      name="email"
      label="Email"
      placeholder="Email"
      type="text"
    ></H-Textfield>

    <!-- ----------------Role selection----- -->
    <H-SingleSelect
      name="role"
      id="role"
      label="Roles"
      :items="roles"
      v-model="role"
    ></H-SingleSelect>

    <!-- ----------------------Submit------------------- -->
    <button type="submit" class="primary-button bg-primary-600 py-3 text-white">
      <span>Invite Administrator</span>
    </button>
  </form>
</template>
