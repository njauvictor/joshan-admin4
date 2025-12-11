// collections/AcademicLevel.ts
import { CollectionConfig } from 'payload'

export const AcademicLevel: CollectionConfig = {
  slug: 'academic-levels',
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['levelCode', 'displayName', 'academicSystem', 'levelOrder', 'isActive'],
  },
  fields: [
    {
      name: 'levelCode',
      type: 'text',
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
    },
    {
      name: 'academicSystem',
      type: 'select',
      required: true,
      options: [
        { label: '8-4-4 System', value: 'EIGHT_FOUR_FOUR' },
        { label: 'CBC System', value: 'CBC' },
      ],
    },
    {
      name: 'levelOrder',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'ageRange',
      type: 'group',
      fields: [
        {
          name: 'minAge',
          type: 'number',
        },
        {
          name: 'maxAge',
          type: 'number',
        },
      ],
    },
    {
      name: 'subjectsRequired',
      type: 'number',
      label: 'Minimum Subjects Required',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],

  // -------------------------
  // ACCESS CONTROL
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
