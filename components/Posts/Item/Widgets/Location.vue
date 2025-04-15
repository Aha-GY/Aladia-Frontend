<!-- 用于在 Post Carousel 中展示位置信息 -->

<template>
  <BaseGoogleMaps
    :center="{
      lat: latitude,
      lng: longitude,
    }"
    :draggable="false"
    :zoom="12"
  />
</template>

<script>
export default {
  props: {
    locationItem: {
      type: Object,
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
};
</script>
