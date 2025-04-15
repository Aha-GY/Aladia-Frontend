<template>
  <div class="flex px-8 pt-4">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('admin.categories.upper')" name="categories" />
      <el-tab-pane
        :label="$t('admin.courses.reviews.upper')"
        name="courses/review"
      />
      <el-tab-pane
        :label="$t('admin.content.moderation.upper')"
        name="content"
      />
    </el-tabs>
  </div>
  <div>
    <AdminCategories v-if="activeName === 'categories'" />
    <AdminCourseReview v-if="activeName === 'courses/review'" />
    <AdminContentModeration v-if="activeName === 'content'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const activeName = ref('categories');

const handleClick = (tab) => {
  activeName.value = tab.props.name;
};
</script>
