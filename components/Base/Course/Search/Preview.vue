<template>
  <div
    class="flex items-center"
    :style="{
      marginLeft: showCourses.length ? `-${gap}` : '',
    }"
  >
    <div
      v-for="(course, index) in showCourses"
      :key="course.id"
      :style="{
        marginLeft: index !== 0 ? `-${gap}` : '',
        zIndex: showCourses.length - index,
      }"
      class="group/member relative z-10 w-[2.375rem] shrink-0 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-100"
      @click="$emit('remove', course)"
    >
      <BaseCourseThumbnail
        class="h-6 w-[2.375rem]"
        :url="course.thumbnailUrl"
      />
      <div
        v-if="remove"
        class="absolute -right-0.5 -top-[1px] flex h-3 w-3 items-center justify-center rounded-full bg-red-600 opacity-0 transition-all duration-300 hover:rotate-180 group-hover/member:opacity-100"
      >
        <i class="fa-light fa-xmark text-8" />
      </div>
    </div>
    <div
      v-if="more > 0"
      :style="{
        marginLeft: `-${gap}`,
      }"
      class="relative flex w-6 shrink-0 items-center justify-center rounded-full border border-black bg-black text-xs"
    >
      +{{ more }}
    </div>
    <div
      v-if="add"
      class="group relative z-0 flex h-[1.875rem] w-[1.875rem] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed text-xs transition-all duration-300 active:scale-95"
      :class="
        open
          ? 'scale-110 border-white bg-[#131313]'
          : 'border-white/50 bg-black hover:scale-110 hover:border-white'
      "
      :style="{
        marginLeft: more > 0 ? '' : `-${gap}`,
      }"
      @click="$emit('open')"
    >
      <BaseRipple>
        <i
          class="fa-solid fa-rectangle-history-circle-plus text-base transition-all duration-300"
          :class="open ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'"
        />
      </BaseRipple>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  courses: {
    type: Array,
    default: () => [],
  },
  max: {
    type: Number,
    default: 5,
  },
  total: {
    type: Number,
    default: 0,
  },
  gap: {
    type: String,
    default: '0.25rem',
  },
  open: {
    type: Boolean,
    default: false,
  },
  add: {
    type: Boolean,
    default: false,
  },
  remove: {
    type: Boolean,
    default: false,
  },
});

const showCourses = computed(() => props.courses.slice(0, props.max));
const more = computed(() => (props.total || props.courses.length) - props.max);
</script>
