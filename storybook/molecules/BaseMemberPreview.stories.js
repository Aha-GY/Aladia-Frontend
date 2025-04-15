import BaseMemberPreview from '~/components/Base/Member/Preview.vue';

const meta = {
  title: 'Molecules/BaseMemberPreview',
  component: BaseMemberPreview,
  tags: ['autodocs'],
  argTypes: {
    width: { control: 'text' },
    border: { control: { type: 'boolean' } },
    members: { control: { type: 'object' } },
    max: { control: { type: 'number' } },
    total: { control: { type: 'number' } },
    gap: { control: 'text' },
    open: { control: { type: 'boolean' } },
    add: { control: { type: 'boolean' } },
    remove: { control: { type: 'boolean' } },
    online: { control: { type: 'boolean' } },
    addIconSizeClass: { control: 'text' },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Default = {
  args: {
    members: [
      {
        id: 1,
        picture:
          'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
        online: true,
      },
      {
        id: 2,
        picture:
          'https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp',
        online: false,
      },
    ],
    max: 4,
    total: 2,
    width: '1.75rem',
    gap: '0.75rem',
    border: false,
    open: false,
    add: false,
    remove: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19286-103134&t=SHmnVn8M6wQwWBZa-0',
    },
  },
};

export const WithBorder = {
  args: {
    members: [
      {
        id: 1,
        picture:
          'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
        online: true,
      },
      {
        id: 2,
        picture:
          'https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp',
        online: false,
      },
    ],
    max: 4,
    total: 2,
    width: '1.75rem',
    gap: '0.75rem',
    border: true,
    open: false,
    add: false,
    remove: false,
  },
};

export const AddMemberMode = {
  args: {
    members: [
      {
        id: 1,
        picture:
          'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
        online: true,
      },
      {
        id: 2,
        picture:
          'https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp',
        online: false,
      },
    ],
    max: 4,
    total: 5,
    width: '1.75rem',
    gap: '0.75rem',
    border: false,
    open: true,
    add: true,
    remove: false,
  },
};

export const RemoveMemberMode = {
  args: {
    members: [
      {
        id: 1,
        picture:
          'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
        online: true,
      },
      {
        id: 2,
        picture:
          'https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp',
        online: false,
      },
    ],
    max: 4,
    total: 4,
    width: '1.75rem',
    gap: '0.75rem',
    border: false,
    open: false,
    add: false,
    remove: true,
  },
};

export const OverflowMembers = {
  args: {
    members: [
      {
        id: 1,
        picture:
          'https://play-lh.googleusercontent.com/jInS55DYPnTZq8GpylyLmK2L2cDmUoahVacfN_Js_TsOkBEoizKmAl5-p8iFeLiNjtE=w526-h296-rw',
        online: true,
      },
      {
        id: 2,
        picture:
          'https://pics.craiyon.com/2023-11-26/oMNPpACzTtO5OVERUZwh3Q.webp',
        online: false,
      },
      {
        id: 3,
        picture:
          'https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/e76d4296-43f3-493b-9d50-f8e5c142d06c/2117667014/boys-profile-picture-screenshot.png',
        online: true,
      },
      {
        id: 4,
        picture:
          'https://marketplace.canva.com/EAFqNrAJpQs/1/0/1600w/canva-neutral-pink-modern-circle-shape-linkedin-profile-picture-WAhofEY5L1U.jpg',
        online: true,
      },
      {
        id: 5,
        picture:
          'https://img.chelseafc.com/image/upload/f_auto,h_390,q_90/editorial/people/first-team/2024-25/Joao_Felix_profile_2024-25_headshot_v2-removebg.png',
        online: false,
      },
    ],
    max: 3,
    total: 5,
    width: '1.75rem',
    gap: '0.75rem',
    border: false,
    open: false,
    add: false,
    remove: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/8j70SsjRp6l7Jh1aEFhCOK/Profile-Pages-Redesign?node-id=19283-103060&t=SHmnVn8M6wQwWBZa-0',
    },
  },
};
