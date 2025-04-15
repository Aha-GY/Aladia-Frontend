<template>
  <div
    class="flex h-[17.125rem] w-full flex-col overflow-hidden rounded-[0.625rem] bg-[#1e1e1e]"
  >
    <div
      class="flex-1 bg-cover bg-center"
      :style="{
        backgroundImage: `url(${item.cover})`,
      }"
    >
      <!-- body -->
      <div class="flex w-full items-center justify-between p-4">
        <!-- avatar -->
        <div class="flex w-[8rem] items-center justify-center">
          <BaseAvatarNext
            :picture="item.picture"
            :story="item?.story"
            :user-id="item?.id"
            :online="item.online"
            size="lg"
          />
        </div>
        <!-- right content -->
        <div
          class="h-[11.875rem] flex-1 gap-6 rounded-[0.625rem] bg-[#060606]/60 p-4 shadow-[0.125rem_0.125rem_1.25rem_0rem_rgba(0,0,0,0.60)] backdrop-blur-[6.25rem]"
        >
          <!-- name and status -->
          <div class="flex items-center gap-2">
            <div
              class="line-clamp-1 max-w-[80%] text-xl font-medium text-neutral-50"
            >
              {{ item.fullName }}
            </div>
            <ProfileStatus :detail="item" />
          </div>
          <!-- bio -->
          <div class="h-6 font-['Inter'] text-base font-normal text-[#989898]">
            <span v-if="!item.bio">---</span>
            <BaseEditorRenderContent :content="item.bio" />
          </div>
          <!-- skill and follow chat -->
          <div class="mt-2.5 flex w-full items-center justify-between">
            <div class="flex cursor-pointer items-center gap-4">
              <div
                v-for="(item, index) in skillList.slice(0, 4)"
                :key="index"
                class="inline-flex h-8 items-center rounded-[5px] bg-white/10 px-2 py-1 text-base font-medium text-neutral-50"
              >
                {{ item.label }}
              </div>
              <div
                v-if="skillList.length > 4"
                class="inline-flex h-8 items-center rounded-[5px] bg-white/10 px-2 py-1 text-base font-medium text-neutral-50"
              >
                +{{ skillList.length - 4 }}
              </div>
            </div>
            <FollowChat :detail="item" />
          </div>
          <!-- job info -->
          <div class="mt-4 flex w-full items-center justify-between">
            <div
              class="flex items-center gap-4 text-base font-medium text-[#989898]"
            >
              <div>
                <i class="fa-regular fa-briefcase mr-1.5 text-[#d1d1d1]" />
                <span>
                  {{ item.mainExperience?.name }} |
                  {{ item.mainExperience?.authority }}
                </span>
              </div>
              <div>
                <i class="fa-regular fa-calendar mr-1.5 text-[#d1d1d1]" />
                <span>
                  {{ formatDate(item.mainExperience?.startDate, 'MMM YYYY') }}
                  -
                  {{
                    item.mainExperience?.endDate
                      ? formatDate(item.mainExperience?.endDate, 'MMM YYYY')
                      : t('personal.now')
                  }}
                </span>
              </div>
              <div>
                <i class="fa-regular fa-location-dot mr-1.5 text-[#d1d1d1]" />
                <span>
                  {{ item.address?.city || item.address?.state || '--' }}
                  <span v-if="item.address?.country">
                    | {{ item.address?.country }}
                  </span>
                </span>
              </div>
            </div>
            <!-- following list -->
            <div class="flex items-center gap-4">
              <div class="mr-2 text-base text-white">
                <span class="mr-2 font-semibold">
                  {{ item.numberOf?.followers }}
                </span>
                <span>Mutual Followers</span>
              </div>
              <BaseMemberPreview
                :members="[1, 2, 3, 4, 5, 6, 7]"
                :total="item.numberOf?.followers"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- footer -->
    <div class="flex h-12 w-full items-center justify-end bg-[#1b1b1b] px-4">
      222
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});
const { t } = useI18n();
const skillList = ref([
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
  { label: 'Design Thinking' },
]);
</script>
