// 维护需要特殊处理的接口常量
export const REQUEST_ERROR_MESSAGE = {
  401: {
    message: 'Please login again',
    statusCode: 401,
  },
  403: {
    statusCode: 403,
    FREE_TIER_EXHAUSTED: {
      STORAGE_FREE_TIER_FINISHED: {
        errorCode: 'storage-free-tier-finished',
      },
      STREAMING_FREE_TIER_FINISHED: {
        errorCode: 'streaming-free-tier-finished',
      },
      AI_FREE_TIER_FINISHED: {
        errorCode: 'ai-free-tier-finished',
      },
      message: 'Free tier exhausted',
    },
    FAILED_TO_PAY: {
      errorCode: 'user-has-failed-payments',
      message: 'Failed to pay',
    },
  },
};
