<template>
  <div class="relative flex items-center gap-4 font-light">
    <div class="flex w-5 justify-center">
      <i class="fa-light fa-location-dot text-base text-white/20" />
    </div>
    <div class="flex flex-1 items-center">
      <el-popover
        v-model:visible="show"
        trigger="click"
        :show-arrow="false"
        :width="388"
        :teleported="false"
      >
        <template #reference>
          <BaseInput
            v-model="onPremise.address"
            fixed
            :placeholder="$t('org.calendar.event.location')"
            @keydown.space.stop
          />
        </template>
        <ProfileAddress :address="onPremise.address" @change="onChange" />
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const hubEvent = useHubEventStore();
    return { hubEvent };
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    event() {
      return this.hubEvent.event;
    },
    onPremise() {
      return this.event.onPremise;
    },
  },
  methods: {
    onChange(item) {
      this.onPremise.address = item.formattedAddress;
      this.show = false;
    },
  },
};
</script>
