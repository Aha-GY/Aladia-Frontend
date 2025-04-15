export default {
  nav: {
    footer: 'Footer',
    header: {
      and: 'and',
      people: 'People',
      menu: 'Apps',
      visited: 'visited your profile',
      time: {
        prefix: 'last seen',
        now: '{prefix} just now',
        minute: '{diffInMinutes} minute ago',
        hour: '{diffInHours} hour ago',
        days: '{days} day ago',
        minutes: '{prefix} {diffInMinutes} minutes ago',
        hours: '{prefix} {diffInHours} hours ago',
        day: '{days} days ago',
        min: '{min} min ago',
      },
      actions: {
        quick: 'Quick Actions',
        accept: 'Accept',
        decline: 'Decline',
        goTo: 'Go to',
      },
      declined: 'Declined',
      accepted: 'Accepted',
      search: {
        label: 'Search',
        hint: 'Search {type}...',
        trending: 'Most searched question topics',
        result: {
          viewAll: 'Show all search results',
        },
        menu: {
          all: 'All',
          courses: 'Courses',
          profiles: 'Profiles',
          posts: 'Posts',
          question: 'Question on',
          user: 'User',
          replies: 'Replies',
          participants: 'Participants',
        },
      },
      profile: {
        label: 'Profiles',
        clear: 'Clear all',
        status: {
          inactive: 'Inactive for over a month',
        },
        visitors: 'Your profile visitors',
        visited: 'visited your profile',
      },
      update: {
        status: 'Status:',
        id: 'ID:',
        time: 'Time:',
        ip: 'IP Address:',
        api: 'API:',
        source: 'Source:',
        idemp: 'Idemp:',
        origin: 'Origin:',
        show: 'Show More',
        today: 'Today',
        yesterday: 'Yesterday',
        later: 'Later',
        older: 'Older',
        thisWeek: 'This week',
      },
      notification: {
        settings: 'Notification settings',
        reset: {
          name: 'Reset',
          title: 'Reset notifications',
          content:
            'This action will reset all notification settings to default values',
          confirmation: 'Are you sure you want to proceed?',
        },
        alert: {
          enable: 'Enable alerts',
          disable: 'Disable alerts',
        },
        list: {
          title: 'Notifications',
          markAllAsRead: 'Mark all as read',
          markRead: 'Mark as read',
        },
        actions: {
          like: 'liked your post',
          shared: 'shared your post',
          quizRem: 'sent you a quiz reminder',
          default: '{slotOpen}{typeDesc}{slotClosed} {placeholder}',
          folder: {
            updated:
              '{slotOpen}edited {slotClosed} {placeholderName} {slotOpen}inside {slotClosed} {placeholderText}',
            removed:
              '{slotOpen}removed {slotClosed} {placeholderName} {slotOpen}from {slotClosed} {placeholderText}',
          },
          follower: {
            single: 'started following you',
            mutual: 'also started following you',
            unFollow: 'unfollowed you',
            multiple:
              '{slotOpen}and {slotClosed} {senderCount} people {slotOpen}started following you {slotClosed}',
            two: '{slotOpen}and {slotClosed} {name} {slotOpen}started following you {slotClosed}',
          },
          visitor: {
            single: 'visited your profile',
            multiple:
              '{slotOpen}and {slotClosed} {senderCount} people {slotOpen}visited your profile {slotClosed}',
            two: '{slotOpen}and {slotClosed} {name} {slotOpen}visited your profile {slotClosed}',
          },
          story: {
            created:
              'just published a new story, check it out so you don’t miss the content!',
            reacted: 'reacted to your story',
          },
          course: {
            created: 'created a course',
            updated: 'updated a course',
            review:
              '{slotOpen}Congratulation your course {slotClosed} {placeholderName} {slotOpen}is now on the marketplace.{slotClosed}',
            published: 'has requested your review for the course',
            payment:
              '{slotOpen}paid installment {slotClosed} {currentInstallment} {slotOpen}of {slotClosed} {totalInstallment}  {slotOpen}for {slotClosed} {quantity} {slotOpen}licenses of your {slotClosed} {text}',
            subscribe:
              '{slotOpen}paid {slotClosed}{placeholderQuantity} {slotOpen}subscription fee for your {slotClosed}{placeholderText}',
            enroll:
              '{slotOpen}enrolled in your {slotClosed} free {slotOpen}course {slotClosed}{placeholderText}',
            purchased:
              '{slotOpen}purchased {slotClosed}{placeholderQuantity} {slotOpen}of your course {slotClosed} {placeholderText}',
            member: {
              remove: 'removed you from',
              invited: 'invited you in the ',
              roleUpdate: 'modified your role in course to',
              invite: {
                accept: 'accepted your invite in the course',
                decline: 'declined your invite in the course',
              },
            },
            generation: {
              successLabel:
                '{placeholderText} {slotOpen}{typeDesc} {slotClosed}',
              success: 'generated successfully',
              failure: 'course generation unsuccessful. please try again',
            },
          },
          assignment: {
            new: 'created a new assignment',
          },
          post: {
            mentioned: 'mentioned you in a post',
            commented: 'commented on your post',
            reacted: 'reacted to your post',
            created: 'created a post',
          },
          comment: {
            mentioned: 'mentioned you in a comment',
            reacted: 'reacted to your comment',
            replied: 'replied to your comment',
          },
          question: {
            single:
              '{slotOpen}put {slotClosed} {placeholder} {slotOpen}as solved{slotClosed}',
            created: 'created a question',
            category: 'created a question about category',
            course: 'created a question about your course',
            solved: 'solved your question',
            allSolved: 'All your questions are solved',
          },
          answer: {
            created: 'replied to your question',
            teacher: 'teacher replied to your question',
            best: 'marked your reply as the best answer',
          },
          review: {
            created: 'reviewed your course',
            commented: 'replied to your review',
          },
          certificate: {
            got: 'got a',
          },
          experience: {
            work: 'added a new work experience',
            ongoing: {
              work: 'started a new work experience',
              education: 'started a new educational experience',
            },
            education: 'added a new educational experience',
          },
          space: {
            deleted: 'deleted the space',
            updated: 'updated the space',
            member: {
              removed: 'removed you from the space',
              invited: 'invited you to the space',
              roleUpdate: 'modified your role in the space to',
              invite: {
                accept: 'accepted your invite to the space',
                decline: 'declined your invite to the space',
              },
            },
          },
          content: {
            remove: 'Your {entityType} was removed due to a policy violation',
          },
          teacher: {
            become: 'Congratulations! You are now a teacher',
          },
          user: {
            banned:
              'Your account has been suspended for violating terms of service',
          },
          profile: {
            complete: 'Congratulations! You have completed your profile',
            incomplete:
              'Your profile is incomplete. Complete it to enjoy the full experience',
          },
          calendar: {
            deleted: 'deleted the calendar',
            updated: 'updated the calendar',
            member: {
              invited: 'invited you to the calendar',
              roleUpdate: 'updated your role in the calendar to',
              removed: 'removed you from the calendar',
              invite: {
                accept: 'accepted your invite to the calendar',
                decline: 'declined your invite to the calendar',
              },
            },
          },
          streaming: {
            limitExceeded: 'You exhausted all your streaming minutes',
          },
          token: {
            limitExceeded: 'You have used up all your AI tokens',
          },
          storage: {
            name: 'Storage Usage',
            limitExceeded: 'You have run out of storage space',
          },
          organization: {
            deleted: 'deleted the organization',
            create: 'Congratulations! You have created a new organization',
            onboardingComplete: 'Your organization setup is complete',
            member: {
              invited: 'invited you to the organization',
              roleChange: 'updated your role in the organization to',
              removed: 'removed you from the organization',
              invite: {
                decline: 'declined your invite to the organization',
                accept: 'accepted your invite to the organization',
              },
            },
            branch: {
              invited: 'has invited you to be its branch ',
              invite: {
                decline: 'declined your invite to the branch',
                accept: 'accepted your invite to the branch',
              },
            },
          },
          event: {
            created:
              '{slotOpen}created {slotClosed} {placeholderText} {slotOpen}in {slotClosed} {placeholderName}',
            updated:
              '{slotOpen}edited the event {slotClosed} {placeholderText} ',
            deleted:
              '{slotOpen}removed {slotClosed} {placeholderText} {slotOpen}from {slotClosed} {placeholderName}',
            member: {
              invited: 'invited you to the event',
              invite: {
                accept: 'accepted your invite to the event',
                decline: 'declined your invite to the event',
              },
            },
          },
        },
        view: {
          general: 'General Views',
        },
        banner: {
          course: {
            name: 'Courses',
            best: 'Best courses',
            title: 'Create course',
            content:
              'Easily design engaging courses with videos, files, and interactive elements. Choose between on-demand or live courses',
            btnText: 'New Course',
          },
          question: {
            title: 'Make Question',
            content:
              'Get answers to your specific questions from a specialized, active community ready to share knowledge and insights. Dive into any topic and receive expert feedback in real-time!',
            btnText: 'Make a Question',
          },
          space: {
            name: 'Space',
            title: 'Make Space',
            content:
              'Our platform provides {spaceHtmlOpen} spaces {spaceHtmlClosed} where users can store, organize, and share their courses in customizable folders. Easily collaborate with others by sharing content directly within the platform',
            btnText: 'Make a Space',
          },
          payment: {
            name: 'Payment',
          },
          event: {
            title: 'Create Event',
          },
          chat: {
            name: 'Chat',
            personal: 'Personal',
            message: 'Message',
            title: 'Create Chat Room',
          },
          notice: {
            name: 'Notice',
          },
          setting: {
            name: 'Settings',
          },
          post: {
            name: {
              singular: 'Post',
              plural: 'Posts',
            },
            title: 'Create Post',
            suggested: 'Suggested posts for you',
          },
        },
        organization: {
          name: {
            singular: 'Organization',
            plural: 'Organizations',
          },
        },
        user: {
          name: 'Users',
          verified: 'Verified',
          viewAll: 'See all',
          featured: 'Featured users',
        },
        teacher: {
          title: 'Teacher',
          content: 'Create a course, make a question, or create a space',
        },
      },
      notificationDesc: {
        calendar: {
          event: {
            update: 'Event Updates',
            created: 'Get notified when a new event is created',
            deleted: 'Get notified when an event is deleted',
            modified: 'Get notified when an event is modified',
            reminder: {
              upcoming:
                "Reminder for an upcoming event, optionally including the course it's associated with",
              missed:
                'Notification when you miss an event, optionally including the course it is associated with',
              invitations: 'User adds/invites you to an event/calendar',
            },
          },
        },
        course: {
          purchased: 'Get notified when someone purchases your course',
          enrollment: {
            new: 'Get notified when a new course is added to the platform',
            updated:
              'Get notified when a course you are enrolled in is updated',
            startingSoon: 'Get a reminder for courses that are about to start',
          },
          yours: {
            missed:
              'Get notified when you miss a lesson or session in a course',
            new: "Get notified when a new course in a category you're interested in is added to the marketplace",
            tagged: 'Get notified when someone tags your course',
            suspended:
              'Get notified if a course you are enrolled in or teaching has been suspended. This can happen for several reasons',
          },
        },
        payment: {
          upcoming: 'Get a reminder for an upcoming payment',
          installment:
            'Get notified when someone pays an installment for your course',
          subscriptionFee:
            'Get notified when someone pays the subscription fee for your course',
          report: {
            monthly: 'Get a monthly summary of your income and expenses',
            weekly: 'Get a weekly summary of your income and expenses',
          },
          transaction: {
            received: 'Get notified when you receive a payment',
            sent: 'Get notified when you send a payment',
            successful:
              'Get notified when a payment you sent or received is successfully processed',
          },
          issue: {
            failed: 'Get notified when a payment fails',
            refund: 'Get notified when you receive a refund',
            subscriptionRenewal:
              'Get a reminder for an upcoming subscription renewal',
          },
          offer: {
            special: 'Get notified about special offers or discounts',
          },
        },
        question: {
          solved:
            'Get notified when a question you participated in is marked as solved',
          answer: {
            new: 'Get notified when someone answers to your question',
            markedAsBest:
              'Get notified when one of your answers is selected as the best',
            teacher:
              'Get notified when a teacher answers one of your questions',
            all: 'Get notified when all of your pending questions have been answered',
          },
          inCourse:
            'Get notified when someone asks a question about one of your courses',
          inCategory:
            'Get notified when a new question is asked in a category you follow',
        },
        review: {
          new: 'Get notified when someone reviews your course',
          updated:
            'Get notified when someone modifies a review they left on your course',
          comment: 'Get notified when someone comments on your review',
          teacher: {
            responded: 'Get notified when a teacher interacts with your review',
          },
        },
        social: {
          connection: {
            follow: 'Get notified when someone starts following you',
            contact:
              'Get notified when someone adds you as a contact or when a contact request is accepted',
          },
          interaction: {
            title:
              'Get notified when someone likes, comments, or replies to your posts or comments',
            repost: 'Get notified when someone shares your content',
            mention: 'Get notified when someone mentions you in a post',
          },
          profile: {
            visited: 'Get notified when someone views your profile',
            updated: 'Get notified about activity from people you follow',
          },
        },
        space: {
          deleted: 'Get notified when a space you are a member of is deleted',
          edited:
            'Get notified when a space you are a member of is edited, including name changes',
          storage: 'Get notified when your free space is running low',
          invitation: {
            sent: "Get notified when you're invited to a space, folder, or course",
            status: 'Get notified when your invitation is accepted or declined',
            added:
              'Get notified when a user is added or invited to a space, folder, or course',
            removed:
              'Get notified when you or someone else is removed from a space, folder, or course',
          },
          role: {
            changed: 'Get notified when your role in a space is changed',
            assigned:
              "Get notified when you assign or change someone else's role in a space",
          },
        },
        system: {
          profile: {
            ban: 'Get notified if your account is banned',
            becomeTeacher:
              'Get notified about the outcome of your application to become a teacher',
            completed:
              'Get notified when your profile is complete and you can access all features of the platform',
            inComplete:
              'Get a reminder to complete your profile if important information is missing',
            suspend: {
              payment:
                'Get notified if your account has been suspended due to a payment issue',
              content:
                'Get notified if your account has been suspended due to posting inappropriate content',
              report:
                'Get notified if your account has been suspended due to receiving a high volume of reports',
            },
          },
          platform: {
            access: 'Who has access',
            status: {
              update:
                'Get notifications about system updates, scheduled maintenance, or new features',
              storage: 'Get notifications about your storage usage and limits',
              streaming:
                'Get notifications about the quality or issues with streaming',
              access:
                'Get notifications about changes to your access permissions or account restrictions',
            },
          },
        },
        label: {
          course: {
            inCategory: 'New Course in “Category” on Marketplace',
            tagged: 'Your Course has been Tagged',
            invitation: {
              status: 'Accepted/Declined Invitation',
              toSpace: 'User Added/Invited to a Space',
            },
          },
        },
      },
      notificationKey: {
        calendars: {
          label: 'Calendars',
          event: {
            updates: {
              label: 'Event Updates',
              created: 'Event Created',
              deleted: 'Event Deleted',
              modified: 'Event Modified',
            },
            reminders: {
              label: 'Event Reminders',
              upcoming: 'Upcoming Event',
              missed: 'Missed Event',
              invitations: 'Invitations',
            },
          },
        },
        courses: {
          label: 'Courses',
          changes: {
            label: 'Course Updates & Enrollment',
            new: 'New Courses Available',
            updated: 'Course Updates',
            startingSoon: 'Course Starting Soon',
          },
          yours: {
            label: 'Your Courses',
            missed: 'Missed Course',
            inCategory: 'New Course in “Category” on Marketplace',
            tagged: 'Your Course has been Tagged',
            suspended: 'Course Suspended',
          },
        },
        payments: {
          label: 'Payments',
          reports: {
            label: 'Reports',
            monthly: 'Monthly Report',
            weekly: 'Weekly Report',
          },
          transactions: {
            label: 'Transactions',
            received: 'Payment Received',
            sent: 'Payment Sent',
            successful: 'Payment Successful',
            installment: 'Installment Paid',
          },
          course: {
            payment: 'Course Payments',
            purchased: 'Course Purchased',
          },
          subscription: {
            feePaid: 'Subscription Fee Paid',
            renewal: 'Subscription Renewal',
          },
          issues: {
            label: 'Payment Issues & Updates',
            failed: 'Payment Failed',
            refund: 'Refund Issued',
            upcoming: 'Upcoming Payment',
          },
          offers: {
            label: 'Promotions & Offers',
            special: 'Special Offers',
          },
        },
        qas: {
          label: 'Qas',
          general: 'General Q&A Activity',
          answer: {
            label: 'Your Questions',
            yours: 'Answer About Your Question',
            new: 'New Answer',
            markedAsBest: 'Your Answer Marked As Best',
            teacher: 'Teacher Answered Your Question',
            all: 'All Your Questions Answered',
          },
          question: {
            label: 'Question In Course & Categories',
            course: 'New Question In Course',
            category: 'New Question In Category',
            solved: 'Question Marked as Solved',
          },
        },
        reviews: {
          label: 'Reviews',
          new: 'New Review',
          updated: 'Review Updated',
          comment: 'Comment on Review',
          teacherResponded: 'Teacher Responded To Review',
        },
        socials: {
          label: 'Socials',
          connections: {
            label: 'Connections',
            followers: 'New Followers',
            contact: 'New Contact',
          },
          interactions: {
            label: 'Interactions',
            reactions: 'Comments & Reactions',
            reposts: 'Reposts',
            mentions: 'Mentions In Posts',
          },
          profile: {
            label: 'Profile',
            visited: 'User Visited Profile',
            updates: 'Updates From People You Follow',
          },
        },
        spaces: {
          label: 'Spaces',
          invitations: {
            label: 'Invitations & Membership',
            sent: 'Invitation to Space',
            status: 'Accepted/Declined Invitation',
            added: 'User Added/Invited to a Space',
            removed: 'User Removed from Space',
          },
          roles: {
            label: 'Role Management',
            changed: 'Role Changed',
            assigned: 'User Role Assigned or Changed',
          },
          management: {
            label: 'Space Management',
            deleted: 'Space Deleted',
            edited: 'Space Edited',
            storage: 'Low Storage Space',
          },
        },
        systems: {
          label: 'Systems',
          account: {
            label: 'Account & Profile',
            ban: 'Ban',
            becomeTeacher: 'Become a Teacher',
            completed: 'Complete Profile',
            incomplete: 'Incomplete Profile',
            suspend: {
              payment: 'Account Suspended Due to Payment Issue',
              content: 'Account Suspended Due to Inappropriate Content',
              report: 'Account Suspended Due to Massive Reports',
            },
          },
          platform: {
            label: 'Platform Updates & Status',
            updates: 'System Updates',
            storage: 'Storage Status',
            streaming: 'Streaming Status',
            access: 'Access',
            locked: 'No Access',
          },
        },
      },
    },
  },
};
