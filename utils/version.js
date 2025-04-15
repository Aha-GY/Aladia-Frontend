export const fieldsMap = {
  // Course Info
  title: {
    icon: 'far fa-bookmark',
    displayName: 'title',
  },
  thumbnail: {
    icon: 'far fa-image',
    displayName: 'thumbnail',
  },
  trailer: {
    icon: 'fas fa-video',
    displayName: 'trailer',
  },
  color: {
    icon: 'fas fa-square',
    displayName: 'color',
  },
  startDate: {
    icon: 'fal fa-calendar-days',
    displayName: 'start date',
  },
  endDate: {
    icon: 'fal fa-calendar-days',
    displayName: 'end date',
  },
  publishedDate: {
    icon: 'fal fa-calendar-days',
    displayName: 'published date',
  },
  seatCount: {
    icon: 'fas fa-users-line',
    displayName: 'availability',
  },
  language: {
    icon: 'fas fa-language',
    displayName: 'language',
  },
  visibility: {
    icon: 'fas fa-window-restore',
    displayName: 'visibility',
  },
  description: {
    icon: 'fal fa-subtitles',
    displayName: 'description',
  },
  categories: {
    icon: 'fas fa-grid',
    displayName: 'categories',
  },
  subCategories: {
    icon: 'fas fa-grid',
    displayName: 'subcategories',
  },
  subject: {
    icon: 'fas fa-chalkboard-user',
    displayName: 'subject',
  },
  observer: {
    icon: 'fa-sharp fa-light fa-eye',
    displayName: 'observer',
  },
  teacher: {
    icon: 'fas fa-person-chalkboard',
    displayName: 'teacher',
  },
  attendant: {
    icon: 'far fa-user',
    displayName: 'attendant',
  },
  address: {
    icon: 'fa-thin fa-location-dot',
    displayName: 'address',
  },
  calendar: {
    icon: 'fa-solid fa-calendar-plus',
    displayName: 'calendar',
  },
  attachment: {
    icon: 'fa-regular fa-link',
    displayName: 'attachment',
  },
  cycles: {
    icon: 'fas fa-calendar-days',
    displayName: 'cycles',
  },
  objectives: {
    icon: 'fas fa-bullseye',
    displayName: 'objectives',
  },
  requirements: {
    icon: 'far fa-list-check',
    displayName: 'requirements',
  },
  skills: {
    icon: 'fas fa-brain',
    displayName: 'skills',
  },

  // Billing
  'billing.paymentModel': {
    icon: {
      'one-time': 'fas fa-circle-dollar',
      recurring: 'fas fa-chart-pie',
      free: 'fal fa-coin-front',
    },
    displayName: 'payment model',
  },
  'billing.totalPrice': {
    icon: 'fas fa-dollar-sign',
    displayName: 'total price',
  },
  'billing.subscriptionFee': {
    icon: 'far fa-circle-info',
    displayName: 'subscription fee',
  },
  'billing.frequency': {
    icon: 'fas fa-calendar-clock',
    displayName: 'payment frequency',
  },

  // extra billing fields
  'billing.remainingAmount': {
    icon: 'fas fa-dollar-sign',
    displayName: 'remaining amount',
  },
  'billing.installmentsAmount': {
    icon: 'fas fa-dollar-sign',
    displayName: 'installments amount',
  },
  'billing.installmentNumber': {
    icon: 'fas fa-list-ol',
    displayName: 'installment number',
  },

  // Lesson
  lesson: {
    icon: 'fas fa-play',
    displayName: 'lesson',
  },
  // 'lesson.title': {
  //   icon: 'far fa-play',
  //   displayName: 'lesson title',
  // },
  // 'lesson.date': {
  //   icon: 'fal fa-calendar',
  //   displayName: 'lesson date',
  // },
  // 'lesson.duration': {
  //   icon: 'fas fa-clock',
  //   displayName: 'duration',
  // },
  // 'lesson.description': {
  //   icon: 'fal fa-subtitles',
  //   displayName: 'lesson description',
  // },
  // 'lesson.frequency': {
  //   icon: 'fas fa-rotate',
  //   displayName: 'frequency',
  // },

  // Lecture
  lecture: {
    icon: 'fas fa-play',
    displayName: 'lecture',
  },

  // Chapter
  chapter: {
    icon: 'fas fa-bookmark',
    displayName: 'chapter',
  },
  // 'chapter.title': {
  //   icon: 'far fa-bookmark',
  //   displayName: 'chapter title',
  // },
  // 'chapter.date': {
  //   icon: 'far fa-calendar',
  //   displayName: 'chapter date',
  // },

  // User Management
  // 'user.invite': {
  //   icon: 'fas fa-user-plus',
  //   displayName: 'invite user',
  // },
  // 'user.remove': {
  //   icon: 'fas fa-user-minus',
  //   displayName: 'remove user',
  // },
  // 'user.observer': {
  //   icon: 'fas fa-user-lock',
  //   displayName: 'observer',
  // },
  // 'user.teacher': {
  //   icon: 'fas fa-chalkboard-user',
  //   displayName: 'teacher',
  // },
  // 'user.attendant': {
  //   icon: 'fas fa-user-graduate',
  //   displayName: 'attendant',
  // },
};

const actionMap = {
  'ai-generate': 'fas fa-sparkles',
  create: {
    course: 'fal fa-circle-play',
    lecture: 'fas fa-play',
    subject: 'fas fa-chalkboard-user',
    cycle: 'fas fa-calendar-days',
    chapter: 'far fa-bookmark',
  },
  delete: {
    course: 'fal fa-circle-play',
    lecture: 'fas fa-play',
    subject: 'fas fa-chalkboard-user',
    cycle: 'fas fa-calendar-days',
    chapter: 'far fa-bookmark',
  },
  assign: {
    course: 'fas fa-user-plus',
    lecture: 'fas fa-play',
    subject: 'fas fa-chalkboard-user',
    cycle: 'fas fa-calendar-days',
    chapter: 'far fa-bookmark',
  },
  unassign: {
    course: 'fas fa-user-minus',
    lecture: 'fas fa-play',
    subject: 'fas fa-chalkboard-user',
    cycle: 'fas fa-calendar-days',
    chapter: 'far fa-bookmark',
  },
};

const valueMap = {
  // Payment Model values
  'billing.paymentModel': {
    'one-time': 'One Time Payment',
    recurring: 'Recurring Payment',
    free: 'Free',
  },
};

const isCycleDateField = (field) =>
  /^cycles\.\d+\.(startDate|endDate)$/.test(field);

export const transformFieldName = (fieldName) => {
  // Check for cycle date fields first
  const cycleMatch = fieldName.match(/^cycles\.(\d+)\.(startDate|endDate)$/);
  if (cycleMatch) {
    const [, cycleNumber, dateType] = cycleMatch;
    return `cycle ${parseInt(cycleNumber) + 1} ${dateType === 'startDate' ? 'start' : 'end'} date`;
  }

  return fieldsMap[fieldName]?.displayName || fieldName;
};

export const getIcon = (action, field, entityType) => {
  if (action === 'update') {
    if (field.field === 'billing.paymentModel') {
      return fieldsMap[field.field]?.icon[field.current];
    } else if (entityType === 'course') {
      // Check for cycle date fields
      const cycleMatch = field.field?.match(
        /^cycles\.\d+\.(startDate|endDate)$/,
      );
      if (cycleMatch) {
        return 'fal fa-calendar-days';
      }
      return fieldsMap[field.field]?.icon || 'fas fa-circle-info';
    } else {
      return fieldsMap[entityType]?.icon || 'fas fa-circle-info';
    }
  } else {
    if (typeof actionMap[action] === 'object') {
      return actionMap[action][entityType] || 'fas fa-circle-info';
    }
    return actionMap[action] || 'fas fa-circle-info';
  }
};

export const getLogIcon = (log, course) => {
  const { action, entity } = log.activity;

  if (action === 'ai-generate') {
    return {
      type: 'icon',
      class: 'fa-solid fa-sparkles',
    };
  } else if (entity?.type === 'course') {
    if (course?.type === 'live') {
      return {
        type: 'dot',
        class:
          'relative h-3 w-3 rounded-full bg-red-600 group-hover/file:hidden',
      };
    } else if (course?.type === 'on-demand') {
      return {
        type: 'icon',
        class: getIcon(action, [], entity?.type),
      };
    }
  } else if (['lecture', 'chapter', 'subject'].includes(entity?.type)) {
    return {
      type: 'icon',
      class: getIcon(action, [], entity?.type),
    };
  }

  // Fallback icon
  return {
    type: 'icon',
    class: 'fas fa-circle-info',
  };
};

export const transformActivityLog = (activity) => {
  if (!activity) {
    return null;
  }

  const transformed = {
    action: activity.action,
    entityType: activity.entity?.type || '',
    entityName: activity.entity?.name || '',
    fields: [],
  };

  if (activity.fields && Array.isArray(activity.fields)) {
    transformed.fields = activity.fields.map((field) => ({
      ...field,
      displayName: transformFieldName(field.field),
    }));
  }

  return transformed;
};

export const transformDisplayValue = (field, value) => {
  if (!field || !value) {
    return value;
  }

  // Check if there's a mapping for this field
  const fieldMapping = valueMap[field];
  if (fieldMapping && fieldMapping[value]) {
    return fieldMapping[value];
  }

  // format date
  if (
    field === 'startDate' ||
    field === 'endDate' ||
    field === 'publishedDate' ||
    isCycleDateField(field)
  ) {
    return formatDate(value, 'DD/MM/YYYY');
  }

  if (field === 'seatCount') {
    if (parseInt(value) === -1) {
      return 'Unlimited';
    }
    return `${value} seats`;
  }

  return value;
};
