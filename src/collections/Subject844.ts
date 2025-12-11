import { CollectionConfig } from 'payload'

// 8-4-4 Subjects Collection
export const Subject844: CollectionConfig = {
  slug: 'subjects-844',
  admin: {
    useAsTitle: 'name',
    group: 'Academics',
    defaultColumns: ['code', 'name', 'category', 'isCompulsory', 'maxScore'],
  },
  labels: {
    singular: '8-4-4 Subject',
    plural: '8-4-4 Subjects',
  },

  fields: [
    {
      name: 'code',
      type: 'text',
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'shortName',
      type: 'text',
    },

    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Mathematics', value: 'MATHEMATICS' },
        { label: 'Sciences', value: 'SCIENCES' },
        { label: 'Languages', value: 'LANGUAGES' },
        { label: 'Humanities', value: 'HUMANITIES' },
        { label: 'Technical', value: 'TECHNICAL' },
        { label: 'Business Studies', value: 'BUSINESS' },
        { label: 'Creative Arts', value: 'CREATIVE_ARTS' },
        { label: 'Religious Studies', value: 'RELIGIOUS_STUDIES' },
        { label: 'Physical Education', value: 'PHYSICAL_EDUCATION' },
      ],
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'isCompulsory',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'maxScore',
      type: 'number',
      defaultValue: 100,
    },
    {
      name: 'passMark',
      type: 'number',
      defaultValue: 40,
    },

    {
      name: 'paperCount',
      type: 'number',
      defaultValue: 1,
      min: 1,
      max: 4,
    },

    {
      name: 'papers',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData.paperCount > 0,
      },
      fields: [
        {
          name: 'paperName',
          type: 'text',
          required: true,
        },
        {
          name: 'paperCode',
          type: 'text',
          required: true,
        },
        {
          name: 'maxMarks',
          type: 'number',
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
          defaultValue: 1,
        },
      ],
    },

    {
      name: 'competencies',
      type: 'array',
      fields: [
        {
          name: 'code',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'weight',
          type: 'number',
        },
      ],
    },
  ],

  // -------------------------
  // ACCESS CONTROL (Perfected)
  // -------------------------
  access: {
    read: () => true,

    create: ({ req }) => {
      if (!req.user) return false
      const user = req.user

      // Only super-admin can add global subjects
      if (user.roles?.includes('super-admin')) return true

      // School admin allowed? (your CBC collection allowed only super-admin)
      // To stay consistent with CBC, we allow ONLY super-admin.
      return false
    },

    update: ({ req }) => {
      if (!req.user) return false
      const user = req.user

      // Super admin only
      if (user.roles?.includes('super-admin')) return true
      return false
    },

    delete: ({ req }) => {
      if (!req.user) return false
      const user = req.user

      // Only super admin should delete global academic data
      if (user.roles?.includes('super-admin')) return true
      return false
    },
  },
}
