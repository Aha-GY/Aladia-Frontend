<template>
  <div class="flex h-full w-full flex-col text-[#D1D1D1]">
    <BaseTable
      v-loading="loading"
      border
      :data="listData"
      class="w-full cursor-pointer"
      row-key="id"
      @row-click="onRowClick"
    >
      <el-table-column>
        <template #header>{{ t('qa.list.Content') }}</template>
        <template #default="scope">
          <div
            class="line-clamp-1"
            v-html="removeHtmlTags(scope.row.content)"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          ['bought-courses', 'created-courses'].includes(props.filter?.menuType)
        "
      >
        <template #header>{{ t('qa.list.Course') }}</template>
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
      <el-table-column>
        <template #header>{{ t('qa.list.QuestionOn') }}</template>
        <template #default="scope">
          <div class="flex items-center">
            {{ handleQuestionOn(scope.row.entity) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="150">
        <template #header>{{ t('qa.list.Status') }}</template>
        <template #default="scope">
          <div class="flex items-center">
            <div
              class="h-3 w-3 rounded-full"
              :style="{
                backgroundColor: statusOptions.find(
                  (item) => item.key === scope.row.status,
                )?.color,
              }"
            />
            <div class="ml-2.5 text-xs font-medium text-[#FAFAFA]">
              {{
                statusOptions.find((item) => item.key === scope.row.status)
                  ?.name
              }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template #header>{{ t('qa.list.Owner') }}</template>
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
  statusOptions: {
    type: Array,
    default: () => [],
  },
});
const { t } = useI18n();
const socialStore = useSocialStore();
const loading = ref(false);
const listData = ref([]);
const cursorInfo = ref({ totalItems: 0 });

const groupBy = computed(() => {
  let value = undefined;
  if (
    (props.filter.selectType === 'posted' ||
      props.filter.selectType === 'answered-by-me') &&
    props.filter.menuType === 'feed'
  ) {
    value = 'feed';
  }
  if (
    (props.filter.selectType === 'posted' ||
      props.filter.selectType === 'answered-by-me') &&
    props.filter.menuType === 'bought-courses'
  ) {
    value = 'purchased-course';
  }
  if (props.filter.selectType === 'received') {
    value = 'owned-course';
  }
  return value;
});
const filter = computed(() => {
  let value = undefined;
  if (props.filter.selectType === 'received') {
    value = 'community-question';
  }
  if (props.filter.selectType === 'answered-by-me') {
    value = 'answered-by-me';
  }
  return value;
});

const handleQuestionOn = (entity) => {
  if (entity?.type === 'lecture') {
    return `${t('course.index.chapter', { index: entity.chapterIndex + 1 })} - ${t('course.index.lecture', { index: entity.lectureIndex + 1 })}`;
  } else {
    return entity?.title || 'General';
  }
};

const getPostsList = async (params) => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    const { data, cursor } = await socialStore.searchPosts({
      limit: 10,
      type: 'question',
      filterEntityIds:
        props.filter.menuType === 'feed'
          ? props.filter.categorys?.map((item) => item.id)
          : props.filter.courses?.map((item) => item.id),
      ownerId: props.ownerId,
      groupBy: groupBy.value,
      filter: filter.value,
      startDate: props.filter.date?.startDate,
      endDate: props.filter.date?.endDate,
      status: props.filter.status || undefined,
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
