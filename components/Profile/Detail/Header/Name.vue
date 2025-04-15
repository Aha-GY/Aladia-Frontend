<template>
  <div class="mt-3 flex h-10 items-center justify-between">
    <div class="flex items-center gap-2">
      <div
        class="max-w-[26.5625rem] truncate text-3xl font-bold text-white"
        data-cy="full-name-profile-detail"
      >
        {{ detail.fullName || detail.name || $t('personal.name.label') }}
      </div>
      <ProfileStatus :detail="detail" />
    </div>

    <div class="flex items-center gap-2 pr-2">
      <template v-for="(item, index) in showSocialLinks" :key="index">
        <el-popover
          trigger="hover"
          :show-arrow="false"
          placement="bottom-end"
          :popper-style="{
            width: 'auto',
          }"
        >
          <template #reference>
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-black transition-all hover:bg-white/10"
              @click="openLink(item.url)"
            >
              <div v-html="renderIcon(item.platform)" />
            </div>
          </template>
          <div class="flex max-w-60 flex-col">
            <div
              class="flex cursor-pointer items-center rounded-md px-3 py-3 transition-all hover:bg-white/10"
              @click="openLink(item.url)"
            >
              <div v-html="renderIcon(item.platform)" />
              <div class="ml-3 truncate">{{ item.displayText }}</div>
            </div>
          </div>
        </el-popover>
      </template>

      <el-popover
        v-if="filterSocialList.length"
        trigger="hover"
        :show-arrow="false"
        placement="bottom-end"
        :popper-style="{
          width: 'auto',
        }"
      >
        <template #reference>
          <div
            v-if="filterSocialList.length"
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-black transition-all hover:bg-white/10"
          >
            +{{ filterSocialList.length }}
          </div>
        </template>
        <div class="flex max-h-[25rem] max-w-60 flex-col overflow-y-auto">
          <div
            v-for="(item, index) in filterSocialList"
            :key="index"
            class="flex cursor-pointer items-center rounded-md px-3 py-3 transition-all hover:bg-white/10"
            data-cy="7032c8f7fcb5bafc"
            @click="openLink(item.url)"
          >
            <div v-html="renderIcon(item.platform)" />
            <div class="ml-3 truncate">{{ item.displayText }}</div>
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script setup>
import { getOrgSocialLinks } from '~/api/v2/org';
import { getSocialLinks } from '~/api/v2/profile';
import { renderIcon } from '~/utils/renderIcon';

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const profileStore = useProfileStore();
const totalSocialLinks = ref([]);
const showSocialLinks = ref([]);

const isMe = computed(
  () => profileStore.myProfileDetail.id === props.detail.id,
);
const filterSocialList = computed(() => {
  const totalLinks = isMe.value
    ? totalSocialLinks.value
    : totalSocialLinks.value.filter((item) => item.show);
  return totalLinks;
});

watch(
  () => props.detail,
  async () => {
    if (props.detail.id) {
      const { data } =
        props.detail.entityType === 'organization'
          ? await getOrgSocialLinks(props.detail.id)
          : await getSocialLinks(props.detail.id);
      totalSocialLinks.value = [];
      showSocialLinks.value = [];
      data?.forEach((item) => {
        if (item.show && showSocialLinks.value.length < 4) {
          showSocialLinks.value.push(item);
        } else {
          totalSocialLinks.value.push(item);
        }
      });
    }
  },
  { immediate: true },
);
</script>
