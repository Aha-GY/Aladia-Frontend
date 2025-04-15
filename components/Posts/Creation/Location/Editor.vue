<template>
  <div class="__posts-creation-location-editor relative">
    <BaseGoogleMaps
      class="!rounded-[0.3125rem]"
      :center="{
        lat: latitude,
        lng: longitude,
      }"
      :class="height"
      :draggable="false"
      :zoom="12"
    />

    <div v-if="isClosable" class="absolute right-2 top-2">
      <div
        class="flex size-6 cursor-pointer items-center justify-center rounded-5 bg-[#E0B92C]"
        @click="close"
      >
        <i class="fa-regular fa-close text-xs text-black" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    locationItem: {
      type: Object,
    },
    isClosable: {
      type: Boolean,
      default: true,
    },
    height: {
      type: String,
      default: '!h-[13rem]',
    },
  },
  computed: {
    longitude() {
      return +(this.locationItem.lon || this.locationItem.longitude);
    },
    latitude() {
      return +(this.locationItem.lat || this.locationItem.latitude);
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
