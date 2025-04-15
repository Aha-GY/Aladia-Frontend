<template>
  <div v-if="show" class="mb-4 rounded-md bg-black px-4 py-4">
    <div
      class="flex items-center justify-between rounded-md px-4 py-1.5 hover:bg-[#101010]"
    >
      <div class="flex items-center gap-3">
        <BaseIconClose @click="onClose" />
        <div>
          <p class="text-base font-medium">
            {{ label }}
          </p>
          <p class="text-sm text-white/40">
            {{ title }}
          </p>
        </div>
      </div>
      <div
        class="px-2 py-1 text-sm hover:cursor-pointer hover:rounded-md hover:bg-[#06060666]/40"
        @click="onUndo"
      >
        {{ undoText }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    undoText: {
      type: String,
      default: 'Undo',
    },
  },
  emits: ['undo'],
  data() {
    return {
      show: true,
    };
  },
  methods: {
    onUndo() {
      this.$emit('undo');
    },
    onClose() {
      this.show = false;
    },
  },
};
</script>
