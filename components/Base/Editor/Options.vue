<template>
  <div>
    <div class="flex items-center">
      <div
        v-if="isEnd"
        class="flex h-[1.75rem] cursor-pointer items-center rounded-l-[0.3125rem] p-1.5 text-white/80 hover:bg-white/5 hover:text-white"
        data-cy="6ccf14baa82c0a6c"
        @click.stop="scrollLeft"
      >
        <i class="fa-solid fa-angle-left text-xs" />
      </div>
      <div
        class="relative h-[1.75rem] w-[11.25rem] flex-1 overflow-x-hidden transition-all"
      >
        <div
          ref="buttonContainer"
          class="absolute top-0 flex items-center divide-x divide-[rgba(255,255,255,0.03)] overflow-x-hidden text-xs *:flex *:cursor-pointer *:items-center *:gap-0.5 *:p-1.5 *:text-white/80 hover:*:bg-white/5 hover:*:text-white"
          :class="isEnd ? 'right-0' : 'left-0'"
        >
          <div
            class="rounded-l-[0.3125rem]"
            data-cy="85bf05fb56c55ef3"
            @click.stop="$emit('copy')"
          >
            <i class="fa-solid fa-copy" />
            {{ $t('base.editor.copy') }}
          </div>
          <div data-cy="646c5722a6376a38" @click.stop="$emit('cut')">
            <i class="fa-solid fa-scissors" />
            {{ $t('base.editor.cut') }}
          </div>
          <div data-cy="ad05cd50495fb73b" @click.stop="$emit('paste')">
            <i class="fa-solid fa-paste" />
            {{ $t('base.editor.paste') }}
          </div>
          <div
            class="whitespace-nowrap"
            data-cy="566f699237036fca"
            @click.stop="$emit('select-all')"
          >
            <i class="fa-solid fa-check-double" />
            {{ $t('base.editor.selectAll') }}
          </div>
          <div
            class="rounded-r-[0.3125rem]"
            data-cy="0977c17ef1b9d289"
            @click.stop="$emit('delete')"
          >
            <i class="fa-solid fa-trash-can" />
            {{ $t('base.editor.delete') }}
          </div>
        </div>
      </div>
      <div
        v-if="!isEnd"
        class="flex h-[1.75rem] cursor-pointer items-center rounded-r-[0.3125rem] p-1.5 text-white/80 hover:bg-white/5 hover:text-white"
        data-cy="0f98a7718c05d12f"
        @click.stop="scrollRight"
      >
        <i class="fa-solid fa-angle-right text-xs" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  emits: ['copy', 'cut', 'paste', 'select-all', 'delete', 'scroll'],
  data: () => ({
    isEnd: false,
  }),
  methods: {
    scrollLeft() {
      this.isEnd = false;
      this.$emit('scroll');
    },
    scrollRight() {
      this.isEnd = true;
      this.$emit('scroll');
    },
  },
};
</script>
