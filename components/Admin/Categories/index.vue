<template>
  <div class="mb-36 px-8 pt-4">
    <div class="mb-4 flex items-center gap-4">
      <BaseButton data-cy="cc91151ff0c2d249" @click="categoryPopup = true">
        <i class="fa-solid fa-plus" />
        {{ $t('category.add.all') }}
      </BaseButton>
      <div v-if="categories.cursor" class="text-xs text-white/50">
        {{ categories.cursor?.totalItems }} {{ $t('category.name.lower') }}
      </div>
    </div>
    <el-table
      v-loading="loading"
      border
      :data="categories.data"
      class-name="min-h-96 w-full mb-4"
    >
      <el-table-column type="expand">
        <template #default="props">
          <AdminCategoriesSub :parent="props.row" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('category.name.upper')"
        width="200"
      />
      <el-table-column :label="$t('base.icon.title')" width="110">
        <template #default="scope">
          <BaseCourseThumbnail class="h-12" :url="scope.row.image?.url" />
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button
            size="small"
            data-cy="bec8b0aad39fcf62"
            @click="handleCategoryEdit(scope.row)"
          >
            {{ $t('base.editor.edit') }}
          </el-button>
          <el-button
            size="small"
            type="danger"
            data-cy="6d9f77105932be8d"
            @click="handleCategoryDelete(scope.row)"
          >
            {{ $t('base.editor.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-end">
      <BasePagination :cursor="categories.cursor" @change="onChange" />
    </div>
    <el-dialog
      v-model="categoryPopup"
      append-to-body
      :show-close="false"
      width="500"
    >
      <div class="flex flex-col">
        <div
          class="flex items-center justify-between rounded-t-sm bg-white/5 p-3"
        >
          <div class="flex items-center gap-2 text-lg">
            {{ $t('category.name.upper') }}
          </div>
          <BaseIconClose
            data-cy="45f32f027e930e93"
            @click="categoryPopup = false"
          />
        </div>
        <div class="flex flex-col gap-5 p-3">
          <div>
            <div class="mb-2 text-sm text-white">
              {{ $t('category.form.name.label') }}:
            </div>
            <el-input
              v-model="category.name"
              :placeholder="$t('category.input.hint.full')"
            />
          </div>
          <div>
            <div class="mb-2 text-sm text-white">
              {{ $t('base.icon.title') }}:
            </div>
            <div class="mb-2 flex items-center gap-2">
              <BaseButton
                class="inline-flex"
                data-cy="aa86bc4e1e0cf0ec"
                @click="open"
              >
                <i class="fa-solid fa-cloud-arrow-up" />
                {{ $t('base.icon.add') }}
              </BaseButton>
              <div v-if="files?.[0]" class="max-w-48 truncate">
                {{ files[0].name }}
              </div>
              <div v-else-if="category?.image" class="max-w-48 truncate">
                {{ category.image?.metadata?.name }}
              </div>
            </div>
            <div class="text-xs text-red-600">
              {{ $t('category.size') }} 1920x1080px
            </div>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-4 rounded-b-sm bg-white/5 p-3"
        >
          <BaseButton
            type="tertiary"
            data-cy="cb446b17dec43e00"
            @click="categoryPopup = false"
          >
            {{ $t('base.upload.cancel') }}
          </BaseButton>
          <BaseButton data-cy="7bc749206d429e5f" @click="onCategoryConfirm">
            <div class="flex size-3 items-center justify-center">
              <i
                v-if="categoryLoading"
                class="fa-light fa-loader animate-spin text-base"
              />
              <i v-else class="fa-solid fa-save text-sm" />
            </div>
            {{ $t('base.upload.confirm') }}
          </BaseButton>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessageBox } from 'element-plus';

export default {
  setup() {
    const { files, open, reset } = useFileDialog({
      accept: 'image/*',
    });
    const categoriesStore = useCategoriesStore();
    return { categoriesStore, files, open, reset };
  },
  data() {
    return {
      loading: false,
      category: {
        name: '',
      },
      categoryLoading: false,
      categoryPopup: false,
      categories: {
        cursor: null,
        data: [],
      },
    };
  },
  watch: {
    categoryPopup(state) {
      if (!state) {
        this.reset();
        this.category = {
          name: '',
        };
        this.categoryLoading = false;
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    async load(params = {}) {
      this.loading = true;
      this.categories = await this.categoriesStore.getCategories({
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
    async onCategoryConfirm() {
      const file = this.files?.[0];
      if (this.categoryLoading) {
        return;
      }

      if (!this.category.name) {
        return this.$toast.error($t('category.form.name.hint'));
      }

      if (this.category.id) {
        let fileId = null;
        this.categoryLoading = true;

        if (file) {
          const res = await upload({
            file,
            useGlobalBucket: true,
          });
          fileId = res.fileId;
        }

        await this.categoriesStore.updateCategory({
          id: this.category.id,
          status: 'active',
          name: this.category.name,
          image: fileId
            ? {
                fileId,
                metadata: {
                  size: file.size,
                  mimetype: file.type,
                  name: file.name,
                },
              }
            : undefined,
        });
        await this.load();
        this.categoryLoading = false;
        this.categoryPopup = false;
      } else {
        if (!file) {
          return this.$toast.error($t('category.form.icon.hint'));
        }

        try {
          this.categoryLoading = true;
          const { fileId } = await upload({
            file,
            useGlobalBucket: true,
          });
          await this.categoriesStore.createCategory({
            status: 'active',
            name: this.category.name,
            image: {
              fileId,
              metadata: {
                size: file.size,
                mimetype: file.type,
                name: file.name,
              },
            },
          });
          await this.load();
          this.categoryLoading = false;
          this.categoryPopup = false;
        } catch (error) {
          this.categoryLoading = false;
          throw error;
        }
      }
    },
    handleCategoryEdit(category) {
      this.category = { ...category };
      this.categoryPopup = true;
    },
    async handleCategoryDelete(category) {
      await ElMessageBox.confirm(
        `"${$t('category.dialog.full')}" "${category.name}"?`,
        `${$t('base.editor.delete')}"`,
        {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonText: 'No',
        },
      );
      this.loading = true;
      await this.categoriesStore.deleteCategory({
        id: category.id,
      });
      await this.load();
    },
  },
};
</script>
