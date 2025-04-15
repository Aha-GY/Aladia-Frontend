<template>
  <div
    class=":last:mb-0 translation-all mb-2 flex cursor-pointer items-center gap-2 p-[0.375rem] duration-300 hover:bg-white/5"
    @click="handleCheck(room)"
  >
    <div class="relative">
      <PostsItemMemberAvatar
        class="h-12 w-12"
        :item="room"
        :show-folder="true"
        :show-space="true"
      />
      <BaseCheckboxStyle
        class="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-[#060606] bg-[#060606]"
        :state="
          checkedItems.find((item) => item.id === room.id)
            ? 'correctChecked'
            : 'unchecked'
        "
      />
    </div>
    <div class="flex flex-1 flex-col truncate">
      <div class="flex items-center break-words text-base">
        <div v-if="name">
          <div v-html="highlightKeywords(room.name, [name])" />
        </div>
        <div v-else>{{ room.name }}</div>
      </div>
      <div class="truncate text-xs font-medium text-[#707070]">
        <template v-if="room.type === 'one-to-one'">
          <span>
            {{
              room.oneToOnePeer.isOnline
                ? $t('base.member.online')
                : $t('base.member.offline')
            }}
          </span>
        </template>
        <template v-else>
          <span>
            {{
              $t('post.record.member.label', {
                count: room.member,
              })
            }}
          </span>
        </template>
      </div>
    </div>
    <div
      v-if="['space', 'folder'].includes(room.type)"
      class="mr-1 flex size-8 flex-shrink-0 items-center justify-center rounded-5 hover:bg-white/10"
      @click.stop="() => onSpace(room)"
    >
      <i class="fa-regular fa-chevron-right text-white/60" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      required: true,
    },
    checkedItems: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: '',
    },
  },
  emits: ['check', 'space'],
  methods: {
    handleCheck(room) {
      this.$emit('check', room);
    },
    onSpace(room) {
      this.$emit('space', room);
    },
  },
};
</script>
