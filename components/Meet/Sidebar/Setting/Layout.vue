<template>
  <div
    class="flex h-full w-full flex-col gap-2 overflow-hidden rounded-5 bg-[#0C0C0C]"
  >
    <MeetSidebarHeader :title="$t('meet.setting.layout')">
      <template #prefix>
        <div
          class="flex h-5 w-5 cursor-pointer items-center justify-center"
          @click="onBack"
        >
          <i class="fa-regular fa-arrow-left text-lg text-[#FAFAFA]" />
        </div>
      </template>
    </MeetSidebarHeader>

    <div class="flex flex-col gap-2 bg-[#0D0D0D] px-6 py-2">
      <div class="flex items-center gap-2 p-1.5">
        <div class="w-0 flex-1 truncate text-sm text-[#FAFAFA]">
          {{
            $t('meet.setting.tile.view', {
              tileCount: layout.maxTileCount,
            })
          }}
        </div>
        <el-slider
          v-model="layout.maxTileCount"
          :max="49"
          :min="1"
          class="!w-[11.25rem]"
          :show-tooltip="false"
        />
      </div>
      <BaseSwitcherList
        v-for="item in layoutList"
        :key="item.key"
        :name="$t(item.title)"
        :active="activeLayout(item.type)"
        :change="() => onLayoutChange(item.type)"
      />
    </div>
  </div>
</template>

<script>
import { hmsActions } from '~/utils/hms';

export default {
  setup() {
    const hmsStore = useHmsStore();
    return { hmsStore };
  },
  data() {
    return {
      layoutList: [
        {
          title: 'meet.layout.audio',
          key: 'Audio only mode',
          type: 'onlyAudio',
        },
        // {
        //   title: 'Hide Local Video',
        //   type: 'hideLocalVideo',
        // },
        {
          title: 'meet.layout.video',
          key: 'Mirror local video',
          type: 'mirrorLocalVideo',
        },
      ],
    };
  },
  computed: {
    layout() {
      return this.hmsStore.layout;
    },
  },
  methods: {
    onBack() {
      this.$emit('back');
    },
    activeLayout(type) {
      return this.layout[type];
    },
    onLayoutChange(type) {
      this.layout[type] = !this.layout[type];
      if (type === 'onlyAudio' && this.layout.onlyAudio) {
        if (this.hmsStore.hmsIsLocalVideoEnabled) {
          hmsActions.setLocalVideoEnabled(false);
        }
      }
    },
  },
};
</script>
