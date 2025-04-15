<template>
  <div
    class="absolute bottom-8 flex w-full justify-center rounded-5 text-white/80"
  >
    <div
      v-if="checkedIds.length > 0"
      class="bottom-10 flex w-[80%] justify-between rounded-5 bg-[#0c0c0c] p-2"
    >
      <div class="flex items-center gap-2 text-sm">
        {{ checkedIds.length }}
        <span>Media selected</span>
        <div
          class="group/close flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 text-white/80 transition-all hover:bg-white/5 active:scale-95"
          @click="onCancel"
        >
          <i
            class="fa-regular fa-circle-xmark text-base transition-all group-hover/close:rotate-180"
          />
        </div>
      </div>
      <div class="flex items-center gap-4">
        <BaseButton
          type="tertiary"
          icon="fa-regular fa-share"
          class="flex h-8 w-8 justify-center text-white"
          @click="() => onForward()"
        />
        <BaseButton
          type="error"
          icon="fa-regular fa-trash"
          class="flex h-8 w-8 justify-center !bg-[#3A0909] text-white/80 hover:!bg-[#3A0909]/80"
          :loading="loading"
          @click="deleteCheckeds"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    checkedIds: Array,
    onCancel: Function,
    onDelete: Function,
    onForward: Function,
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async deleteCheckeds() {
      this.loading = true;
      await this.onDelete();
      this.loading = false;
    },
    async forwardCheckeds() {
      // this.loading = true;
      // await this.onForward(this.checkedIds);
      // this.loading = false;
    },
  },
};
</script>
