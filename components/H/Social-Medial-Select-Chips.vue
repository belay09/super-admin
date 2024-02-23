<script setup>
import placeSocialMediaQuery from "@/graphql/query/basics/getSocialMedias.gql";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const openCombobox = ref(false);
const selectedMedia = ref({});
const addedMedia = ref(props.modelValue);
const url = ref("");
const socials = ref([]);

/*---------------------------Place SocialMedia Query---------------------------**/
const {
  onResult: onResultSocialMedia,
  onError: onErrorSocialMedia,
  loading: loadingSocialMedia,
  refetch: refetchSocialMedia,
  fetchMore: fetchMoreSocialMedia,
} = authListQuery(placeSocialMediaQuery, {}, "", 0, 100);

onResultSocialMedia((result) => {
  socials.value = result.data?.basicsSocialMedias;
  selectedMedia.value = socials.value[0];
});

const handleAddMedia = () => {
  if (!url.value) return;
  addedMedia.value.push({ ...selectedMedia.value, url: url.value });

  emit("update:modelValue", addedMedia.value);
};

const handleDeleteMedia = (index) => {
  addedMedia.value.splice(index, 1);
  emit("update:modelValue", addedMedia.value);
};

function selectSocialMedia(media) {
  url.value = "";
  selectedMedia.value = media;
  openCombobox.value = false;
}
</script>

<template>
  <div class="flex flex-col">
    <!-- show added -->

    <div class="flex flex-wrap mb-6 gap-3">
      <div
        v-for="(media, index) in addedMedia"
        class="flex items-center gap-3 border border-sheger-gray-300 w-fit py-1 px-2"
      >
        <img :src="media.icon.darkIconUrl" class="w-7 h-7" />
        <p>{{ media.name }}</p>
        <Icon
          name="mdi:close"
          class="w-5 h-5 text-sheger-gray-100 cursor-pointer"
          @click="handleDeleteMedia(index)"
        />
      </div>
    </div>

    <div
      class="flex items-center border border-sheger-gray-300 w-fit p-1 rounded-lg"
    >
      <div class="flex relative items-end gap-4">
        <div class="">
          <div
            class="text-white w-fit flex items-center py-1 px-2 hover:cursor-pointer gap-3 border-r"
            @click="openCombobox = !openCombobox"
          >
            <img :src="selectedMedia?.icon?.darkIconUrl" class="w-10 h-10" />

            <Icon
              name="mdi:chevron-down"
              class="w-5 h-5 text-sheger-gray-100"
            />
          </div>
          <div
            v-show="openCombobox"
            class="absolute shadow-lg min-w-fit max-h-40 overflow-y-scroll bg-white border border-sheger-gray-500 rounded-md z-10"
          >
            <div
              v-for="(social, index) in socials"
              :key="index"
              class="p-3 hover:cursor-pointer hover:bg-primary/20"
              @click="selectSocialMedia(social)"
            >
              <img :src="social.icon.darkIconUrl" class="w-10" />
            </div>
          </div>
        </div>
      </div>
      <div class="">
        <HTextfield
          placeholder="url"
          name="url"
          v-model="url"
          rules="requiredN"
          type="text"
          class="rounded-none h-full shadow-none border-none"
        >
        </HTextfield>
      </div>
      <div
        class="bg-primary-600 h-full items-center flex px-7 rounded-r-lg cursor-pointer"
        @click="handleAddMedia"
      >
        <Icon name="fluent:add-12-filled" class="text-white" />
      </div>
    </div>
  </div>
</template>
