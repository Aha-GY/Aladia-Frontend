<template>
  <div
    v-if="data?.country"
    class="flex items-center text-xs font-medium text-[#707070]"
  >
    <div>
      <i class="fa-regular fa-location-dot pr-1.5" />
      <span v-if="data.city || data.state">
        {{ data.city || data.state }}
        <span class="px-1">|</span>
      </span>
      <span>
        {{ data.country }}
      </span>
    </div>
    <div
      v-if="data.lat"
      class="ml-3 cursor-pointer rounded-5 p-1.5 hover:bg-white/5"
      @click.stop="onClickMap()"
    >
      <i class="fa-regular fa-map hover:font-black" />
    </div>
  </div>
</template>
<script setup>
import { profileEvent } from '~/constant/eventBus';

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
    required: true,
  },
});
const { $eventBus } = useNuxtApp();
const onClickMap = () => {
  $eventBus.emit(profileEvent.SHOW_USER_ON_MAP, props.data);
};
</script>
