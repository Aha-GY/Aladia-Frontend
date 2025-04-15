<template>
  <client-only>
    <el-popover
      placement="bottom-end"
      :show-arrow="false"
      trigger="hover"
      :teleported="false"
      popper-class="!border-[0.03125rem] !border-white/20 rounded !w-[19rem]"
    >
      <div class="flex w-[19rem] items-center gap-5 p-4">
        <BaseGoogleMaps
          class="!size-[5.5rem] !rounded-full !border-[0.01rem] !border-black"
          :center="{
            lat: latitude || 0,
            lng: longitude || 0,
          }"
          :zoom="1"
          :draggable="false"
        />
        <div class="flex w-0 flex-1 flex-col gap-3 text-sm">
          <span class="line-clamp-2 text-sm font-semibold">
            {{ cityCountry }}
          </span>
          <div class="flex gap-2 text-xs font-light text-white/95">
            <i class="fa-solid fa-location-dot mt-1" />
            <a
              :href="
                'https://www.google.com/maps?q=' + latitude + ',' + longitude
              "
              target="_blank"
              class="line-clamp-2 underline-offset-2 hover:underline"
            >
              {{ name }}
            </a>
          </div>
        </div>
      </div>
      <template #reference>
        <slot />
      </template>
    </el-popover>
  </client-only>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    cityCountry() {
      if (this.item?.city || this.item?.state) {
        return `${this.item.city || this.item.state}, ${this.item.country}`;
      } else {
        return this.item?.country;
      }
    },
    latitude() {
      return +(this.item?.lat || this.item?.latitude);
    },
    longitude() {
      return +(this.item?.lon || this.item?.longitude);
    },
    name() {
      return this.item?.formattedAddress || this.item?.name;
    },
  },
};
</script>
