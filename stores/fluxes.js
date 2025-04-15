import * as _ from 'lodash';

import {
  getLastestStories,
  // getStories,
  createStories,
  deleteStories,
  searchStories,
  updateStories,
  // retrieveStories,
  createStoryGroup,
  getStoriesGroup,
  searchStoriesGroup,
  setSocialReaction,
  deleteFeedReaction,
  getSocialReactionList,
  getStoryById,
  updateStoriesGroup,
  toggleStoryNotification,
  getStoriesGroupById,
  deleteAllStories,
  deleteStoryGroup,
  hideStories,
  deleteStoryReelReaction,
} from '~/api/v2/fluxes';
import {
  createPosts,
  getPosts,
  // retreivePost,
  // deletePost,
  // updatePost,
  // searchPosts,
  // savePosts,
  hidePosts,
  // updatePostNotification,
  // searchComments,
  // createComments,
  // retreiveComment,
  // deleteComment,
  // updateComment,
  // solveAnswer,
  // getReaction,
  // getAllReactions,
  // retreiveReaction,
  // updateReaction
} from '~/api/v2/social';

export const useFluxesStore = defineStore('fluxes', {
  state: () => ({
    creationVisible: false,
    creationVisibility: 'public',
    isCommentPopupOpen: false,
    isNewCoverPhoto: false,
    isNewReelMedia: false,
    isSharePopupOpen: false,
    isReactionListPopupOpen: false,
    isCommentOpen: false,
    creationTab: 'story', // story,  reel, hightlight
    isCreatingStory: false,
    isCreatingReal: false,
    currReelItem: {},
    isEditingReel: false,
    isShowMoreDescription: false,
    areReelsHidden: false,
    reelCreated: false,
    reelEdited: false,
    storyType: '', // text, media
    deleteStory: {
      item: null,
      visible: false,
      loading: false,
    },

    deleteHighlight: {
      item: null,
      visible: false,
      loading: false,
    },

    currentUserStories: [],
    storyViewStartingRoute: null,
    storyVisibility: 'public',
    isShareContentVisible: false,
    reactListPopupVisible: false,
    storyIsPublished: false,
    sourcePageIsProfile: false,
    deletedStoryList: [],
    closePopupCheck: false,
    tempCreationTab: '',
    createTextStory: {
      content: '',
      color: '',
      shape: 'clean',
      loading: false,
    },

    createMediaStory: {
      content: [],
      type: '',
      file: null,
      loading: false,
    },

    createMediaReel: {
      uploadOpen: false,
      content: '',
      file: null,
      loading: false,
      metadata: {
        name: '',
        size: '',
        mimetype: '',
      },
    },

    editStory: {
      visible: false,
      index: null,
      file: null,
      item: null,
      type: null,
      imageState: null,
      fromStory: false,
    },

    currentPreviewStory: null,
    storiesData: {
      data: [],
      loading: false,
      next: null,
      totalItems: 0,
    },

    // reelsData
    reelsData: {
      data: [],
      loading: false,
      next: null,
      totalItems: 0,
    },
    hiddenPosts: new Set(),
    hiddenStories: new Set(),

    storiesGroupData: {
      data: [],
      loading: false,
      next: null,
      totalItems: 0,
    },

    createMediaList: {
      uploadOpen: false,
      title: '',
      cover: null,
      data: [],
      loading: false,
      visibility: 'public',
      editingHighlightId: null,
      highlightCover: null,
      isCreatingStory: false,
      isFromHighlight: false,
    },

    storiesPreview: {
      loading: false,
      index: 0,
      visible: false,
      data: [],
      isCreatePreview: false,
      startingIndex: 0,
      id: null,
      storyId: null,
      open: false,
    },

    reelPreview: {
      loading: false,
      index: 0,
      visible: false,
      data: [],
      isCreatePreview: false,
      isCommentPopupOpen: null,
      isSharePopupOpen: null,
      isReactionListPopupOpen: null,
      isShowingMoreDescription: null,
      previousRoute: null,
    },

    storyPopup: {
      state: false,
      user_id: null,
      story_id: null,
      isHighlight: false,
    },

    reelPopup: {
      state: false,
      reel_Id: null,
    },

    currentUserStoryId: null,
  }),
  actions: {
    resetTextStory() {
      this.createTextStory = {
        content: '',
        color: '',
        shape: 'clean',
        loading: false,
      };
    },
    resetMediaStory() {
      this.createMediaStory = {
        content: [],
        type: '',
        file: null,
        loading: false,
      };

      this.editStory = {
        visible: false,
        index: null,
        file: null,
        item: null,
        type: null,
        imageState: null,
        fromStory: false,
      };
    },
    async getLastestStories(params) {
      if (this.storiesData.loading) {
        return;
      }

      this.storiesData.loading = true;

      try {
        const {
          cursor: { next, totalItems },
          data,
        } = await getLastestStories({
          ...params,
          next: this.storiesData.next,
          limit: 20,
        });

        const existingIds = new Set(
          this.storiesData.data.map((item) => item.id),
        );
        const uniqueData = data.filter((item) => !existingIds.has(item.id));

        this.storiesData.data = [...this.storiesData.data, ...uniqueData];

        this.storiesData.next = next;
        this.storiesData.totalItems = totalItems;

        return uniqueData;
      } catch (error) {
        console.error('Failed to fetch stories:', error);
      } finally {
        this.storiesData.loading = false;
      }
    },
    onceGetLastestStories(params) {
      this.storiesData.loading = false;
      this.storiesData.data = [];
      this.storiesData.next = null;
      this.storiesData.totalItems = 0;
      this.getLastestStories(params);
    },
    resetCreationStories() {
      // this.creationVisible = false;
      this.creationVisibility = 'public';
      this.creationTab = 'story'; // story, highlight
      this.isCreatingStory = false;
      this.storyType = ''; // text, media

      this.createMediaList = {
        uploadOpen: false,
        title: '',
        cover: null,
        data: [],
        loading: false,
        visibility: 'public',
        editingHighlightId: null,
      };

      this.deleteStory = {
        item: null,
        visible: false,
        loading: false,
      };

      this.resetTextStory();
      this.resetMediaStory();
    },
    resetStoryEditing() {
      this.creationVisible = false;
      this.editStory.fromStory = false;
      this.editStory.visible = false;
    },
    resetCreationReels(tab = 'story', creationVisible = false) {
      this.creationVisible = creationVisible;
      this.creationVisibility = 'public';
      this.creationTab = tab; // story, highlight
      this.isCreatingReal = false;
      this.isNewCoverPhoto = false;
      this.createMediaReel = {
        content: '',
        uploadOpen: false,
        title: '',
        cover: null,
        data: [],
        loading: false,
        metadata: {
          name: '',
          size: '',
          mimetype: '',
        },
      };
    },
    resetHighlightCreation() {
      this.createMediaList = {
        uploadOpen: false,
        title: '',
        cover: null,
        data: [],
        loading: false,
        visibility: 'public',
        editingHighlightId: null,
        highlightCover: null,
      };
      this.resetTextStory();
      this.resetMediaStory();
      // this.resetStoryEditing();
    },
    async createStories(params) {
      // 处理数据中的 imageState
      const mapBlobUrlToFileId = await generateMapFromImageState(
        params.imageState,
      );
      if (!_.isEmpty(mapBlobUrlToFileId)) {
        params.mapBlobUrlToFileId = mapBlobUrlToFileId;
      }

      const payload = {
        ...params,
      };
      const data = await createStories(payload);
      return data;
    },
    async deleteStories(id) {
      const data = await deleteStories(id);
      return data;
    },
    async searchStories(params) {
      const data = await searchStories(params);
      return data;
    },
    async showUserStories({ userId, index }) {
      try {
        this.storiesPreview.loading = true;
        // this.storiesPreview.visible = true;

        let allRelatedStories = [];
        let nextCursor = null;
        do {
          const { data, cursor } = await this.searchStories({
            ownerId: userId,
            status: 'active',
            limit: 20,
            next: nextCursor,
          });

          allRelatedStories = [...allRelatedStories, ...data];

          nextCursor = cursor?.next || null;
        } while (nextCursor);

        if (!allRelatedStories.length) {
          this.storiesPreview.visible = false;
          return;
        }

        this.storiesPreview.index = index || 0;
        const firstStory = allRelatedStories[0];
        let startingIndexInit = 0;

        if (firstStory.owner.story.status === 'active') {
          const nextStoryIndex = this.findActiveIndex({
            data: allRelatedStories,
            storyId: firstStory.owner.story.nextStoryId,
          });
          startingIndexInit = Math.max(0, nextStoryIndex);
        }

        firstStory._stories = allRelatedStories;
        firstStory.startingIndex = startingIndexInit;
        this.storiesPreview.data = [firstStory];
        this.currentUserStoryId = firstStory._stories[0].id;
      } finally {
        this.storiesPreview.loading = false;
        this.storiesPreview.open = true;
      }
    },
    async createStoryGroup(params) {
      const data = await createStoryGroup(params);
      this.storiesGroupData.data = [data, ...this.storiesGroupData.data];
      return data;
    },
    async getStoriesGroup(params) {
      const data = await getStoriesGroup(params);
      return data;
    },
    async searchStoriesGroup(params) {
      this.storiesGroupData.loading = true;
      try {
        const {
          cursor: { next, totalItems },
          data,
        } = await searchStoriesGroup({
          ...params,
          next: this.storiesGroupData.next,
          sortDirection: 'desc',
          limit: 20,
        });
        this.storiesGroupData.data = [...this.storiesGroupData.data, ...data];
        this.storiesGroupData.next = next;
        this.storiesGroupData.totalItems = totalItems;
        return data;
      } finally {
        this.storiesGroupData.loading = false;
      }
    },
    onceGetUserLastestStoriesGroup(params) {
      this.storiesGroupData.loading = false;
      this.storiesGroupData.data = [];
      this.storiesGroupData.next = null;
      this.storiesGroupData.totalItems = 0;
      this.searchStoriesGroup(params);
    },
    async setSocialReaction(params) {
      const data = await setSocialReaction(params);
      return data;
    },
    async deleteSocialReaction(params) {
      const { id, type } = params;
      if (type === 'feed') {
        const data = await deleteFeedReaction(id);
        return data;
      }

      const data = await deleteStoryReelReaction(id);
      return data;
    },
    async getSocialReactionList(params) {
      const data = await getSocialReactionList(params);
      return data;
    },
    async getStoryById(storyId) {
      const data = await getStoryById(storyId);
      return data;
    },
    async updateStories(params) {
      // console.log('params', params);
      const data = await updateStories(params);
      return data;
    },
    showRetrieveStory(data) {
      if (!data) {
        return;
      }
      this.storiesPreview.visible = true;
      this.storiesPreview.index = 0;
      this.storiesPreview.data = data;
    },
    findActiveIndex({ data, storyId }) {
      return data.findIndex((item) => item.id === storyId);
    },

    /** ----------------------Reel---------------- */
    // 1. Create Reel

    async createReels(params) {
      const payload = {
        ...params,
      };
      const data = await createPosts(payload);
      return data;
    },

    // 2. Get Reels
    async getReelsList(params) {
      const data = await getPosts(params);
      return data;
    },

    async getReels(params = {}) {
      try {
        this.reelsData.loading = true;
        const {
          data,
          cursor: { next, totalItems },
        } = await this.getReelsList({
          limit: 8,
          sortDirection: 'desc',
          type: 'reel',
          ...params,
        });
        this.reelsData.totalItems = totalItems;
        this.reelsData.next = next;
        this.reelsData.data = [...this.reelsData.data, ...data];

        return data;
      } finally {
        this.reelsData.loading = false;
      }
    },

    // 3. Get latest reels
    async getLatestReels() {
      try {
        this.reelsData.loading = true;
        const {
          data,
          cursor: { next, totalItems },
        } = await this.getReelsList({
          limit: 8,
          sortDirection: 'desc',
          sortBy: 'createdAt',
          type: 'reel',
        });
        this.reelsData.totalItems = totalItems;
        this.reelsData.next = next;
        this.reelsData.data = data;

        return data;
      } finally {
        this.reelsData.loading = false;
      }
    },

    // Hide a post or reel
    async hidePost({ postId, userId }) {
      try {
        // this.reelsData.loading = true;
        await hidePosts({ entityId: postId, userId });
        this.hiddenPosts.add(postId);
      } catch (error) {
        console.error('Failed to hide the post:', error);
      } finally {
        this.reelsData.loading = false;
      }
    },

    async hideReel(data) {
      try {
        await hidePosts(data);
        this.hiddenPosts.add(data);
      } catch (error) {
        console.log('Failed to hide the reel:', error);
      }
    },

    // Unhide a post or reel
    async unhidePost({ postId, userId }) {
      await hidePosts({ entityId: postId, userId });
      this.hiddenPosts.delete(postId);
    },

    // hide story
    async toggleStoryVisibility({ userId, entityId, fromReaction, action }) {
      try {
        const data = { userId, entityId };

        if (action === 'hide' && !fromReaction) {
          this.hiddenStories.add(entityId);
        }
        if (action === 'unhide' && !fromReaction) {
          this.hiddenStories.delete(entityId);
        }

        await hideStories(data);
      } catch (error) {
        console.error(`Failed to ${action} the story:`, error);
      }
    },

    async hideStory({ userId, entityId, fromReaction = false }) {
      await this.toggleStoryVisibility({
        entityId,
        userId,
        fromReaction,
        action: 'hide',
      });
    },

    async unhideStory({ userId, entityId }) {
      await this.toggleStoryVisibility({ entityId, userId, action: 'unhide' });
    },
    // Check if a post is hidden
    isPostHidden(postId) {
      return this.hiddenPosts.has(postId);
    },
    async getCurrentUserStories({ userId }) {
      try {
        let cursor = null;
        const allStories = [];

        do {
          const {
            data,
            cursor: { next: nextCursor },
          } = await this.searchStories({
            ownerId: userId,
            status: 'active',
            limit: 20,
            next: cursor,
          });

          allStories.push(...data);

          cursor = nextCursor;
        } while (cursor);

        const sortedData = allStories.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        this.currentUserStories = sortedData;
      } catch (error) {
        console.error('Failed to get current user stories:', error);
      }
    },
    // update a story
    async updateStoriesGroup({ highlightId, ...data }) {
      try {
        const res = await updateStoriesGroup({ highlightId, ...data });
        return res;
      } catch (error) {
        console.log('Failed to update story group', error);
      }
    },
    async toggleStoryNotification({ storyId }) {
      try {
        const res = await toggleStoryNotification({ storyId });
        return res;
      } catch (error) {
        console.log('Failed to toggle story notification', error);
      }
    },
    async getStoriesGroupById(id) {
      try {
        const res = await getStoriesGroupById(id);
        return res;
      } catch (error) {
        console.log('Failed to get story group by id', error);
        return;
      }
    },
    async deleteAllStories(data) {
      try {
        const res = await deleteAllStories({ id: data });
        return res;
      } catch (error) {
        console.log('Failed to delete all stories', error);
        return;
      }
    },
    async deleteStoryGroup({ id }) {
      try {
        const res = await deleteStoryGroup({ id });
        return res;
      } catch (error) {
        console.log('Failed to delete story group', error);
        return;
      }
    },
    hasActiveProgress() {
      // This checks if a user is creating either story, reel or highlight
      return (
        this.createMediaList.data.length ||
        this.createMediaList.highlightCover ||
        this.createMediaList.title ||
        this.createMediaReel.content ||
        this.createMediaList.uploadOpen ||
        this.isEditingReel ||
        this.createMediaReel.uploadOpen ||
        this.isNewCoverPhoto
      );
    },
  },
});
