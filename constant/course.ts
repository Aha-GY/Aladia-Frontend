export enum CourseStatus {
  DRAFT = 'draft',
  VERIFYING = 'verifying',
  REJECTED = 'rejected',
  UPDATED = 'updated',
  PENDING_VERIFICATION = 'pending_verification',
  PUBLISHED_VERIFYING = 'published_verifying',
  PUBLISHED = 'published',
  ONGOING = 'ongoing', // Only for onLive and Hybrid courses
  ENDED = 'ended', // Only for onLive and Hybrid courses
  UNPUBLISHED = 'unpublished',
}

export enum COURSE_TYPE {
  ON_DEMAND = 'on-demand',
  LIVE = 'live',
}
