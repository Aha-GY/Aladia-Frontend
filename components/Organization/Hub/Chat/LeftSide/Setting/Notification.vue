<template>
  <div class="px-2.5 py-5">
    <div class="px-1.5 py-2.5 text-sm text-white/30">
      {{ $t('org.activity.message.label') }}
    </div>
    <div class="flex flex-col gap-2.5">
      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex h-9 flex-1 flex-col justify-between">
          <div
            class="text-base font-[500] leading-5 text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('org.activity.message.notification.label') }}
          </div>
          <div
            class="roup-hover/item:text-white/40 text-xs text-white/30 transition-all"
          >
            {{ $t('org.activity.message.notification.label') }}
          </div>
        </div>
        <div class="flex h-9 items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
            :class="actives.includes(1) ? 'border-white/80 opacity-100' : ''"
            data-cy="e33c4ac7569b4024"
            @click="onChange(1)"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
              :class="actives.includes(1) ? 'bg-white/80 opacity-100' : ''"
            />
          </div>
        </div>
      </div>

      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex-1">
          <div
            class="text-sm font-[500] text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('flux.watch.preview') }}
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
            :class="actives.includes(2) ? 'border-white/80 opacity-100' : ''"
            data-cy="2d07c3576e5cf46a"
            @click="onChange(2)"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
              :class="actives.includes(2) ? 'bg-white/80 opacity-100' : ''"
            />
          </div>
        </div>
      </div>

      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex-1">
          <div
            class="text-sm font-[500] text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('org.activity.message.notification.reaction') }}
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
            :class="actives.includes(3) ? 'border-white/80 opacity-100' : ''"
            data-cy="de8e9bf9336cbd16"
            @click="onChange(3)"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
              :class="actives.includes(3) ? 'bg-white/80 opacity-100' : ''"
            />
          </div>
        </div>
      </div>

      <div class="mb-1.5 mt-8 h-[1px] w-full bg-white/[0.15]" />

      <div class="px-1.5 text-sm text-white/30">
        {{ $t('personal.profile.notification.sound.plural') }}
      </div>

      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex h-9 flex-1 flex-col justify-between">
          <div
            class="text-base font-[500] leading-5 text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('personal.profile.notification.sound.singular') }}
          </div>
          <div
            class="roup-hover/item:text-white/40 text-xs text-white/30 transition-all"
          >
            {{ $t('personal.profile.notification.sound.description') }}
          </div>
        </div>
        <div class="flex h-9 items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
            :class="actives.includes(4) ? 'border-white/80 opacity-100' : ''"
            data-cy="a9545e5db77caaa8"
            @click="onChange(4)"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
              :class="actives.includes(4) ? 'bg-white/80 opacity-100' : ''"
            />
          </div>
        </div>
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
      actives: [],
    };
  },
  methods: {
    onChange(id) {
      const index = this.actives.indexOf(id);
      if (index !== -1) {
        this.actives.splice(index, 1);
      } else {
        this.actives.push(id);
      }
    },
  },
};
</script>
