import { http, HttpResponse, delay } from 'msw';

import { mockDatabase } from './mockDatabase';

const createCursor = (data) => ({
  next: null,
  prev: null,
  totalItems: data.length,
});

export const normalHandlers = {
  followers: http.get(
    'https://dev-api.aladia.io/v2/followers/*?limit=10',
    async ({ request }) => {
      const url = new URL(request.url);
      const type = url.searchParams.get('type');

      let filteredFollowers = mockDatabase.followers;

      if (type && type !== 'all') {
        filteredFollowers = filteredFollowers.filter((f) => f.type === type);
      }

      return HttpResponse.json({
        data: filteredFollowers,
        cursor: createCursor(filteredFollowers),
      });
    },
  ),

  followings: http.get(
    'https://dev-api.aladia.io/v2/followers/*/following?limit=10',
    async ({ request }) => {
      const url = new URL(request.url);
      const type = url.searchParams.get('type');

      const combinedFollowings = [
        ...mockDatabase.followings,
        ...mockDatabase.followers,
      ];

      let filteredFollowings = combinedFollowings.filter(
        (follower) => follower.isFollowing === true,
      );

      if (type && type !== 'all') {
        filteredFollowings = filteredFollowings.filter((f) => f.type === type);
      }

      return HttpResponse.json({
        data: filteredFollowings,
        cursor: createCursor(filteredFollowings),
      });
    },
  ),

  suggestions: http.get(
    'https://dev-api.aladia.io/v2/profiles/search?limit=10&followSuggestion=true',
    () =>
      HttpResponse.json({
        data: mockDatabase.suggestions,
        cursor: createCursor(mockDatabase.suggestions),
      }),
  ),

  follow: http.post(
    'https://dev-api.aladia.io/v2/followers/:followerId/follow',
    async ({ params }) => {
      const { followerId } = params;

      const user = [
        ...mockDatabase.followers,
        ...mockDatabase.followings,
        ...mockDatabase.suggestions,
      ].find((item) => item.id === followerId);

      if (user) {
        user.isFollowing = !user.isFollowing;

        if (user.isFollowing) {
          mockDatabase.suggestions = mockDatabase.suggestions.filter(
            (suggestion) => suggestion.id !== user.id,
          );

          const alreadyInFollowings = mockDatabase.followings.some(
            (following) => following.id === user.id,
          );

          if (!alreadyInFollowings) {
            mockDatabase.followings.push({
              ...user,
              createdAt: new Date().toISOString(),
            });
          }
        } else {
          mockDatabase.followings = mockDatabase.followings.filter(
            (following) => following.id !== user.id,
          );
        }
        await delay(800);
        return HttpResponse.json(
          {
            followed: user.isFollowing || null,
            unfollowed: !user.isFollowing || null,
          },
          { status: 200 },
        );
      }
      await delay(800);
      return HttpResponse.json(
        {
          error: `User with ID ${followerId} not found.`,
        },
        { status: 404 },
      );
    },
  ),

  profile: http.get('https://dev-api.aladia.io/v2/profiles/*', () =>
    HttpResponse.json({
      data: mockDatabase.profile,
      cursor: createCursor(mockDatabase.profile),
    }),
  ),

  deleteFollower: http.delete(
    'https://dev-api.aladia.io/v2/followers/:followerId',
    ({ params }) => {
      const { followerId } = params;
      const existingFollower = mockDatabase.followers.find(
        (follower) => follower.id === followerId,
      );

      if (!existingFollower) {
        return HttpResponse.json(
          { message: 'Follower not found' },
          { status: 404 },
        );
      }

      mockDatabase.followers = mockDatabase.followers.filter(
        (follower) => follower.id !== followerId,
      );

      return HttpResponse.json(
        { message: 'Unfollowed successfully', followerId },
        { status: 200 },
      );
    },
  ),

  retrieveStories: http.get(
    'https://dev-api.aladia.io/v2/stories/*',
    async () => {
      await delay(500);

      return HttpResponse.json(
        {
          data: mockDatabase.mockStories,
          cursor: createCursor(mockDatabase.mockStories),
        },
        { status: 200 },
      );
    },
  ),

  storiesSearch: http.get(
    'https://dev-api.aladia.io/v2/stories/search',
    async ({ request }) => {
      const url = new URL(request.url);
      const ownerId = url.searchParams.get('ownerId') || null;
      const status = url.searchParams.get('status') || 'active';
      const limit = parseInt(url.searchParams.get('limit'), 10) || 20;

      await delay(500);

      let filteredStories = mockDatabase.mockStories;

      if (ownerId) {
        filteredStories = filteredStories.filter(
          (story) => story.owner.id === ownerId,
        );
      }

      if (status) {
        filteredStories = filteredStories.filter(
          (story) => story.visibility === status,
        );
      }

      const limitedStories = filteredStories.slice(0, limit);

      const cursor = {
        prev: null,
        next:
          limitedStories.length < filteredStories.length ? 'next-token' : null,
      };

      return HttpResponse.json(
        {
          data: limitedStories,
          cursor,
        },
        { status: 200 },
      );
    },
  ),

  socialView: http.get(
    'https://dev-api.aladia.io/v2/social-views/*?sortDirection=desc&limit=20',
    async ({ request }) => {
      const url = new URL(request.url);
      const type = url.searchParams.get('type') || 'story';
      const sortDirection = url.searchParams.get('sortDirection') || 'desc';
      const limit = parseInt(url.searchParams.get('limit'), 10) || 20;
      const reaction = url.searchParams.get('reaction') || null;

      const socialViewData = mockDatabase.socialView;

      if (!socialViewData || socialViewData.length === 0) {
        return HttpResponse.json(
          { error: 'No social views found.' },
          { status: 404 },
        );
      }

      let filteredData = socialViewData;

      if (type && type !== 'all') {
        filteredData = filteredData.filter((item) => item.type === type);
      }

      if (reaction) {
        filteredData = filteredData.filter(
          (item) => item.reaction === reaction,
        );
      }

      filteredData.sort((a, b) =>
        sortDirection === 'desc'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt),
      );

      const limitedData = filteredData.slice(0, limit);

      const startIndex = filteredData.indexOf(limitedData[0]);
      const endIndex = filteredData.indexOf(
        limitedData[limitedData.length - 1],
      );

      const cursor = {
        prev: startIndex > 0 ? filteredData[startIndex - 1].id : null,
        next:
          endIndex < filteredData.length - 1
            ? filteredData[endIndex + 1].id
            : null,
      };

      return HttpResponse.json({
        cursor,
        data: limitedData,
      });
    },
  ),

  socialViewUpdate: http.put(
    'https://dev-api.aladia.io/v2/social-views',
    () => {
      const reaction = 'sad';
      const entity = {
        id: '0d955e95-97ff-43d9-9244-b534eb74f7e0',
        type: 'story',
      };

      try {
        const socialViewIndex = mockDatabase.socialView.findIndex(
          (item) => item.storyId === entity.id,
        );

        if (socialViewIndex === -1) {
          return HttpResponse.json(
            { error: 'Social view not found.' },
            { status: 404 },
          );
        }

        mockDatabase.socialView[socialViewIndex] = {
          ...mockDatabase.socialView[socialViewIndex],
          reaction,
          entity,
          updatedAt: new Date().toISOString(),
        };

        return HttpResponse.json(mockDatabase.socialView[socialViewIndex], {
          status: 200,
        });
      } catch (error) {
        console.error('Error handling PUT request:', error);
        return HttpResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 },
        );
      }
    },
  ),

  retrieveaStoryGroup: http.get(
    'https://dev-api.aladia.io/v2/story-groups/*',
    async () => {
      await delay(500);

      return HttpResponse.json(
        {
          data: mockDatabase.storyGroup,
          cursor: createCursor(mockDatabase.storyGroup),
        },
        { status: 200 },
      );
    },
  ),

  listAllRooms: http.get('https://dev-api.aladia.io/v2/rooms', () =>
    HttpResponse.json({
      data: mockDatabase.rooms,
      cursor: createCursor(mockDatabase.rooms),
    }),
  ),

  searchRooms: http.get(
    'https://dev-api.aladia.io/v2/rooms/search',
    async ({ request }) => {
      const url = new URL(request.url);
      const query = url.searchParams.get('query') || '';
      const limit = parseInt(url.searchParams.get('limit'), 10) || 20;

      await delay(500);

      const filteredRooms = mockDatabase.rooms.filter((room) =>
        room.name.toLowerCase().includes(query.toLowerCase()),
      );

      const limitedRooms = filteredRooms.slice(0, limit);

      const cursor = {
        next: limitedRooms.length < filteredRooms.length ? 'next-token' : null,
        prev: null,
      };

      return HttpResponse.json(
        {
          data: limitedRooms,
          cursor,
        },
        { status: 200 },
      );
    },
  ),

  searchComments: http.get(
    'https://dev-api.aladia.io/v2/comments/search?entityId=12345678-abcd-90ef-ghij-1234567890kl&sortDirection=desc&limit=100',
    () =>
      new HttpResponse({
        status: 200,
        body: mockDatabase.comments[0],
      }),
  ),

  removeReactionFromSocialView: http.delete(
    'https://dev-api.aladia.io/v2/social-views/*',
    async () => {
      const socialView = mockDatabase.socialView;

      if (!socialView) {
        return HttpResponse.json(
          { error: 'Social view not found.' },
          { status: 404 },
        );
      }

      socialView.reaction = null;
      socialView.updatedAt = new Date().toISOString();

      return HttpResponse.json(socialView, { status: 200 });
    },
  ),

  toggleHideStories: http.post(
    'https://dev-api.aladia.io/v2/stories/hide',
    async () => {
      const storyGroups = mockDatabase.mockStories;

      if (!storyGroups || storyGroups.length === 0) {
        return HttpResponse.json(
          { error: 'No stories found.' },
          { status: 404 },
        );
      }

      storyGroups.forEach((storyGroup) => {
        storyGroup._stories.forEach((story) => {
          if (!story.hiddenBy) {
            story.hiddenBy = ['default-user'];
          } else {
            const isHidden = story.hiddenBy.includes('default-user');
            if (isHidden) {
              story.hiddenBy = story.hiddenBy.filter(
                (id) => id !== 'default-user',
              );
            } else {
              story.hiddenBy.push('default-user');
            }
          }
        });
      });

      return HttpResponse.json(
        { updated: true, data: storyGroups },
        { status: 200 },
      );
    },
  ),

  listAllReactions: http.get(
    'https://dev-api.aladia.io/v2/reactions?entityId=reaction-id-1&limit=0&sortDirection=desc',
    () =>
      HttpResponse.json({
        data: mockDatabase.reactions,
        cursor: createCursor(mockDatabase.reactions),
      }),
  ),
};

export const emptyHandlers = {
  followers: http.get('https://dev-api.aladia.io/v2/followers/*?limit=10', () =>
    HttpResponse.json({
      data: [],
      cursor: { next: null, prev: null, totalItems: 0 },
    }),
  ),

  followings: http.get(
    'https://dev-api.aladia.io/v2/followers/*/following?limit=10',
    () =>
      HttpResponse.json({
        data: [],
        cursor: { next: null, prev: null, totalItems: 0 },
      }),
  ),

  suggestions: http.get(
    'https://dev-api.aladia.io/v2/profiles/search?limit=10&followSuggestion=true',
    () =>
      HttpResponse.json({
        data: [],
        cursor: { next: null, prev: null, totalItems: 0 },
      }),
  ),
  socialView: http.get(
    'https://dev-api.aladia.io/v2/social-views/*?type=story&sortDirection=desc&limit=20',
    () =>
      HttpResponse.json({
        data: [],
        cursor: { next: null, prev: null },
      }),
  ),
  retrieveStories: http.get('https://dev-api.aladia.io/v2/stories/*', () =>
    HttpResponse.json({
      data: [],
      cursor: { next: null, prev: null, totalItems: 0 },
    }),
  ),
  storiesSearch: http.get('https://dev-api.aladia.io/v2/stories/search', () =>
    HttpResponse.json({
      data: [],
      cursor: { next: null, prev: null, totalItems: 0 },
    }),
  ),
};
