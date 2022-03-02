export default {
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
    },
    {
      name: 'comment',
      title: 'Comment',
      type: 'string',
    },
    {
      name: 'post',
      title: 'Post',
      type: 'reference',
      to: [
        {
          type: 'post',
        },
      ],
    },
    {
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      description: 'Comments will not be shown until approved',
    },
  ],
};
