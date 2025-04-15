<template>
  <div
    class="group mb-4 rounded px-3 font-light transition-all"
    :class="open ? 'bg-white/5' : 'hover:bg-white/5'"
  >
    <div
      class="flex cursor-pointer items-center justify-between py-3"
      @click="open = !open"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <div
          class="flex size-5 shrink-0 items-center justify-center rounded"
          :class="open ? 'hover:bg-white/10' : 'group-hover:bg-white/10'"
        >
          <div :class="open ? '' : 'hidden group-hover:flex'">
            <i
              class="fa-solid fa-angle-right transition-all"
              :class="{
                'rotate-90': open,
              }"
            />
          </div>
          <div :class="open ? 'hidden' : 'group-hover:hidden'">
            <i class="fa-solid transition-all" :class="icon" />
          </div>
        </div>

        <div class="truncate text-nowrap">
          {{ title }}
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-4 pr-5 text-xs text-white/50">
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-play" />
          <div>{{ chaptersCount }} Chapters</div>
        </div>
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-play" />
          <div>{{ lecturesCount }} Lectures</div>
        </div>
        <div class="flex items-center gap-2">
          <i class="fa-regular fa-clock" />
          <div>{{ secondToTime(duration) }} Hours</div>
        </div>
      </div>
    </div>
    <div
      class="hide-scrollbar overflow-y-scroll pl-8 transition-all duration-300"
      :class="{
        'max-h-[36rem] py-4': open,
        'max-h-0 py-0': !open,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    chaptersCount: {
      type: Number,
      default: 0,
    },
    lecturesCount: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      open: true,
    };
  },
};
</script>
