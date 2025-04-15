<template>
  <el-tooltip
    :disabled="!disabled"
    effect="light"
    content="Lesson blocked due to failed payment"
    placement="right"
  >
    <div
      class="absolute inset-0 flex items-center justify-center transition-all duration-500"
      :class="active ? 'opacity-0' : 'opacity-100'"
    >
      <div
        ref="icon-box"
        class="absolute right-0 top-0 z-10 flex items-center justify-center bg-white/20 text-lg shadow backdrop-blur transition-all duration-300"
        :class="
          isLectureHover
            ? isLectureClick
              ? 'h-7 w-7 -translate-x-8 translate-y-[0.8rem] rounded-full'
              : 'h-full w-full rounded'
            : 'h-6 w-6 rounded-bl rounded-tr'
        "
      >
        <i
          v-if="!active && !disabled"
          class="fa-solid fa-play text-violet-600 transition-all duration-300"
          :class="isLectureHover ? '-mt-4 text-xl' : 'text-base'"
        />
        <i
          v-if="disabled"
          ref="lock-icon"
          class="fa-solid fa-lock transition-all duration-300"
          :class="isLectureHover ? 'text-sm' : 'text-xs'"
        />
      </div>
      <div
        v-if="!active && !disabled"
        class="absolute bottom-0 left-0 right-0 top-0 z-10 -mb-4 flex scale-90 items-center justify-center whitespace-nowrap text-xs font-bold transition-all duration-300"
        :class="isLectureHover ? 'opacity-100' : 'opacity-0'"
      >
        {{ $t('course.watch') }}
      </div>
      <div
        v-if="disabled && !isLectureClick"
        class="absolute bottom-0 left-0 right-0 top-0 z-10 -mb-9 flex scale-90 items-center justify-center whitespace-nowrap text-xs font-bold transition-all duration-300"
        :class="isLectureHover ? 'opacity-100' : 'opacity-0'"
      >
        {{ $t('course.membership.buy.unlock') }}
      </div>
    </div>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    isLectureHover: {
      type: Boolean,
      required: true,
    },
    isLectureClick: {
      type: Boolean,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
  },
};
</script>
