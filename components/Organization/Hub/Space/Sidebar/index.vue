<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 overflow-hidden bg-white/10"
      data-cy="9bc4f5de3dc7a83a"
      @click.self="$emit('close')"
    >
      <div
        class="absolute bottom-0 top-0 z-50 flex flex-col bg-black p-4 pt-4 font-light transition-all duration-300"
        :style="{
          width: width,
          right: animation ? '0px' : `-${width}`,
        }"
      >
        <div class="mb-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div
              class="flex size-6 cursor-pointer items-center justify-center rounded bg-black text-white/70 hover:bg-[#131313] hover:text-white"
              data-cy="855d6c75749e629d"
              @click="$emit('close')"
            >
              <i class="fa-light fa-xmark text-sm" />
            </div>
            {{ $t(title) }}
          </div>
        </div>
        <div
          class="hide-scrollbar h-0 w-full flex-1 overflow-y-auto overflow-x-hidden py-1 pr-1"
        >
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    title: String,
    type: String,
    width: {
      type: String,
      default: '20rem',
    },
  },
  emits: ['close'],
  data() {
    return {
      animation: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
  },
};
</script>
