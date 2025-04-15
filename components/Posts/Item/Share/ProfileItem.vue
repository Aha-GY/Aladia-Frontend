<template>
  <div
    class=":last:mb-0 translation-all mb-2 flex cursor-pointer items-center gap-2 p-[0.375rem] duration-300 hover:bg-white/5"
    @click="handleCheck(profile)"
  >
    <div class="relative">
      <PostsItemMemberAvatar
        class="h-12 w-12"
        :item="{
          ...profile,
          type: 'one-to-one',
          image: profile.picture,
        }"
        :show-folder="true"
        :show-space="true"
      />
      <BaseCheckboxStyle
        class="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-2 border-[#060606] bg-[#060606]"
        :state="
          checkedItems.find((item) => item.id === profile.id)
            ? 'correctChecked'
            : 'unchecked'
        "
      />
    </div>
    <div class="flex flex-1 flex-col truncate">
      <div class="flex items-center break-words text-base">
        <div v-if="name">
          <div
            v-html="highlightKeywords(profile.name || profile.fullName, [name])"
          />
        </div>
        <div v-else>{{ profile.name || profile.fullName }}</div>
      </div>
      <div class="truncate text-xs font-medium text-[#707070]">
        <span>
          {{
            profile.online
              ? $t('base.member.online')
              : $t('base.member.offline')
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    profile: {
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
  emits: ['check'],
  methods: {
    handleCheck(profile) {
      this.$emit('check', profile);
    },
  },
};
</script>
