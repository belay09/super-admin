<script setup>
import deletereviewAdMutation from "@/graphql/mutations/place-ads/delete.gql";
import useNotify from "@/use/notify";

/**-------------------------Globals------------------------- */

const { notify } = useNotify();
const props = defineProps({
  reviewAd: {
    type: Object,
    required: true,
  },
});

const refetchAds = inject("refetchAds");
/**------------------------Handle delete--------------------- */
const { mutate, onDone, onError, loading } = authMutation(
  deletereviewAdMutation
);

function handleDelete() {
  mutate({
    id: props.reviewAd.id,
  });
}
onDone((result) => {
  showConfirmationModal.value = false;

  notify({
    title: "Success",
    description: "Place  deleted successfully",
    type: "success",
    borderClass: "border-l-8 border-green-300",
  });
  if (refetchAds) {
    refetchAds();
  }
});

onError((error) => {
  showConfirmationModal.value = false;
  notify({
    title: "Error",
    description: error.message,
    type: "error",
    borderClass: "border-l-8 border-red-300",
  });
});

// confirmation modal
const showConfirmationModal = ref(false);
const showEditAddSpaceModal = ref(false);
</script>

<template>
  <ModalsConfirmation
    @confirm="handleDelete"
    v-model="showConfirmationModal"
    title="Delete AD"
    sure-question="Are you sure you want to delete this Ad ?"
    description="This action is irreversible and will permanently remove the advertisement and all associated data."
  ></ModalsConfirmation>
  <!-- -----------------------Edit ad space modal----------------------- -->
  <AdSpace-Review-Ad-Edit :id="reviewAd.id" v-model="showEditAddSpaceModal" />
  <div class="rounded-lg border">
    <!-- -----------------Image section------------------------ -->

    <img
      v-if="reviewAd.review_ad_medias?.length > 0"
      :src="reviewAd.review_ad_medias[0]?.media?.url"
      alt="ad-space-default image"
      class="w-full object-cover object-center rounded-t-lg h-32"
    />
    <div class="w-full h-32 bg-stone-500" v-else></div>

    <!-- --------------------Card body------------------------ -->
    <div class="flex flex-col space-y-4 py-4 px-5">
      <!-- ------------------Review title------------ -->
      <p class="text-2xl font-medium">{{ reviewAd.review.title }}</p>

      <!-- ------------------Place name and logo------------------ -->
      <div class="secondary-flex-row">
        <div>
          <img
            class="w-8 h-8 object-cover"
            :src="reviewAd.review?.place?.light_logo?.url"
            alt="place logo"
          />
        </div>
        <p class="text-xl font-medium">{{ reviewAd.review.place?.name }}</p>
      </div>
      <!-- -------------------Place type----------------------- -->
      <p
        class="bg-primary-100 px-4 rounded-md self-start text-primary-600 capitalize"
      >
        {{ reviewAd.review.place?.type.toLowerCase() }}
      </p>

      <!-- ------------------Description------------- -->
      <p class="secondary-text line-clamp-4">
        {{ reviewAd.review?.description }}
      </p>

      <!-- -----------------Date------------------- -->

      <div class="primary-flex-row">
        <Icon class="text-xl" name="uil:calendar-alt"></Icon>
        <p class="secondary-text">{{ reviewAd.endDate }}</p>
      </div>
    </div>

    <!-- -------------------Card footer------------------------ -->
    <div class="grid grid-cols-2 px-10 py-4 gap-x-4 border-t">
      <!-- ------------------Edit ad space---------------- -->
      <button
        @click="showEditAddSpaceModal = true"
        class="primary-button border justify-center secondary-text hover:bg-primary-600 hover:text-white"
      >
        <Icon name="ic:round-edit" class="text-xl"></Icon>
        <span> Edit</span>
      </button>

      <!-- ------------------Delete ad space---------------- -->
      <button
        @click="showConfirmationModal = true"
        class="primary-button border justify-center secondary-text hover:bg-primary-600 hover:text-white"
      >
        <Icon name="uil:trash-alt" class="text-xl"></Icon>
        <span> Delete</span>
        <Icon
          v-if="loading"
          name="eos-icons:bubble-loading"
          class="text-3xl text-red-600"
        />
      </button>
    </div>
  </div>
</template>
