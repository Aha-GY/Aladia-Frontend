<template>
  <div
    class="group/chapter mb-2 rounded border-l bg-white/5 px-3 font-light transition-all"
  >
    <div
      class="flex cursor-pointer items-center justify-between py-3"
      @click="open = !open"
    >
      <div class="flex items-center gap-2 overflow-hidden">
        <div
          class="flex size-5 shrink-0 items-center justify-center rounded hover:bg-white/10 group-hover/chapter:bg-white/10"
        >
          <div :class="open ? '' : 'hidden group-hover/chapter:flex'">
            <i
              class="fa-solid fa-angle-right transition-all"
              :class="{ 'rotate-90': open }"
            />
          </div>
          <div :class="open ? 'hidden' : 'group-hover/chapter:hidden'">
            <i class="fa-solid fa-angle-right transition-all" />
          </div>
        </div>
        <div class="flex cursor-pointer items-center">
          {{ title }}
        </div>
      </div>
      <div class="flex items-center gap-4 pr-2 text-xs text-white/50">
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
        'max-h-[36rem] py-2': open,
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
      open: false,
    };
  },
};
</script>
