<template>
  <div class="flex h-full w-full flex-col text-[#D1D1D1]">
    <BaseTable
      v-loading="loading"
      border
      :data="listData"
      class="cursor-pointer"
      row-key="id"
      @row-click="onRowClick"
    >
      <el-table-column>
        <template #header>{{ t('reviews.list.Review') }}</template>
        <template #default="scope">
          <div
            class="line-clamp-1"
            v-html="removeHtmlTags(scope.row.content)"
          />
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>{{ t('reviews.list.Course') }}</template>
        <template #default="scope">
          <div class="flex items-center">
            <img
              :src="scope.row.entity?.thumbnail?.url"
              class="h-6 w-[2.375rem] flex-shrink-0 rounded-sm object-fill"
            />
            <div class="ml-2 line-clamp-1 flex-1">
              {{ scope.row.entity?.title }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="140">
        <template #header>{{ t('reviews.list.Status') }}</template>
        <template #default="scope">
          <div class="flex items-center">
            <div
              class="h-3 w-3 rounded-full"
              :style="{
                backgroundColor:
                  scope.row.status === 'answered-by-teacher'
                    ? '#E0B92C'
                    : '#B91C1C',
              }"
            />
            <div class="ml-2.5 text-xs font-medium text-[#FAFAFA]">
              {{
                scope.row.status === 'answered-by-teacher'
                  ? t('reviews.status.options.Answered')
                  : t('reviews.status.options.NotAnswered')
              }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="110">
        <template #header>{{ t('reviews.list.Rate') }}</template>
        <template #default="scope">
          <BaseStars :value="scope.row.rating" />
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>{{ t('reviews.list.Owner') }}</template>
        <template #default="scope">
          <div class="flex items-center">
            <BaseAvatarNext
              :picture="scope.row.owner.picture"
              :online="scope.row.owner.online"
              size="sm"
            />
            <div class="ml-2 line-clamp-1">{{ scope.row.owner.name }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="110">
        <template #header>{{ t('reviews.list.Date') }}</template>
        <template #default="scope">
          <div class="flex items-center gap-3">
            {{ formatDate(scope.row.createdAt, 'DD MMM YYYY') }}
            <!-- <div
              class="flex size-6 cursor-pointer items-center justify-center rounded hover:bg-white/10"
            >
              <i class="fa-solid fa-ellipsis" />
            </div> -->
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <BaseNoData />
      </template>
    </BaseTable>
    <div
      v-if="listData.length"
      class="flex w-full items-center justify-between py-3"
    >
      <div class="text-sm text-[#707070]">
        {{
          $t('base.member.list', {
            memberList: listData.length,
            itemLength: cursorInfo.totalItems || 0,
          })
        }}
      </div>
      <BasePagination :cursor="cursorInfo" @change="onChangePagination" />
    </div>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  filter: {
    type: Object,
    default: () => ({}),
  },
  ownerId: {
    type: String,
    required: true,
  },
});
const { t } = useI18n();
const socialStore = useSocialStore();
const loading = ref(false);
const listData = ref([]);
const cursorInfo = ref({ totalItems: 0 });

const getPostsList = async (params) => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const { data, cursor } = await socialStore.searchPosts({
      limit: 10,
      type: 'review',
      ownerId: props.ownerId,
      groupBy:
        props.filter.selectType === 'received' ? 'owned-course' : undefined,
      rating: props.filter?.rating,
      startDate: props.filter.date?.startDate,
      endDate: props.filter.date?.endDate,
      courseType: props.filter.courseType?.value,
      status:
        props.filter.status?.map((item) => item.value)?.join(',') || undefined,
      filterEntityIds: props.filter.courses?.map((item) => item.id),
      ...params,
    });
    cursorInfo.value = cursor;
    listData.value = data;
  } finally {
    loading.value = false;
  }
};

const onChangePagination = (cursor) => {
  getPostsList({
    [cursor.type]: cursor.token,
  });
};

watch(
  () => props.filter,
  () => {
    listData.value = [];
    cursorInfo.value = { totalItems: 0 };
    getPostsList();
  },
  { deep: true, immediate: true },
);

const onRowClick = (row) => {
  socialStore.showPostsPopup(row);
};
</script>
