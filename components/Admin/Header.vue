<template>
  <div class="flex px-8 pt-8">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('admin.categories.upper')" name="categories" />
      <el-tab-pane
        :label="$t('admin.courses.reviews.upper')"
        name="courses-review"
      />
      <el-tab-pane
        :label="$t('admin.content.moderation.upper')"
        name="content"
      />
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const path = route.name?.toString().replace(/.*admin-management(-)?/, '');
const activeName = ref(path);

const handleClick = (tab) => {
  const url = `/admin/management/${tab.paneName}`;
  router.push(url);
};
</script>
