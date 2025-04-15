// plugins/eventBus.js
import mitt from 'mitt';

const eventBus = mitt();

export default defineNuxtPlugin(() => ({
  provide: {
    eventBus,
  },
}));
