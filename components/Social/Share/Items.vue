<template>
  <div
    class="relative flex w-full cursor-pointer items-center gap-2 transition-all"
    data-cy="1fc4b2508468842e"
    @click="handleClick(item)"
  >
    <div class="relative">
      <SocialShareMemberAvatar
        :item="item"
        :show-folder="item.type === 'folder' && showFolder"
        :show-space="item.type === 'space'"
        :checked-items="checkedItems"
      >
        <BaseCheckboxStyle
          class="absolute -bottom-[0.0625rem] -right-[0.0625rem]"
          :state="
            checkedItems.find((room) => room.id === item.id)
              ? 'correctChecked'
              : 'unchecked'
          "
        />
      </SocialShareMemberAvatar>
    </div>

    <div class="flex-1 overflow-hidden">
      <div class="text-base">
        <div
          v-if="name"
          class="truncate"
          v-html="highlightKeywords(item.name || item.fullName, [name])"
        />
        <div v-else class="truncate">
          {{ item.name || item.fullName }}
        </div>
      </div>
      <div class="truncate text-xs font-medium text-[#707070]">
        <span>
          {{
            item.online || item.oneToOnePeer?.isOnline
              ? $t('base.member.online')
              : $t('base.member.offline')
          }}
        </span>
      </div>
    </div>
    <div
      v-if="['space', 'folder'].includes(item.type)"
      class="mr-1 flex size-8 flex-shrink-0 items-center justify-center rounded-5 hover:bg-white/10"
      @click.stop="onSpace(item)"
    >
      <div
        v-if="item.type === 'folder' && item.loading"
        class="mr-1 flex size-8 flex-shrink-0 items-center justify-center rounded-5 hover:bg-white/10"
      >
        <i class="fa-light fa-loader animate-spin text-base" />
      </div>
      <i
        v-else-if="!item.open"
        class="fa-regular fa-chevron-right text-white/60"
      />
      <i v-else class="fa-regular fa-chevron-up text-white/60" />
    </div>
  </div>
</template>
<script setup>
defineProps({
  item: Object,
  checkedItems: Array,
  name: String,
  showFolder: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onSpace', 'onClick']);
const onSpace = (item) => {
  emit('onSpace', item);
};

const handleClick = (item) => {
  emit('onClick', item);
};
</script>
