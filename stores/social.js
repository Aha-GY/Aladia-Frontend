import { useToast } from 'vue-toastification';

import {
  getCategories,
  searchCategories,
  getCategory,
} from '~/api/v2/category';
import { getCourses } from '~/api/v2/course';
import { getOrganizations } from '~/api/v2/org';
import {
  searchProfile,
  getProfileSearchHistory,
  deleteProfileSearchHistory,
  createProfileSearchHistory,
  deleteProfileSearchHistoryId,
  searchProfilesAndOrganizations,
} from '~/api/v2/profile';
import {
  getPosts,
  createPosts,
  retreivePost,
  deletePost,
  updatePost,
  searchPosts,
  savePosts,
  hidePosts,
  updatePostNotification,
  searchComments,
  createComments,
  retreiveComment,
  deleteComment,
  updateComment,
  solveAnswer,
  getReaction,
  getAllReactions,
  retreiveReaction,
  updateReaction,
  deleteRepost,
} from '~/api/v2/social';
import { profileEvent } from '~/constant/eventBus';
import { _REACT_USERLIST_CACHE } from '~/constant/social';

export const useSocialStore = defineStore('social', {
  state: () => ({
    tabIndex: 0,
    pageLimit: 10,
    sortDirection: 'desc',

    searchQuestionShow: false,

    // searchbar social search user
    membersLoading: false,
    profileNext: null,
    profiles: [],

    creatorLoading: false,
    creatorVisible: false,
    creatorTab: 'post',

    // context switch
    contextSwitchPopUpVisible: false,
    currentSelectedProfile: '',

    postsLoading: false,
    posts: {
      next: null,
      totalRecords: 0,
      // 用于存储 post/story/reel 等列表的数据
      posts: [],
      // 刚刚发布成功或编辑成功的帖子
      newPost: null,
    },
    postsSearching: false,
    // 在 post/story/reel 等列表页面调用 getPosts() 函数时会更新此状态，但它似乎没有控制任何界面样式
    createLoading: false,
    profileCreatingPost: false,

    categoriesLoading: false,
    categories: [],
    categoriesNext: null,
    category: 'General',
    categoryId: '',
    categoryImg: '',
    selectChapter: 'none',
    selectedLecture: {
      id: null,
      lectureIndex: null,
      chapterIndex: null,
      thumbnail: null,
      realteToCourse: false,
    },

    reactionUsersLoading: false,
    reactionUsers: [],

    optionPopup: false,
    optionId: null,
    sharePopup: false,
    shareId: null,
    reactId: null,
    reactIdType: '',

    reactSelect: null,

    commentsPopup: false,
    offsetTop: 0,
    offsetHeight: 0,
    commentsLoading: false,
    commentsData: [],
    commentsReactPopup: false,
    commentsReactPopupData: {},

    commentEditData: {
      commentId: null,
      comment: null,
    },

    searchComments: false,
    questionPopup: false,
    postPopup: false,
    mentionPopup: false,
    popupExpand: false,
    // 用于存储当前选中的普通帖子
    postItem: null,
    // 用于存储当前选中的转发的帖子
    repostItem: null,
    // 用于存储当前选中的提及的帖子
    mentionItem: null,

    // 帖子的附件弹框是否显示
    attachmentPopupVisible: false,
    // 帖子的附件弹框数据
    attachmentPopupData: [],

    tempData: {},
    isReplay: false,
    answerTip: false,
    answerError: false,
    answerscrollTop: 0,
    answerSelection: null,
    answerCollapse: null,
    answerTo: null,
    answerToId: null,
    answerLineId: null,
    answerVisibility: 'public',
    answerFiles: [],
    answerTags: [],
    answerLoomFiles: [],
    answerSending: false,
    answerShowEmoji: false,
    answerShowTags: false,
    answerReplying: false,
    answerProfile: null,
    answerEditId: null,
    answerEditType: null,
    answerMention: [],
    answer: {
      title: '',
      body: '',
    },
    gif: '',
    // edit post data
    editPostData: {
      title: '',
      content: '',
      mentions: [],
      files: [],
      type: '',
      loomFiles: [],
      entity: null,
      location: null,
      visibility: 'public',
      id: null,
    },

    // suggestion data
    suggestionsLoading: false,
    // 用于存储推荐用户列表
    suggestions: [],
    suggestionsNext: null,

    organizationSuggestionsLoading: false,
    organizationSuggestions: [],
    organizationSuggestionsNext: null,

    reelSuggestions: [],

    // 所有发帖进度
    postProgress: [],
    rePostProgress: [],
    // 所有进度都已完成
    // 这个状态是为进度条的自动关闭功能准备的
    postingAllDone: false,

    // toggle between suggested users/organizations users - true
    toggleSuggestion: 0,
    interval: 7,
  }),
  actions: {
    // 添加进度
    addPostProgress(isPost = true) {
      const id = Date.now();
      if (isPost) {
        this.postProgress.push({
          id, // 唯一标识
          progress: 0, // 进度（0～100）
          success: false, // 是否成功
          failed: false, // 是否失败
          show: false, // 是否显示
        });
      } else {
        this.rePostProgress.push({
          id,
          progress: 0,
          success: false,
          failed: false,
          show: false,
        });
      }
      this._updatePostingAllDone(isPost);
      return id;
    },
    // 更新进度
    updatePostProgress(id, updates, isPost = true) {
      let item = null;
      if (isPost) {
        item = this.postProgress.find((p) => p.id === id);
      } else {
        item = this.rePostProgress.find((p) => p.id === id);
      }
      if (item) {
        Object.assign(item, updates);
      }
      this._updatePostingAllDone(isPost);
    },
    // 删除进度
    removePostProgress(id, isPost = true) {
      const index = this.findIndex(id, isPost);
      if (index > -1) {
        if (isPost) {
          this.postProgress.splice(index, 1);
        } else {
          this.rePostProgress.splice(index, 1);
        }
      }
      this._updatePostingAllDone(isPost);
    },
    // 获取进度
    getPostProgress(id, isPost = true) {
      if (!isPost) {
        return this.rePostProgress.find((p) => p.id === id);
      }

      return this.postProgress.find((p) => p.id === id);
    },
    _updatePostingAllDone(isPost = true) {
      if (isPost) {
        this.postingAllDone = this.postProgress.every(
          (p) => p.success || p.failed,
        );

        return;
      }

      this.postingAllDone = this.rePostProgress.every(
        (p) => p.success || p.failed,
      );
    },
    findIndex(id, isPost = true) {
      let index = -1;
      if (isPost) {
        index = this.postProgress.findIndex((p) => p.id === id);
      } else {
        index = this.rePostProgress.findIndex((p) => p.id === id);
      }
      return index;
    },

    // ========== 创建帖子之后更新列表 ==========
    // 设置创建成功或编辑成功的帖子，以便用于后续的更新操作
    setNewPost(post) {
      this.posts.newPost = post;
    },
    // 把创建成功或编辑成功的帖子更新到列表中
    updatePostsWithNewPost() {
      // 先拿到新帖子的数据
      const newPost = this.posts.newPost;
      // 先检查这个帖子是创建还是编辑，尝试从列表中找到这个帖子
      const index = this.posts.posts.findIndex((p) => p.id === newPost.id);
      // 如果找到，则将它从原位置删除
      if (index > -1) {
        // 将 post 从原位置删除
        this.posts.posts.splice(index, 1);
      }
      // 将新帖子插入到列表顶部
      this.posts.posts.unshift(newPost);
      // 收尾
      this.posts.newPost = null;
    },

    resetPostEditData() {
      this.editPostData = {
        title: '',
        content: '',
        mentions: [],
        files: [],
        loomFiles: [],
        type: '',
        location: null,
        entity: null,
        visibility: 'public',
        id: null,
      };
    },
    async createPosts(params) {
      const data = await createPosts(params);
      return data;
    },
    async searchPosts(params) {
      const data = await searchPosts(params);
      return data;
    },
    async searchPostsList(params = {}) {
      try {
        this.postsLoading = true;
        const {
          data,
          cursor: { next, totalItems },
        } = await this.searchPosts({
          limit: this.pageLimit,
          sortDirection: this.sortDirection,
          ...params,
        });
        this.posts.totalRecords = totalItems;
        this.posts.next = next;
        this.posts.posts = [...this.posts.posts, ...data];
        return data;
      } finally {
        this.postsLoading = false;
      }
    },
    async setSearchBarQuestionSeeMore() {
      const route = useRoute();
      const isFeedPage = route.name.includes('feed');
      this.tabIndex = 2;
      this.posts.posts = [];
      this.posts.next = null;
      this.posts.totalRecords = 0;

      if (isFeedPage) {
        const searchStore = useSearchStore();
        if (searchStore.query.title) {
          await this.searchPostsList({
            type: 'question',
            title: searchStore.query.title,
            next: this.posts.next,
          });
        } else {
          await this.getPosts({
            next: this.posts.next,
            sortDirection: this.sortDirection,
            limit: this.pageLimit,
            type: 'question',
          });
        }
      }
    },
    async getPostsList(params) {
      const data = await getPosts(params);
      return data;
    },
    async getPosts(params = {}) {
      try {
        this.postsLoading = true;
        const {
          data,
          cursor: { next, totalItems },
        } = await this.getPostsList({
          limit: this.pageLimit,
          sortBy: 'updatedAt',
          sortDirection: this.sortDirection,

          ...params,
          suggestion: undefined,
        });
        this.posts.totalRecords = totalItems;
        this.posts.next = next;
        if (params.suggestion) {
          let suggestionType;
          if (this.toggleSuggestion === 0) {
            suggestionType = 'reelSuggestion';
          } else if (this.toggleSuggestion === 1) {
            await this.loadSuggestions();
            suggestionType = 'suggestion';
          } else {
            await this.loadOrganizationSuggestions();
            suggestionType = 'organizationSuggestion';
          }

          data.splice(this.interval, 0, { type: suggestionType });

          this.toggleSuggestion = (this.toggleSuggestion + 1) % 3;
        }

        this.posts.posts = [...this.posts.posts, ...data];
        return data;
      } finally {
        this.postsLoading = false;
      }
    },
    async loadOrganizationSuggestions() {
      try {
        this.organizationSuggestionsLoading = true;
        const { data, cursor } = await getOrganizations({
          next: this.organizationSuggestionsNext,
          limit: 10,
          followSuggestion: true,
        });
        this.organizationSuggestions = data;
        this.organizationSuggestionsNext = cursor.next;
      } finally {
        this.organizationSuggestionsLoading = false;
      }
    },

    async loadSuggestions() {
      this.suggestionsLoading = true;
      try {
        const { data, cursor } = await searchProfile({
          next: this.suggestionsNext,
          limit: 12,
          followSuggestion: true,
        });
        this.suggestions = data;
        this.suggestionsNext = cursor.next;
      } finally {
        this.suggestionsLoading = false;
      }
    },
    async removePost(params) {
      const { postId } = params;
      const data = await deletePost(params);
      const index = this.posts.posts.findIndex((item) => item.id === postId);
      if (index > -1) {
        this.posts.posts.splice(index, 1);
      }
      const { $eventBus } = useNuxtApp();
      $eventBus.emit(profileEvent.DELETE_PROFILE_QA_REVIEWS);
      // if (this.postItem && this.postItem.id === postId) {
      //   this.commentsPopup = false;
      //   this.questionPopup = false;
      //   this.postPopup = false;
      //   this.postItem = null;
      // }
      return data;
    },
    async removeRepost({ postId }) {
      try {
        await deleteRepost({ postId });

        this.posts.posts = this.posts.posts
          .map((post) => {
            if (post.type === 'repost' && post.parent.id === postId) {
              return null;
            }
            if (post.id === postId) {
              return { ...post, isReposted: false };
            }
            return post;
          })
          .filter(Boolean);
      } catch (error) {
        console.error('Failed to remove repost:', error);
      }
    },
    async updatePost(params) {
      const data = await updatePost(params);
      return data;
    },
    async retreivePost(postId) {
      const data = await retreivePost(postId);
      return data;
    },
    async savePosts(postId) {
      const data = await savePosts({ postId });
      return data;
    },
    async updatePostNotification(postId) {
      const data = await updatePostNotification({ postId });
      return data;
    },

    async hidePost({ postId, userId }) {
      await hidePosts({ userId, entityId: postId });
      const index = this.posts.posts.findIndex((item) => item.id === postId);
      if (index > -1) {
        this.posts.posts[index] = {
          type: 'hidden',
          id: postId,
          item: this.posts.posts[index],
        };
      }
    },
    async unHidePost({ postId, userId }) {
      await hidePosts({ userId, entityId: postId });
      const index = this.posts.posts.findIndex((item) => item.id === postId);
      if (index > -1) {
        this.posts.posts[index] = this.posts.posts[index].item;
      }
    },
    async retreivePostOrComment({ type, ...rest }) {
      let data = null;
      if (type === 'post') {
        data = await retreivePost(rest.id);
      }

      if (type === 'comment') {
        data = await retreiveComment(rest.id);
      }

      return data;
    },
    async createComments(params) {
      const data = await createComments(params);
      return data;
    },
    async getComments() {
      const {
        data,
        // cursor: { totalItems },
      } = await searchComments({
        entityId: this.postItem.id,
        sortDirection: this.sortDirection,
        limit: 100,
      });
      this.commentsData = data || [];
      return data;
    },
    async getReplies(params) {
      const data = await searchComments(params);
      return data;
    },
    async deleteComment(params) {
      const data = deleteComment(params);
      return data;
    },
    answerReset() {
      this.answerSelection = null;
      this.answerCollapse = false;
      this.answerTo = this.postItem;
      this.answerFiles = [];
      // this.answerTags = [];
      this.answerMention = [];
      this.answerSending = false;
      this.answerShowEmoji = false;
      this.answerShowTags = false;
      this.answerReplying = false;
      this.answerEditId = null;
      this.answerEditType = null;
      this.answer = {
        title: '',
        body: '',
      };
      this.answerVisibility = 'public';
      this.answerTip = false;

      // this.category = "General";
      // this.categoryId = "";
    },
    async onAnswerFileUpload(file) {
      const $toast = useToast();

      if (!file) {
        return;
      }
      if (this.answerFiles.length === 3) {
        return;
      }
      if (!(file.type.startsWith('image/') || file.type.startsWith('video/'))) {
        return $toast.error('Please upload the file in image format');
      }

      const preview = URL.createObjectURL(file);
      const result = {
        progress: 0.01,
        file,
        preview,
        id: null,
        url: '',
        size: '',
        mimetype: '',
      };
      this.answerFiles.push(result);
      const index = this.answerFiles.indexOf(result);
      try {
        const that = this;

        const { fileId } = await upload({
          file,
          onProgress: (progress) => {
            that.answerFiles[index].progress = progress;
          },
        });

        this.answerFiles[index].id = fileId;
        this.answerFiles[index].size = file.size || 0;
        this.answerFiles[index].mimetype = file.type;
      } catch (error) {
        this.answerFiles.splice(index, 1);
        throw error;
      }
    },
    async onAnswerFileChange(event) {
      const file = event.target.files[0];
      this.answerCollapse = true;
      await this.onAnswerFileUpload(file);
      event.target.value = '';
    },
    onAnswerFileRemove(file) {
      const index = this.answerFiles.indexOf(file);
      this.answerFiles.splice(index, 1);
      // TODO: check if has new api
      // removeAttachement({ attachementId: file.id });
    },
    async addAttachement() {
      //
    },
    async createReaction() {
      //
    },
    async deleteReaction() {
      //
    },
    async getReaction(params) {
      const data = await getReaction(params);
      return data;
    },
    async getAllReaction(params) {
      const data = await getAllReactions(params);
      return data;
    },
    async retreiveReaction(entityId) {
      const data = await retreiveReaction(entityId);
      return data;
    },
    async updateReaction({ id, ...rest }) {
      const data = await updateReaction({ id, ...rest });
      return data;
    },
    async getCommentsReaction() {
      //
    },
    async getCategories() {
      this.categoriesLoading = true;
      const {
        data,
        cursor: { next },
      } = await getCategories({
        limit: 12,
      });
      this.categories = data;
      this.categoriesNext = next;
      this.categoriesLoading = false;
      return data;
    },

    async getCategory({ id }) {
      const data = await getCategory({ id });
      return data;
    },

    async searchCategories(params) {
      const data = await searchCategories(params);
      return data;
    },
    resetCatefories() {
      this.categories = [];
      this.categoriesNext = null;
      this.category = 'General';
      this.categoryId = '';
      this.categoryImg = '';
    },
    async solveAnswer(params) {
      const data = await solveAnswer(params);
      return data;
    },
    async getProfiles(params) {
      const data = await searchProfile(params);
      return data;
    },
    async updatePostlistFollow({ userId, status, user }) {
      if (!this.posts.posts.length) {
        return;
      }

      const clonePost = cloneDeep(this.posts.posts);

      for (let index = 0; index < clonePost.length; index++) {
        const item = clonePost[index];

        if (item.owner.id === userId) {
          item.isFollowing = status;
        }

        if (item[_REACT_USERLIST_CACHE]) {
          const exitIndex = item[_REACT_USERLIST_CACHE].findIndex(
            (user) => user.owner.id === userId,
          );

          if (exitIndex !== -1) {
            item[_REACT_USERLIST_CACHE][exitIndex].isFollowing = status;
          }
        }
      }
      this.posts.posts = clonePost;

      const profileStore = useProfileStore();
      await profileStore.fetchProfile(user);
    },
    showPostsPopup(post) {
      this.postPopup = true;
      this.postItem = post;
    },
    showMentionPopup(post, mentionItem) {
      this.mentionPopup = true;
      this.postItem = post;
      this.mentionItem = mentionItem;
    },
    showStoryPosts(post) {
      this.postItem = post;
    },
    showReelPosts(post) {
      this.postItem = post;
    },
    hidePostsPopup() {
      this.postPopup = false;
      this.popupExpand = false;
      this.mentionPopup = false;
      if (!this.creatorVisible) {
        this.postItem = null;
        this.mentionItem = null;
      }

      const router = useRouter();
      const route = useRoute();
      const { postId, ...remainingQuery } = route.query;
      if (postId) {
        router.push({
          path: route.path,
          query: remainingQuery, // Keep other query parameters, but exclude `postId`
        });
      }
    },
    getCourses(params) {
      const data = getCourses(params);
      return data;
    },
    setSelectLecture(params) {
      const { id, lectureIndex, chapterIndex, thumbnail, realteToCourse } =
        params;
      this.selectedLecture = Object.assign({}, this.selectedLecture, {
        id,
        lectureIndex,
        chapterIndex,
        thumbnail,
        realteToCourse: !!realteToCourse,
      });
    },
    resetSelectLecture() {
      this.selectedLecture = {
        id: null,
        lectureIndex: null,
        chapterIndex: null,
        thumbnail: null,
        realteToCourse: false,
      };
    },
    resetEditComment() {
      this.commentEditData = {
        commentId: null,
        comment: null,
      };
    },
    async updateComment(params) {
      const data = await updateComment(params);
      const commentId = data.id;
      if (commentId) {
        this.replaceNewComment(this.commentsData, commentId, data);
      }
      return data;
    },
    replaceNewComment(comments, id, newContent) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === id) {
          comments[i] = Object.assign({}, comments[i], newContent);
          return true;
        }
        if (comments[i].replies && comments[i].replies.length > 0) {
          const found = this.replaceNewComment(
            comments[i].replies,
            id,
            newContent,
          );
          if (found) {
            return true;
          }
        }
      }
      return false;
    },
    async getProfileSearchHistory(params) {
      const data = await getProfileSearchHistory(params);
      return data;
    },
    async deleteProfileSearchHistory() {
      const data = await deleteProfileSearchHistory();
      return data;
    },
    async createProfileSearchHistory(params) {
      const data = await createProfileSearchHistory(params);
      return data;
    },
    async deleteProfileSearchHistoryId(params) {
      const data = await deleteProfileSearchHistoryId(params);
      return data;
    },
    async searchProfilesAndOrganizations(params) {
      const data = await searchProfilesAndOrganizations(params);
      return data;
    },
  },
});
