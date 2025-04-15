<template>
  <div
    class="relative cursor-pointer rounded-md transition-all hover:bg-white/5"
    :class="open ? 'bg-white/5' : ''"
  >
    <div
      class="flex h-7 items-center gap-2 px-1 text-[#B0B0B0]"
      data-cy="a9a04b03efe852e1"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="open = !open"
    >
      <div class="flex h-5 w-9 items-center justify-center">
        <i
          class="fa-solid fa-folder transition-all"
          :class="[
            hover
              ? 'fa-chevron-right opacity-100'
              : 'fa-folder text-[#FF8D02] opacity-80',
            open ? 'fa-chevron-right rotate-90 !text-[#B0B0B0]' : '',
          ]"
        />
      </div>
      <div class="w-0 flex-1 truncate">{{ item.name }}</div>
      <BaseSwitcher
        :active="actions.includes(item.id)"
        data-cy="0f273af29d9e1da7"
        @change="change(item.id)"
        @click.stop
      />
    </div>
    <div
      class="hide-scrollbar relative flex flex-col gap-1 overflow-y-auto pl-11 transition-all duration-300"
      :class="open ? 'max-h-40 pt-1 opacity-100' : 'max-h-0 pt-0 opacity-0'"
    >
      <OrganizationHubHeaderSpaceItem
        v-for="course in item.courses"
        :key="course.id"
        :item="course"
        :actions="actions"
        :change="change"
      />
    </div>
    <OrganizationHubHeaderSpaceLine
      :length="item.courses.length"
      :class="open ? 'opacity-100' : 'opacity-0'"
    />
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
    actions: Array,
    change: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      open: false,
      hover: false,
    };
  },
};
</script>
