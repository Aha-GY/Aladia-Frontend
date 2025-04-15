import request from '~/utils/request';

export function getQuestionsOverview(params) {
  return request({
    url: `/analytics/questions/qna/overview`,
    method: 'get',
    params,
  });
}
export function getQuestionsAnsweredByMeOverview(params) {
  return request({
    url: `/analytics/questions/qna/answered-by-me`,
    method: 'get',
    params,
  });
}

export function getQuestionsActivity(params) {
  return request({
    url: `/analytics/questions/qna/activity`,
    method: 'get',
    params,
  });
}

export function getQuestionsRanking(params) {
  return request({
    url: `/analytics/questions/qna/ranking`,
    method: 'get',
    params,
  });
}

export function getQuestionsSolvingRate(params) {
  return request({
    url: `/analytics/questions/qna/solving-rate`,
    method: 'get',
    params,
  });
}

export function getQuestionsReviewsRanking(params) {
  return request({
    url: `/analytics/questions/reviews/ranking`,
    method: 'get',
    params,
  });
}

export function getQuestionsReviewsRating(params) {
  return request({
    url: `/analytics/questions/reviews/rating`,
    method: 'get',
    params,
  });
}

export function getQuestionsReviewsOverview(params) {
  return request({
    url: `/analytics/questions/reviews/overview`,
    method: 'get',
    params,
  });
}

export function getQuestionsStorageOverview(params) {
  return request({
    url: `/analytics/questions/storage/overview`,
    method: 'get',
    params,
  });
}

export function getQuestionsStreamingOverview(params) {
  return request({
    url: `/analytics/questions/streaming/overview`,
    method: 'get',
    params,
  });
}

export function getQuestionsAiOverview(params) {
  return request({
    url: `/analytics/questions/ai-tokens/overview`,
    method: 'get',
    params,
  });
}
