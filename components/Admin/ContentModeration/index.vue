<template>
  <div class="mb-36 px-8 pt-4">
    <el-table
      ref="table"
      v-loading="loading"
      border
      :data="moderation.data"
      class-name="min-h-96 w-full"
      @expand-change="handleExpand"
    >
      <el-table-column type="expand">
        <template #default="scope">
          <div class="w-3/5 p-4">
            <el-table
              v-loading="loading"
              border
              :data="scope.row._tableList"
              class-name="mb-4"
            >
              <el-table-column
                prop="id"
                :label="$t('admin.content.type')"
                width="100"
              >
                <template #default="scope">
                  {{ scope.row.entity.type }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('admin.content.label')" width="300">
                <template #default="scope">
                  <div v-if="scope.row.entity.type === 'video'">
                    <video
                      ref="video"
                      :src="scope.row.fileUrl.url"
                      class="h-full w-full overflow-hidden rounded-t-md object-cover"
                      :loop="false"
                      :autoplay="false"
                      :controls="true"
                    />
                  </div>
                  <div v-if="scope.row.entity.type === 'image'">
                    <img
                      v-if="scope.row.fileUrl.url"
                      :src="scope.row.fileUrl.url"
                      class="h-8 rounded object-cover"
                    />
                  </div>
                  <div v-if="scope.row.entity.type === 'text'">
                    {{ scope.row.textContent }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('admin.content.entity.type')"
                width="150"
              >
                <template #default="scope">
                  {{ scope.row.entity.moderationEvent.entityType }}
                </template>
              </el-table-column>
              <el-table-column :label="$t('admin.content.entity.id')">
                <template #default="scope">{{ scope.row.entity.id }}</template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        :label="$t('admin.content.header.id')"
        width="300"
      />
      <el-table-column
        prop="email"
        :label="$t('admin.content.header.email')"
        width="300"
      />

      <el-table-column align="right">
        <template #default="scope">
          <el-button
            size="small"
            type="danger"
            data-cy="6d9f77105932be8d"
            @click="handleUnblock(scope.row)"
          >
            {{ $t('admin.content.unblock') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-end border-t border-white/20 pt-4">
      <BasePagination :cursor="moderation.cursor" @change="onChange" />
    </div>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';

export default {
  setup() {
    const adminStore = useAdminStore();
    return { adminStore };
  },
  data() {
    return {
      loading: true,

      moderation: {
        cursor: null,
        data: [],
        histogram: null,
      },
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    async load(params = {}) {
      this.loading = true;
      this.moderation = await this.adminStore.getContentModeration({
        limit: 10,
        ...params,
      });
      this.loading = false;
    },
    onChange({ type, token }) {
      this.load({
        [type]: token,
      });
    },
    async handleUnblock(row) {
      await ElMessageBox.confirm(`Unblock ${row.email}`, {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonText: 'No',
      });
      this.loading = true;
      await this.adminStore.unblockUser({
        id: row.id,
      });
      await this.load();
    },
    async handleExpand(row, expanded) {
      const target = expanded.find((item) => item.id === row.id);
      if (target) {
        const { data } =
          await this.adminStore.getListAllModerationsContentGivenUser({
            profileId: target.id,
            sortDirection: 'desc',
          });
        if (target._tableList.length === 0) {
          target._tableList.push(...data);
        }
        setTimeout(() => {
          this.$refs.table.toggleRowExpansion(row, true);
        }, 1);
      }
    },
  },
};
</script>
