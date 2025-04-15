<template>
  <el-table
    ref="table"
    row-key="id"
    :data="courses"
    class="space-table"
    :class="`level-${level}`"
    :scrollbar-always-on="false"
    :row-class-name="tableRowClassName"
  >
    <el-table-column fixed width="300">
      <template #header>
        <div :class="level === 1 ? 'pl-12' : 'pl-[3.3rem]'">
          {{ $t('space.table.name') }}
        </div>
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseName
          :level="level"
          :folder="folder"
          :space="space"
          :course="scope.row"
        />
      </template>
    </el-table-column>
    <el-table-column fixed width="70">
      <template #header>
        {{ $t('space.table.source') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseSource :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.categories') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseCategories :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        {{ $t('space.columns.elements.type') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseType :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.status') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseStatus :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        {{ $t('space.columns.elements.language') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseLanguage :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        {{ $t('space.columns.elements.visibility') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseVisibility :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.teachers') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseTeachers :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.attendants') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseAttendants :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        {{ $t('space.columns.elements.time') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseTime :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="220">
      <template #header>
        {{ $t('space.columns.elements.duration') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseDuration :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.payment.model') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCoursePaymentModel :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        {{ $t('space.columns.elements.availability') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseAvailability :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="160">
      <template #header>
        {{ $t('space.columns.elements.price.total') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseTotalPrice :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.subscription.fee') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseSubscriptionFee :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.amount.remaining') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseRemainingAmount :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.payment.frequency') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCoursePaymentFrequency :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.billingN') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseNumbersOfBillings :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.amount.single') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseSingleBillingAmount
          :course="scope.row"
        />
      </template>
    </el-table-column>
    <el-table-column width="200">
      <template #header>
        {{ $t('space.columns.elements.license') }}
      </template>
      <template #default="scope">
        <OrganizationHubSpaceListCourseLicences :course="scope.row" />
      </template>
    </el-table-column>
    <el-table-column fixed="right" width="50">
      <template #default="scope">
        <OrganizationHubSpaceGridCourseOption
          :space="space"
          :folder="folder"
          :course="scope.row"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    level: Number,
    space: Object,
    folder: Object,
    courses: Array,
  },
  setup() {
    const authStore = useAuthStore();
    const hubSpaces = useHubSpacesStore();
    return { authStore, hubSpaces };
  },
  watch: {
    courses: {
      deep: true,
      immediate: true,
      handler() {
        this.addDataIdAttributes();
      },
    },
    'hubSpaces.isDraging'() {
      this.addDataIdAttributes();
    },
  },
  methods: {
    tableRowClassName() {
      const result = ['group/course'];
      return result.join(' ');
    },
    addDataIdAttributes() {
      this.$nextTick(() => {
        const rows = [
          ...this.$refs.table.$el.querySelectorAll('.el-table__row'),
        ];
        for (let index = 0; index < rows.length; index++) {
          const row = rows[index];
          const course = this.courses[index];
          const dataId = course.id;
          const checked = course._state === 'checked';
          const isDraging = checked && this.hubSpaces.isDraging;
          row.setAttribute('data-id', dataId);
          row.setAttribute('data-type', 'course');
          row.setAttribute('data-draging', isDraging);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.space-table {
  font-size: 12px;
  --el-table-row-hover-bg-color: #1e1e1e !important;

  &.level-0 {
    background-color: #000 !important;

    th.el-table__cell {
      background-color: #000 !important;
    }

    tr,
    td.el-table-fixed-column--left {
      background-color: #000 !important;
    }
  }

  &.level-1 {
    background-color: #0d0d0d !important;

    th.el-table__cell {
      background-color: #0d0d0d !important;
    }

    tr,
    td.el-table-fixed-column--left {
      background-color: #0d0d0d !important;
    }
  }

  .el-table__header-wrapper {
    margin-bottom: 0 !important;
  }

  th.el-table__cell {
    font-weight: normal;
    border-bottom: none !important;
  }

  td.el-table__cell {
    border-bottom: none !important;
  }

  .el-table__inner-wrapper:before {
    background-color: transparent !important;
  }

  .el-table__row[data-draging='true'] {
    opacity: 0.5 !important;
  }

  .hover-row {
    td.el-table-fixed-column--left {
      background: #1e1e1e !important;
    }
  }

  .el-scrollbar__bar {
    visibility: hidden;
    opacity: 0;
  }
}
</style>
