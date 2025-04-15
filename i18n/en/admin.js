export default {
  admin: {
    course: {
      publish: 'Publish',
      reject: 'Reject',
      published: 'will be published?',
      rejected: 'will be rejected?',
    },
    categories: {
      upper: 'CATEGORIES',
    },
    courses: {
      reviews: {
        upper: 'COURSES REVIEWS',
      },
    },
    content: {
      label: 'Content',
      type: 'Type',
      unblock: 'Unblock',
      entity: {
        type: 'Entity Type',
        id: 'Entity ID',
      },
      moderation: {
        upper: 'CONTENT MODERATION',
        header: {
          userId: 'User ID',
          email: 'Email',
        },
      },
    },
    role: {
      title: 'Roles and Permisions',
      org: {
        title: 'Organization Roles',
        admin: {
          title: 'Organizatin Admin:',
          description:
            'Can perform a wide range of actions within the organization, with certain limitations compared to the Owner',
        },
        member: {
          title: 'Organizatin Member:',
          description:
            'Has limited permissions, primarily to view information without the ability to edit or delete anything',
        },
        user: 'Organizatin Member:',
      },
      space: {
        title: 'Space Roles',
        supervisor: {
          title: 'Space Supervisor:',
          description:
            'Responsible for managing courses and creating new folders within a space',
        },
        coordinator: {
          title: 'Space Coordinator:',
          description:
            'Manages the space with fewer permissions than the Supervisor',
          description2:
            'Cannot create or delete courses but can manage space settings',
        },
        member: {
          title: 'Space Member:',
          description: 'Can only view content within the space',
        },
      },
      course: {
        title: 'Course Roles',
        observer: {
          title: 'Course Observer:',
          description: 'Has full control over the course',
        },
        teacher: {
          title: 'Teacher:',
          description:
            'Can create, edit, and manage courses, but cannot delete them',
        },
        attendant: {
          title: 'Course Attendant:',
          description:
            'Restricted to viewing courses without any editing or creation permissions',
        },
        owner: {
          title: 'Course Owner:',
          description:
            'Has full control over courses within their domain, including creating, updating, and deleting courses',
        },
      },
      calendar: {
        title: 'Calendar Roles',
        participant: {
          title: 'Calendar Participant:',
          description:
            'Limited to viewing calendars, with no ability to edit, create or delete them',
          description2:
            'Limited to viewing events, with no ability to edit, create or delete them',
        },
        scheduler: {
          title: 'Calendar Scheduler:',
          description:
            'Limited to viewing and updating calendars without any deleting or creation permissions',
          description2:
            'Has full control over events within their calendar, including creating, updating, and deleting events',
        },
        organizer: {
          title: 'Calendar Organizer:',
          description:
            'Has full control over the calendars, including creating, updating, and deleting calendars',
          description2:
            'Has full control over events within their calendar, including creating, updating, and deleting events',
        },
      },
      event: {
        title: 'Event Roles',
        guest: {
          title: 'Event Guest:',
          description:
            'Limited to viewing events, with no ability to edit, create or delete them',
        },
        coHost: {
          title: 'Event Co-Host:',
          description:
            'Limited to viewing and updating events within their calendar without any deleting or creation permissions',
        },
        host: {
          title: 'Event Host:',
          description:
            'Has full control over events within their calendar, including creating, updating, and deleting courses',
        },
      },
    },
  },
};
