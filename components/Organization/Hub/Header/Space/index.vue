<template>
  <div
    class="rounded-md p-2 transition-all hover:bg-[#101010]"
    :class="open ? 'bg-[#101010]' : ''"
  >
    <div
      class="flex h-7 cursor-pointer items-center gap-2 px-1 text-[#B0B0B0]"
      data-cy="18c6140aaf810d2c"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
      @click="open = !open"
    >
      <div class="flex h-5 w-9 items-center justify-center">
        <i
          class="transition-all"
          :class="[
            open ? 'fa-solid rotate-90' : 'fa-light',
            hover
              ? 'fa-chevron-right fa-solid opacity-100'
              : 'fa-hexagon fa-light opacity-80',
          ]"
        />
      </div>
      <div class="w-0 flex-1 truncate">{{ item.name }}</div>
      <BaseSwitcher
        :active="actions.includes(item.id)"
        data-cy="19c56715ca26091a"
        @change="change(item.id)"
        @click.stop
      />
    </div>

    <div
      class="hide-scrollbar -mx-1 flex flex-col gap-2 overflow-y-auto px-1 transition-all duration-300"
      :class="open ? 'max-h-96 py-1 opacity-100' : 'max-h-0 pt-0 opacity-0'"
    >
      <template v-for="children in item.children" :key="children.id">
        <OrganizationHubHeaderSpaceFolders
          v-if="children.isFolder"
          :item="children"
          :actions="actions"
          :change="change"
        />
        <OrganizationHubHeaderSpaceItem
          v-else
          :item="children"
          :actions="actions"
          :change="change"
        />
      </template>
    </div>
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
      open: true,
      hover: false,
    };
  },
};
</script>
