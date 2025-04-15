import { defineStore } from 'pinia';

import { validateURL } from '@/utils';
import {
  getWebhooks,
  testNewWebhook,
  createWebhook,
  updateWebhook, // Import updateWebhook function
  deleteWebhook,
  allWebhookLogsBySearchApi,
  eventsCategoryListApi,
  getWebHookEventsBySearchApi,
  eventsGroupsListApi,
  getWebhookEvents,
  eventsGroupsListBySearchApi,
} from '~/api/v2/webhook';

export const useWebhookStore = defineStore('webhook', {
  state: () => ({
    webhooks: {
      list: [],
      cursor: { next: null, prev: null },
    },

    selectedEventIds: [], // Track selected event IDs as an array
    isNewWebhook: false,
    isEventDetail: false,
    isWebhookEdit: false,
    isWebhookDetail: false,
    webhookLog: {},
    webhookLogStatus: 'all',

    selectedWebhook: {},
    selectedWebhookEvent: {},
    selectedWebhookId: '',
    editedWebhookId: '',
    selectedWebhookEventName: '',

    // Edit webhook
    isWebhookEditSuccess: false,
    isWebhookEditError: false,
    isWebhookEditLoading: false,

    // Delete webhook
    updating: false,
    isWebhookDeletedSuccess: false,

    loading: false,
    creating: false,
    deleting: false,

    // WEBHOOKS LOGS STATE
    webhookLogs: {
      list: [],
      totalRecords: 0,
      cursor: { next: null, prev: null },
    },
    // Loading States
    isLoadingAllLogs: false,
    isLoadingRemovingLog: false,
    isLoadingSearchingLog: false,

    // Success States
    isSuccessAllLogs: false,
    isSuccessRemovingLog: false,
    isSuccessSearchingLog: false,

    // Error States
    isErrorAllLogs: false,
    isErrorRemovingLog: false,
    isErrorSearchingLog: false,

    // Test webhook
    isLoadingTestWebhook: false,
    isSuccessTestWebhook: false,
    isErrorTestWebhook: false,
    testWebhookError: '',

    // create webhook
    isLoadingCreateWebhook: false,
    isSuccessCreateWebhook: false,
    isErrorCreateWebhook: false,

    // events category list
    eventsCategoryList: [],
    isLoadingCategoryEvents: false,

    // events groups list
    eventsGroupsList: [],
    isLoadingGroupsEvents: false,

    // Events List
    isLoadingEvents: false,
    allEventsList: [],

    // webhook dropdown
    activeDropdown: null, // Tracks the currently active dropdown

    // webhook Confirmation popup
    isCreateWebhookConfirm: false,
    isEditWebhookConfirm: false,
    // webhook input Change
    isCreateInputsWebhookChange: false,
    isEditInputsWebhookChange: false,
  }),

  actions: {
    // all webhooks list
    async fetchWebhooks(params = { limit: 20 }) {
      try {
        this.loading = true;
        const { data, cursor } = await getWebhooks(params);
        this.webhooks.list = data;
        this.webhooks.cursor = cursor;
        return;
      } catch (error) {
        console.error('Error fetching webhooks:', error);
      } finally {
        this.loading = false;
      }
    },

    // get webhook events by search
    async getWebHookEventsBySearchStore(category) {
      this.isLoadingEvents = true; // Optionally indicate loading state
      const response = await getWebHookEventsBySearchApi(category);

      this.eventsList = response.data;
    },
    async loadNextWebhookEvents() {
      if (!this.webhookEvents.next) {
        return;
      }
      await this.fetchWebhookEvents({ next: this.webhookEvents.next });
    },

    // retrieve all events list
    async retrieveAllEventsLits() {
      try {
        const response = await getWebhookEvents();
        this.allEventsList = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    // selected Event
    selectEvent(eventId) {
      if (!this.selectedEventIds.includes(eventId)) {
        this.selectedEventIds.push(eventId);
      }
    },

    // deselect Event

    deselectEvent(eventId) {
      this.selectedEventIds = this.selectedEventIds.filter(
        (id) => id !== eventId,
      );
    },

    // Select all events in a category
    selectAllEventsInCategory(eventIds) {
      // Add only unique eventIds by using a Set to remove duplicates
      const uniqueIds = new Set([...this.selectedEventIds, ...eventIds]);
      this.selectedEventIds = Array.from(uniqueIds);
    },

    // Deselect all events in a category
    deselectAllEventsInCategory(eventIds) {
      // Remove event IDs from selectedEventIds
      this.selectedEventIds = this.selectedEventIds.filter(
        (id) => !eventIds.includes(id),
      );
    },

    // event selected
    toggleEventSelection(eventId) {
      if (this.selectedEventIds.includes(eventId)) {
        this.deselectEvent(eventId);
      } else {
        this.selectEvent(eventId);
      }
    },

    // clear all events selected
    clearSelectedEvents() {
      this.selectedEventIds = [];
    },

    // select all events
    selectAllWebhookEvents() {
      // Select all event IDs from all categories, ensuring uniqueness
      const allEventIds = this.eventsGroupsList.flatMap((item) =>
        item.events.map((event) => event.id),
      );

      this.selectedEventIds = Array.from(
        new Set([...this.selectedEventIds, ...allEventIds]),
      );
    },

    // test events
    async testNewWebhook(webhookUrl) {
      if (!webhookUrl) {
        this.selectedWebhookEventName = '';
        return false;
      }
      const isValidInput = validateURL(webhookUrl);
      if (!isValidInput) {
        this.testWebhookError = 'Invalid Url';
        this.isErrorTestWebhook = true;
        this.selectedWebhookEventName = '';
        return false;
      }
      try {
        if (this.isLoadingTestWebhook || !this.selectedWebhookEventName) {
          this.isErrorTestWebhook = true;
          this.selectedWebhookEventName = '';
          return false;
        }
        this.isLoadingTestWebhook = true;
        this.isSuccessTestWebhook = false;
        this.isErrorTestWebhook = false;

        if (isValidInput) {
          const response = await testNewWebhook({
            url: webhookUrl,
            event: this.selectedWebhookEventName,
          });

          if (response.status === 200) {
            this.isSuccessTestWebhook = true;
          } else {
            this.testWebhookError = response.data;
            this.isErrorTestWebhook = true;
          }
        }
      } catch (error) {
        this.testWebhookError = error;
        this.isErrorTestWebhook = true;
      } finally {
        this.isLoadingTestWebhook = false;
      }
    },

    async createWebhook(title, url) {
      if (this.isLoadingCreateWebhook || !this.selectedEventIds.length) {
        return false;
      }

      this.isLoadingCreateWebhook = true;
      this.isSuccessCreateWebhook = false;
      this.isErrorCreateWebhook = false;

      try {
        await createWebhook({
          events: this.selectedEventIds,
          title,
          url,
        });

        this.isSuccessCreateWebhook = true;
      } catch (error) {
        console.error('Error creating webhook:', error);
        this.isErrorCreateWebhook = true;
        return false;
      } finally {
        this.isLoadingCreateWebhook = false;
      }
    },

    // Function to update a webhook
    async updateWebhook(id, data) {
      // Set loading state to true
      this.isWebhookEditLoading = true;
      this.isWebhookEditError = false; // Reset error state
      this.isWebhookEditSuccess = false; // Reset success state

      try {
        const response = await updateWebhook(id, data);

        if (response) {
          this.isWebhookEditSuccess = true; // Set success state
          return true;
        } else {
          this.isWebhookEditError = true; // Handle unsuccessful response
          return false;
        }
      } catch (error) {
        console.error('Error updating webhook:', error);
        this.isWebhookEditError = true; // Set error state
        return false;
      } finally {
        this.isWebhookEditLoading = false; // Ensure loading state is reset
      }
    },

    // function to update a webhook status
    async updateWebhookStatus(id, status) {
      try {
        this.updating = true;
        const response = await updateWebhook(id, { status });

        if (response) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.error('Error updating webhook:', error);
        return false;
      } finally {
        this.updating = false;
      }
    },

    // Function to delete a webhook
    async deleteWebhook(id) {
      this.deleting = true; // Set deleting state to true
      this.isWebhookDeletedSuccess = false; // Reset success state

      try {
        await deleteWebhook(id);
        this.isWebhookDeletedSuccess = true; // Set success state
        return true;
      } catch (error) {
        console.error('Error deleting webhook:', error);
        this.isWebhookDeletedSuccess = false; // Ensure success is false on error
        return false;
      } finally {
        this.deleting = false; // Reset deleting state
      }
    },

    async toggleNewWebhook() {
      this.isNewWebhook = !this.isNewWebhook;
    },

    onSelectedWebHook(webhook) {
      this.selectedWebhook = webhook;
    },

    // WEBHOOK LOGS
    async allWebhookLogsBySearch(webhookId, params) {
      try {
        this.isLoadingAllLogs = true;
        this.isErrorAllLogs = false; // Reset error state
        this.isSuccessAllLogs = false; // Reset success state

        const response = await allWebhookLogsBySearchApi(webhookId, params);
        this.webhookLogs.cursor = response.cursor;
        this.webhookLogs.list = response.data; // Assuming `response.data` contains the logs
        this.webhookLogs.totalRecords = response.totalItems || 0; // Optional: Update metadata
        this.isSuccessAllLogs = true;
      } catch (error) {
        this.isErrorAllLogs = true;
        console.error('Error fetching webhook logs:', error); // Log error for debugging
      } finally {
        this.isLoadingAllLogs = false;
      }
    },

    // Webhook events Category List
    async eventsCategoryListStore() {
      try {
        this.isLoadingCategoryEvents = true; // Optionally indicate loading state
        const response = await eventsCategoryListApi();
        this.eventsCategoryList = response.data;
      } catch (error) {
        console.error('Error fetching events category list:', error);
        // Optionally set an error state here
      } finally {
        this.isLoadingCategoryEvents = false; // Ensure loading state is cleared
      }
    },

    // Webhook events Groups List
    async eventsGroupsListStore(search = '') {
      try {
        this.isLoadingGroupsEvents = true; // Optionally indicate loading state

        const response = search
          ? await eventsGroupsListBySearchApi(search)
          : await eventsGroupsListApi();
        this.eventsGroupsList = response;
      } catch (error) {
        console.error('Error fetching events category list:', error);
        // Optionally set an error state here
      } finally {
        this.isLoadingGroupsEvents = false; // Ensure loading state is cleared
      }
    },

    // webhook dropdown
    setActiveDropdown(id) {
      this.activeDropdown = id; // Sets the active dropdown ID
    },
    clearActiveDropdown() {
      this.activeDropdown = null; // Clears the active dropdown
    },
  },
});
