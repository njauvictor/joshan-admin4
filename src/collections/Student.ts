// collections/Student.ts
import { CollectionConfig } from 'payload'

export const Student: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'admissionNumber',
    defaultColumns: [
      'admissionNumber',
      'fullName',
      'currentClass',
      'status',
      'gender',
      'academicSystem',
    ],
  },
  fields: [
    {
      name: 'admissionNumber',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'middleName',
          type: 'text',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      required: true,
    },
    {
      name: 'gender',
      type: 'select',
      required: true,
      options: [
        { label: 'Male', value: 'MALE' },
        { label: 'Female', value: 'FEMALE' },
      ],
    },

    {
      name: 'currentClass',
      type: 'relationship',
      relationTo: 'classes',
      required: true,
    },
    {
      name: 'currentStream',
      type: 'relationship',
      relationTo: 'classStreams',
    },
    {
      name: 'currentLevel',
      type: 'relationship',
      relationTo: 'academic-levels',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'ACTIVE',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Graduated', value: 'GRADUATED' },
        { label: 'Transferred', value: 'TRANSFERRED' },
        { label: 'Suspended', value: 'SUSPENDED' },
        { label: 'Dropped Out', value: 'DROPPED_OUT' },
        { label: 'Expelled', value: 'EXPELLED' },
        { label: 'Repeating', value: 'REPEATING' },
        { label: 'Discontinued', value: 'DISCONTINUED' },
        { label: 'On Leave', value: 'ON_LEAVE' },
      ],
    },
    {
      name: 'boardingStatus',
      type: 'select',
      defaultValue: 'DAY_SCHOLAR',
      options: [
        { label: 'Day Scholar', value: 'DAY_SCHOLAR' },
        { label: 'Boarder', value: 'BOARDER' },
        { label: 'Weekly Boarder', value: 'WEEKLY_BOARDER' },
      ],
    },
    {
      name: 'joiningDate',
      type: 'date',
      required: true,
    },
    {
      name: 'admissionYear',
      type: 'text',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'subjects',
      type: 'array',
      fields: [
        {
          name: 'subject',
          type: 'relationship',
          relationTo: ['subjects-844', 'subjects-cbc'],
          required: true,
        },
        {
          name: 'isCompulsory',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    // Parent/Guardian Information
    // {
    //   name: 'parents',
    //   type: 'relationship',
    //   relationTo: 'parents',
    //   hasMany: true,
    //   required: true,
    // },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set full name
        data.fullName = `${data.firstName} ${data.middleName ? data.middleName + ' ' : ''}${data.lastName}`
        return data
      },
    ],
  },

  // ============================================================
  //                     ACCESS CONTROL
  // ============================================================
  access: {
    /**
     * ----------------------------------------
     * READ ACCESS
     * ----------------------------------------
     * - Super Admin: full read
     * - Others: only read items belonging to their tenant(s)
     */
    read: ({ req }) => {
      if (!req.user) return false

      // Super Admin = full access
      if (req.user.roles?.includes('super-admin')) return true

      // Tenant-scoped read
      const tenantIds =
        req.user.tenants?.map((t) => {
          const tenant = t.tenant
          return typeof tenant === 'object' && tenant !== null ? tenant.id : tenant
        }) || []

      return {
        tenant: {
          in: tenantIds,
        },
      }
    },

    /**
     * ----------------------------------------
     * CREATE ACCESS
     * ----------------------------------------
     * - Super Admin
     * - School Admin
     * - Tenant Admin
     */
    create: ({ req }) => {
      if (!req.user) return false
      const user = req.user
      if (user.roles?.includes('super-admin')) return true

      const userTenants = user.tenants || []
      const userRoles = user.roles || []

      return userTenants.some(
        (t) => (t.roles || []).includes('tenant-admin') || userRoles.includes('school-admin'),
      )
    },

    /**
     * ----------------------------------------
     * UPDATE ACCESS
     * ----------------------------------------
     * - Super Admin
     * - School Admin & Tenant Admin only on their tenant’s resource
     */
    update: ({ req }) => {
      if (!req.user) return false
      const user = req.user
      if (user.roles?.includes('super-admin')) return true

      const userTenants = user.tenants || []
      const userRoles = user.roles || []

      return userTenants.some(
        (t) => (t.roles || []).includes('tenant-admin') || userRoles.includes('school-admin'),
      )
    },

    /**
     * ----------------------------------------
     * DELETE ACCESS
     * ----------------------------------------
     * Recommended:
     * - Super Admin only (safer)
     * User requested:
     * - School Admin also allowed
     */
    delete: ({ req }) => {
      if (!req.user) return false
      const user = req.user
      if (user.roles?.includes('super-admin')) return true

      // Only school-admin can delete
      return (user.roles || []).includes('school-admin')
    },
  },
}
