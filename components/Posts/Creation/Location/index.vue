<template>
  <client-only>
    <el-popover
      placement="bottom-end"
      :show-arrow="false"
      trigger="hover"
      :teleported="false"
      popper-class="!border-[0.03125rem] !border-white/20 rounded !w-[19rem]"
      :popper-style="{
        padding: '0px !important',
        borderColor: 'transparent',
        width: '18rem',
        transform: 'translateX(250px)',
      }"
    >
      <div class="flex w-[19rem] items-center gap-5 p-4">
        <BaseGoogleMaps
          class="!size-[5.5rem] !rounded-full !border-[0.01rem] !border-black"
          :center="{
            lat: latitude,
            lng: longitude,
          }"
          :zoom="1"
          :draggable="false"
        />
        <div class="flex w-0 flex-1 flex-col gap-3 text-sm">
          <span class="line-clamp-2 text-sm font-semibold">
            {{ cityCountry }}
          </span>
          <span class="text-[rgba(217, 217, 217, 0.70)] font-normal">
            {{ $t('post.townOrCity') }}
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
        <div class="flex items-start gap-1 text-xs leading-normal">
          <span class="text-[#B0B0B0]">
            {{ isMine ? $t('post.areIn') : $t('post.isIn') }}
          </span>
          <span class="cursor-pointer underline-offset-2 hover:underline">
            {{ cityCountry }}
          </span>
        </div>
      </template>
    </el-popover>
  </client-only>
</template>
<script>
export default {
  props: {
    locationItem: {
      type: Object,
    },
    isMine: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    item() {
      return this.$props.locationItem;
    },
    cityCountry() {
      if (this.item.city !== '') {
        return `${this.item.city}, ${this.item.country}`;
      } else {
        return this.item.country;
      }
    },
    latitude() {
      return +(this.item.lat || this.item.latitude);
    },
    longitude() {
      return +(this.item.lon || this.item.longitude);
    },
    name() {
      return this.item.formattedAddress || this.item.name;
    },
  },
};
</script>
