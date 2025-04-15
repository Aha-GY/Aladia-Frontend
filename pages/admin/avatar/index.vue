<template>
  <NuxtLayout :footer="false">
    <div class="flex h-96 flex-col items-center gap-8 p-4">
      <div class="flex items-center gap-3">
        <el-checkbox v-model="showPicture" label="picture" size="large" />
        <div class="mr-8 flex items-center gap-2">
          <el-checkbox v-model="showStory" label="story" size="large" />
          <el-select
            v-if="showStory"
            v-model="story.status"
            placeholder="status"
            size="small"
            style="width: 120px"
          >
            <el-option label="active" value="active" />
            <el-option label="noStory" value="no-story" />
            <el-option label="viewed" value="viewed" />
          </el-select>
        </div>
        <div class="mr-8 flex items-center gap-2">
          <el-checkbox v-model="showWork" label="work" size="large" />
          <el-select
            v-if="showWork"
            v-model="work"
            placeholder="status"
            size="small"
            style="width: 120px"
          >
            <el-option label="open-to-work" value="open-to-work" />
            <el-option label="hiring" value="hiring" />
          </el-select>
        </div>
        <div class="mr-8 flex items-center gap-2">
          <el-checkbox v-model="showOnline" label="online" size="large" />
          <el-select
            v-if="showOnline"
            v-model="online"
            placeholder="status"
            size="small"
            style="width: 120px"
          >
            <el-option label="on" :value="true" />
            <el-option label="off" :value="false" />
          </el-select>
        </div>
        <div class="mr-8 flex items-center gap-2">
          <el-checkbox v-model="showCheck" label="check" size="large" />
          <el-select
            v-if="showCheck"
            v-model="checked"
            placeholder="status"
            size="small"
            style="width: 120px"
          >
            <el-option label="on" :value="true" />
            <el-option label="off" :value="false" />
          </el-select>
        </div>
        <el-checkbox v-model="showDropDown" label="button" size="large" />
        <el-checkbox v-model="storyLoading" label="loading" size="large" />
        <el-checkbox v-model="round" label="round" size="large" />
      </div>
      <div class="flex items-center justify-center gap-10 p-12">
        <BaseAvatarNext
          v-for="option in options"
          :key="option.size"
          v-bind="option"
        />
      </div>
    </div>
  </NuxtLayout>
</template>

<script>
export default {
  data() {
    return {
      picture: '/icons/avatar.jpeg',
      online: true,
      checked: true,
      round: true,
      storyLoading: false,
      story: {
        status: 'active', // active, no-story, viewed
        nextStoryId: '',
      },
      work: 'open-to-work',
      showPicture: true,
      showStory: false,
      showWork: false,
      showOnline: false,
      showCheck: false,
      showDropDown: false,
    };
  },
  computed: {
    options() {
      const sizes = ['sm', 'md', 'lg', 'xl'];
      return sizes.map((size) => ({
        size,
        defaultIcon: 'fa-solid fa-user',
        picture: this.showPicture ? this.picture : '',
        showStory: this.showStory,
        story: this.story,
        showWork: this.showWork,
        work: this.work,
        showOnline: this.showOnline,
        online: this.online,
        showCheck: this.showCheck,
        checked: this.checked,
        showDropDown: this.showDropDown,
        storyLoading: this.storyLoading,
        round: this.round,
      }));
    },
  },
};
</script>
