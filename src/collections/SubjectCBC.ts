import type { CollectionConfig } from 'payload'

export const SubjectCBC: CollectionConfig = {
  slug: 'subjects-cbc',

  admin: {
    useAsTitle: 'name',
    group: 'Academics',
    defaultColumns: ['code', 'name', 'strand', 'substrand', 'isCore'],
    description: 'CBC Subject definitions used across all tenants/schools.',
  },

  labels: {
    singular: 'CBC Subject',
    plural: 'CBC Subjects',
  },

  access: {
    // Everyone can read
    read: () => true,

    // Only super-admin can create
    create: ({ req }) => {
      const user = req.user
      return user?.roles?.includes('super-admin') || false
    },

    // Only super-admin can update
    update: ({ req }) => {
      const user = req.user
      return user?.roles?.includes('super-admin') || false
    },

    // Only super-admin can delete
    delete: ({ req }) => {
      const user = req.user
      return user?.roles?.includes('super-admin') || false
    },
  },

  fields: [
    {
      name: 'code',
      type: 'text',
      label: 'Subject Code',
      admin: {
        width: '33%',
      },
    },

    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Subject Name',
      admin: {
        width: '33%',
      },
    },

    {
      name: 'isCore',
      type: 'checkbox',
      defaultValue: true,
      label: 'Is Core Subject?',
      admin: {
        width: '33%',
      },
    },

    {
      name: 'strand',
      type: 'text',
      label: 'Major Strand (Optional)',
      admin: {
        width: '50%',
      },
    },

    {
      name: 'substrand',
      type: 'text',
      label: 'Sub-Strand (Optional)',
      admin: {
        width: '50%',
      },
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'General Description',
    },

    // CBC → Learning Areas → Competencies → Indicators
    {
      name: 'learningAreas',
      type: 'array',
      label: 'Learning Areas',
      labels: {
        singular: 'Learning Area',
        plural: 'Learning Areas',
      },
      fields: [
        {
          name: 'area',
          type: 'text',
          label: 'Area Name',
        },
        {
          name: 'competencies',
          type: 'array',
          labels: { singular: 'Competency', plural: 'Competencies' },
          fields: [
            {
              name: 'code',
              type: 'text',
              required: true,
              admin: { width: '30%' },
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'indicators',
              type: 'textarea',
              label: 'Performance Indicators',
            },
          ],
        },
      ],
    },
  ],
}
