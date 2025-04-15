export default {
  meet: {
    others: 'Others',
    accept: 'Accept',
    active: 'Active',
    live: 'Live',
    ended: 'Ended',
    draft: 'Draft',
    rejoin: 'Rejoin',
    joinAs: 'Join as',
    from: 'from',
    you: 'You',
    continues: 'Meet Started',
    future: 'Meet Not Started',
    past: 'Meet Ended',
    settings: 'Settings',
    ongoing: 'Ongoing for:',
    roomId: 'RoomId:',
    recordings: 'Recordings',
    beReady: {
      label: 'Getting ready...',
      description: "You'll be able to join just a moment",
    },
    member: {
      online: 'Online Users',
    },
    visual: {
      warning:
        'Your camera is turned off. And selecting an effect will turn it on',
      virtual: {
        background: 'Virtual Background',
        error: 'add virtual background plugin failed',
        plugin: {
          add: 'add virtual background plugin failed',
        },
      },
      effects: {
        label: 'Visual Effects',
        none: 'None',
        blur: {
          label: 'Blur',
          intensity: {
            label: 'Blur intensity',
            low: 'Low',
            medium: 'Medium',
            high: 'High',
          },
        },
      },
    },
    peer: {
      joined: 'Peer Joined',
      leave: 'Peer Leave',
      handRaised: 'Hand Raised',
      message: 'New Message',
      error: 'Error',
    },
    roles: {
      hosts: 'Hosts',
      coHosts: 'Co-hosts',
      host: '{name} Host',
      coHost: '{total} Co-host',
      guest: '{total} Guest',
      guests: 'Guests',
    },
    options: {
      label: 'Option',
      pin: 'Pin',
      unPin: 'Unpin',
    },
    setting: {
      video: 'Video settings',
      audio: 'Audio settings',
      label: 'Settings',
      layout: 'Layout',
      notifications: 'Notifications',
      tile: {
        view: 'Tiles in view ({tileCount})',
      },
      device: {
        video: 'Video',
        audio: 'Audio',
        speaker: 'Speakers',
        noise: 'Reduce Noise',
        controls: 'Device Controls',
      },
    },
    partecipants: {
      hand: {
        title: 'Raised Hands',
        label: 'Frist to last',
        lowerAll: 'Lower All',
        lower: 'Lower',
      },
    },
    actions: {
      notJoined: 'Not joined',
      more: 'More Options',
      joined: '{name} joined',
      left: '{name} left',
      your: '(Your)',
      presentation: {
        label: 'Presentation',
        stop: 'Stop Presentation',
        pin: 'Pin presentation',
        unPin: 'Unpin presentation',
        watch: {
          start: 'Start Watching',
          stop: "Don't watch",
        },
      },
      quick: 'Quick Actions',
      whiteboard: 'Whiteboard',
      recording: 'Recording',
      create: 'Create',
      start: 'Start',
      stop: 'Stop',
      save: {
        question: 'Please save all questions to launch',
      },
      remove: {
        participant: 'Remove participant',
        call: 'Remove from call',
        coHost: 'Remove as co-host',
      },
      write: {
        submit: 'Submit',
        report: {
          abuse: 'Report abuse',
          label: 'Report',
          title: 'Write your report',
          placeholder: 'Tell us what you think',
        },
        review: {
          label: 'Review',
          title: 'Write your review',
          placeholder: 'Tell us what you think',
        },
      },
      report: {
        issue: 'Report an issue',
      },
      request: {
        video: {
          mute: 'Request to mute Video for All',
          unmute: 'Request to unmute Video for All',
        },
        audio: {
          mute: 'Request to mute Audio for All',
          unmute: 'Request to unmute Audio for All',
        },
      },
      video: {
        mute: 'Close Video',
        unmute: 'Request to Open Video',
        sent: 'Open video Request sent',
      },
      audio: {
        mute: 'Mute Audio',
        unmute: 'Request to unmute audio',
        sent: 'Unmute Request sent',
      },
      pin: {
        screen: {
          all: 'Pin to the screen for All',
          myself: 'Pin to the screen for myself',
        },
        all: 'Pin for all',
        myself: 'Pin for myself',
      },
      unPin: {
        screen: {
          all: 'Unpin to the screen for All',
          myself: 'Unpin to the screen for myself',
        },
        all: 'Unpin for all',
        myself: 'Unpin for myself',
      },
      spotlight: {
        all: 'Spotlight for all',
        myself: 'Spotlight for myself',
      },
      unSpotlight: {
        all: 'Unspotlight for all',
        myself: 'Unspotlight for myself',
      },
      hand: {
        raise: '{name} raised their hand',
      },
      started: 'A {dataType} was started',
      mute: {
        request: '{requestedBy} mutted your {type}',
      },
      internet: {
        reconnecting:
          'You are offline for now. While we try to reconnect, please check your internet connection',
        reconnected: 'You are now reconnected',
      },
      permission: {
        error: 'Error: {error}',
        system: 'Please enable permissions from system settings',
        browser:
          'Please enable permissions from the address bar or browser settings',
      },
    },
    play: {
      sound: 'Playing Sound...',
      test: 'Play Test Sound',
      audio: {
        error: {
          title: "Couldn't Play Audio :(",
          description:
            'The browser wants us to get a confirmation for playing the Audio. Please allow audio to proceed',
          label: 'Allow Audio',
        },
      },
    },
    join: {
      error: "Can't join => {err}",
      start: 'Getting Started',
      content: '- setup your audio and video before joining',
      future:
        "The meeting hasn't started yet. Feel free to return closer to the start time! It’s scheduled to begin in",
      first: {
        label: "You're the ",
        rank: 'first one',
        description: 'here!',
      },
      middle: {
        description1: 'and other',
        description2: 'people are',
        time: 'in meet since',
      },
    },
    present: {
      now: 'Are you sure to present now?',
      takeOver:
        'This will let you to take over from {name} as the main presenter',
    },
    chat: {
      reply: 'Reply to:',
      everyone: 'Everyone',
      error: 'Failed to send message - {error}',
    },
    conversation: {
      start: 'Welcome to Chat',
      send: {
        message1: 'Start a conversation by sending',
        message2: 'a message here',
      },
    },
    pin: {
      label: 'Pin',
      default: 'Pinned by You ',
      action: 'Pinned by {name} ',
    },
    menu: {
      chat: 'Chat',
    },
    banner: {
      activity: {
        label: 'Activities',
        btnText: 'Explore more',
        content:
          'Create more dynamic and interactive meeting experience with polls and quizzes. Get real-time feedback and insights from your participants',
      },
      quiz: {
        answer: {
          yours: 'Your answer',
        },
        addOption: 'Add an option',
        title: 'quiz {index} of {total} ',
        tip: 'Use the radio buttons to indicate the correct answer',
        label: 'Quizzes',
        create: 'Create a new Quiz',
        btnText: 'Create a Quiz',
        content:
          'Learn and engage with quizzes on a variety of topics. From trivia educational challenges there is something for everyone to learn in an engaging way',
      },
      poll: {
        answer: {
          yours: 'Your answer',
        },
        label: 'Poll {index} of {total} ',
        create: 'Create a new Poll',
        title: 'Polls',
        content:
          'Enhance your session with polls and get instant feedback on key topics. Measure audience sentiment, and make informed decisions based on real-time data',
        btnText: 'Create a Poll',
        error: {
          create: 'Failed to create poll - {error}',
          noQuestion: 'Please enter question',
          noOption: 'Please enter option',
          minOption: 'Please enter at least two options',
          correct: 'Please select one correct answer for each question',
        },
      },
      share: {
        with: 'Share With...',
        title: 'Content Sharing',
        content:
          'Using a white board for brainstorming and PDFs for detailed documents creates dynamic, effective content sharing in collaborative sessions',
        btnText: 'Create a Whiteboard',
      },
      record: {
        title: 'Record Meeting',
        stop: {
          label: 'Stop Recording',
          title: 'Stop Recording Meeting',
          done: 'Recording stopped',
          failed: 'failed to stop hls',
        },
        content:
          'You can capture discussions and decisions providing a valuable reference for attendees and absentees alike. Also aids in future review',
        btnText: 'Start Recording',
        save: 'The meeting up to this point will be saved and linked in the calendar event',
      },
    },
    unmute: {
      title: 'Unmute Request',
      content: 'is requesting you to unmute your {type}',
    },
    microphone: {
      label: 'Microphone',
      on: 'Turn on microphone',
      off: 'Turn off microphone',
    },
    camera: {
      on: 'Turn on camera',
      off: 'Turn off camera',
    },
    pip: {
      title: 'Your meeting call is in another window',
      description:
        'Using picture-in-picture let’s you stay in the call while you do other things',
      button: 'Bring the call back here',
    },
    file: {
      upload: 'Your work is safe with us thanks to automatic syncing!',
    },
    presenter: {
      you: 'You (presenting)',
      others: '{name} (presenting)',
    },
    room: {
      link: {
        copy: {
          success: 'Room link copied to clipboard',
          fail: 'Failed to copy room link to clipboard',
        },
      },
    },
    screen: {
      label: 'Screen',
      present: 'Share another screen',
      stop: {
        label: 'Stop',
        present: 'Stop presenting',
      },
      share: {
        window: 'Present now',
        pdf: 'Share PDF',
        content: 'Choose PDF you want to annotate and share',
        file: {
          drag: 'Drag and Drop',
          or: 'or',
          browse: 'Click To Upload',
          error: 'Please upload the file in PDF format',
        },
      },
      whiteBoard: 'Whiteboard',
    },
    layout: {
      tiled: 'Tiled',
      sidebar: 'Sidebar',
      audio: 'Audio only mode',
      video: 'Mirror local video',
      hide: 'Hide local video',
      save: 'Your selection is saved for future meetings',
      change: 'Change layout',
      fScreen: {
        label: 'Full Screen',
        quit: 'Exit Full Screen',
        error: 'Could not enable full-screen mode: {error}',
      },
      pip: {
        error: 'Picture-in-Picture is unsupported in this browser',
        enable: 'Enable Picture-in-Picture',
        disable: 'Disable Picture-in-Picture',
      },
      tile: {
        label: 'Tiles',
        hide: 'Hide video-off tiles',
        max: 'Maximum tiles shown based on window size',
      },
      apply: {
        visual: 'Apply visual effects',
      },
    },
    recording: {
      start: 'Start recording',
      stop: 'Stop recording',
    },
    option: {
      more: 'More options',
    },
    admit: {
      error: 'No host or co-host to in the room, Cannot admit a guest user',
    },
    end: {
      leave: 'Return to home page',
      left: 'You have left the meeting',
      error: 'Only the host or co-host can end the room',
      room: 'End room',
      session: 'End session',
      call: 'End call for all',
      feedback: {
        label: 'Feedback',
        dialog: 'How was the audio and video?',
        submit: 'Submit feedback',
        bad: 'Bad',
        excellent: 'Excellent',
        submitted: 'Feedback submitted, thank you!',
        usage: 'We will use your feedback to improve our service',
      },
    },
    leave: {
      call: 'Leave call',
      session: 'Leave session',
    },
    header: {
      rec: 'REC',
    },
    footer: {
      emoji: {
        tooltip: 'Send a reaction',
        participants: 'Participants',
        activities: 'Activities',
        hand: {
          raise: 'Raise hand',
          lower: 'Lower hand',
        },
      },
    },
    disconnect: {
      leave: 'Leave now',
      stay: 'Stay in the call',
      title: 'Are you still there?',
      description: "You've been inactive. Do you want to stay in the call?",
    },
    hls: {
      stop: {
        success: 'Recording saved and linked in the calendar event',
        fail: 'Failed to stop recording',
      },
      failed: 'Failed to start recording',
      start: 'Start recording',
      started: 'Recording started',
      title: 'Request consent',
      description:
        'Recording without consent may be illegal. Ensure all participants consent',
    },
    error: {
      share: {
        iframe: 'Attach a reference `iframeRef` to iframe to share',
        shared: 'Already sharing',
        annotator: 'Error sharing annotator',
        screen: 'Unable to start screen sharing',
      },
      notFound: {
        file: 'File or URL not found',
        track: 'Local video track not found',
      },
    },
    users: {
      show: {
        less: 'Show fewer users',
      },
    },
  },
};
