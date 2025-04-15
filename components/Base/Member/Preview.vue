<template>
  <div
    class="flex items-center"
    :style="{
      marginLeft: avatars.length ? `-${gap}` : '',
    }"
  >
    <div
      v-for="(member, index) in avatars"
      :key="member.id"
      :style="{
        width: width,
        height: width,
        marginLeft: index !== 0 ? `-${gap}` : '',
        zIndex: avatars.length - index,
      }"
      :class="[border ? 'border border-black' : '']"
      class="group/member relative z-10 flex shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 hover:scale-110 active:scale-100"
      data-cy="09ab8c3bb308c579"
      @click="$emit('remove', member)"
    >
      <BaseAvatar
        :online="member.online"
        :picture="member.picture"
        class="max-h-full max-w-full"
        size="sm"
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
        width: width,
        height: width,
        marginLeft: `-${gap}`,
      }"
      class="relative flex shrink-0 items-center justify-center rounded-full border border-black bg-black text-xs"
    >
      +{{ more }}
    </div>
    <div
      v-if="add"
      class="group relative z-0 flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed text-xs transition-all duration-300 active:scale-95"
      :class="
        open
          ? 'scale-110 border-white bg-[#131313]'
          : 'border-white/50 bg-black hover:scale-110 hover:border-white'
      "
      :style="{
        width: width,
        height: width,
        marginLeft: more > 0 ? '' : `-${gap}`,
      }"
      @click="$emit('open')"
    >
      <BaseRipple>
        <i
          class="fa-solid fa-user-plus transition-all duration-300"
          :class="[
            open ? 'opacity-100' : 'opacity-50 group-hover:opacity-100',
            addIconSizeClass,
          ]"
        />
      </BaseRipple>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: '1.75rem',
    },
    border: {
      type: Boolean,
      default: false,
    },
    members: {
      type: Array,
      default: () => [],
    },
    max: {
      type: Number,
      default: 4,
    },
    total: {
      type: Number,
      default: 0,
    },
    gap: {
      type: String,
      default: '0.75rem',
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
    online: {
      type: Boolean,
      default: false,
    },
    addIconSizeClass: {
      type: String,
      default: 'text-sm',
    },
  },
  computed: {
    avatars() {
      return this.members.slice(0, this.max);
    },
    more() {
      return (this.total || this.members.length) - this.max;
    },
  },
};
</script>
