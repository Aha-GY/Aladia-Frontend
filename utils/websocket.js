// WebSocketService.js
import io from 'socket.io-client';

import { BASE_API_URL } from '~/constant';

export default class WebSocketService {
  static instance = null;
  static getInstance() {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  constructor() {
    const url = BASE_API_URL.replace('/v2', '');
    this.url = url;
    this.connect();
  }
  connect() {
    this.socket = io(this.url, {
      transports: ['websocket'],
      path: '/socket.io',
      withCredentials: true,
    });
  }
  disconnect() {
    this.socket.disconnect();
  }
  reconnect() {
    this.disconnect();
    this.connect();
  }

  send(event, data) {
    this.socket.emit(event, data);
  }

  on(event, handler) {
    this.socket.on(event, handler);
  }

  off(event, handler) {
    this.socket.off(event, handler);
  }
}
