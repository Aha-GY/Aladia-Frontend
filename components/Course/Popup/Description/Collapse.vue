<template>
  <div
    class="group mb-4 rounded p-3 font-light transition-all"
    :class="open ? 'bg-white/5' : 'hover:bg-white/5'"
  >
    <div
      class="flex cursor-pointer items-center gap-3"
      :class="{ 'pb-2': open }"
      data-cy="6fa9a124d0fafb08"
      @click="open = !open"
    >
      <div
        class="flex size-5 items-center justify-center rounded hover:bg-white/10 group-hover:bg-white/10"
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
      {{ title }}
    </div>
    <div
      ref="scrollContainer"
      class="hide-scrollbar overflow-hidden overflow-y-auto transition-all duration-300 sm:px-8"
      :class="{
        'max-h-[72rem] py-4': open,
        'max-h-0 py-0': !open && name !== 'course',
        'max-h-[5rem] overflow-y-hidden py-4': !open && name === 'course',
      }"
    >
      <slot />
      <div
        class="mt-4 flex h-6 w-24 cursor-pointer items-center justify-center text-xs hover:bg-white/5"
        data-cy="fb68d80b36178924"
        @click="open = false"
      >
        {{ $t('course.material.read.less') }}
      </div>
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
  },
  setup() {
    const courseStore = useCourseStore();
    const scrollContainer = ref(null);
    const open = ref(true);

    watch(open, (newVal) => {
      if (!newVal && scrollContainer.value) {
        scrollContainer.value.scrollTop = 0;
      }
    });

    return { courseStore, scrollContainer, open };
  },
};
</script>
