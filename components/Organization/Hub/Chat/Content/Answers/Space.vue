<template>
  <div class="relative flex flex-col gap-1.5 overflow-hidden rounded-md">
    <div class="absolute left-0 top-0 h-full w-[1px] bg-white/20" />
    <div
      v-for="item in dataList"
      :key="item.id"
      class="flex items-center gap-1.5 rounded-md p-1.5 hover:bg-white/5"
    >
      <div class="h-8 w-8 rounded-md bg-white/70" />
      <div class="flex w-0 flex-1 flex-col justify-between gap-1">
        <div class="text-sm font-medium leading-none text-white/70">
          {{ item.name }}
        </div>
        <div class="flex items-center text-sm leading-none">
          <div class="text-white/50">
            {{ $t('org.space.teacher') }}
          </div>
          <div class="text-white/30">{{ item.message }}</div>
        </div>
      </div>
      <div class="flex h-full items-center">
        <div class="h-2.5 w-2.5 rounded-full bg-[#FFE072]" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      dataList: [
        { id: 1, name: 'Computer 3D', message: 'last message preview' },
        {
          id: 2,
          name: 'Physics Of Materials',
          message: 'last message preview',
        },
        { id: 3, name: 'Technical Drawing', message: 'last message preview' },
      ],
    };
  },
};
</script>
