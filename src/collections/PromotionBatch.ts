// collections/PromotionBatch.ts
import { CollectionConfig } from 'payload'

export const PromotionBatch: CollectionConfig = {
  slug: 'promotionBatches',
  admin: {
    useAsTitle: 'id',
    defaultColumns: [
      'name',
      'fromAcademicYear',
      'toAcademicYear',
      'fromLevel',
      'toLevel',
      'status',
      'promotionDate',
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'fromAcademicYear',
      type: 'number',
      required: true,
      min: 2000,
      max: 2100,
    },
    {
      name: 'toAcademicYear',
      type: 'number',
      required: true,
      min: 2000,
      max: 2100,
    },
    {
      name: 'fromLevel',
      type: 'relationship',
      relationTo: 'academic-levels',
      required: true,
    },
    {
      name: 'toLevel',
      type: 'relationship',
      relationTo: 'academic-levels',
      required: true,
    },
    {
      name: 'promotionDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'promotedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'totalStudents',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'promotedCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'retainedCount',
      type: 'number',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'In Progress', value: 'IN_PROGRESS' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Rolled Back', value: 'ROLLED_BACK' },
      ],
    },
    {
      name: 'completedAt',
      type: 'date',
    },
    {
      name: 'rules',
      type: 'group',
      fields: [
        {
          name: 'promotionCriteria',
          type: 'select',
          defaultValue: 'ACADEMIC',
          options: [
            { label: 'Academic Performance', value: 'ACADEMIC' },
            { label: 'Attendance', value: 'ATTENDANCE' },
            { label: 'Behavioral', value: 'BEHAVIORAL' },
            { label: 'Combined', value: 'COMBINED' },
          ],
        },
        {
          name: 'minAttendance',
          type: 'number',
          defaultValue: 75,
          label: 'Minimum Attendance %',
        },
        {
          name: 'minAverageScore',
          type: 'number',
          defaultValue: 40,
        },
        {
          name: 'maxFailedSubjects',
          type: 'number',
          defaultValue: 2,
        },
      ],
    },
    {
      name: 'studentDetails',
      type: 'array',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          name: 'fromAcademicLevel',
          type: 'relationship',
          relationTo: 'academic-levels',
          required: true,
        },
        {
          name: 'toAcademicLevel',
          type: 'relationship',
          relationTo: 'academic-levels',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Promoted', value: 'PROMOTED' },
            { label: 'Retained', value: 'RETAINED' },
            { label: 'Conditional', value: 'CONDITIONAL' },
            { label: 'Graduated', value: 'GRADUATED' },
            { label: 'Discontinued', value: 'DISCONTINUED' },
          ],
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data || (operation !== 'create' && operation !== 'update')) {
          return data
        }

        // Validate academic year increment
        if (data.fromAcademicYear && data.toAcademicYear) {
          if (data.toAcademicYear !== data.fromAcademicYear + 1) {
            throw new Error('toAcademicYear must be exactly one year after fromAcademicYear')
          }
        }

        // Validate academic level progression
        if (data.fromLevel && data.toLevel && req.payload) {
          try {
            const fromLevelDoc = await req.payload.findByID({
              collection: 'academic-levels',
              id: typeof data.fromLevel === 'object' ? data.fromLevel.id : data.fromLevel,
            })

            const toLevelDoc = await req.payload.findByID({
              collection: 'academic-levels',
              id: typeof data.toLevel === 'object' ? data.toLevel.id : data.toLevel,
            })

            // Check if levels are from the same academic system
            if (fromLevelDoc.academicSystem !== toLevelDoc.academicSystem) {
              throw new Error('Cannot promote between different academic systems')
            }

            // Check if toLevel is the next level (levelOrder + 1)
            if (toLevelDoc.levelOrder !== fromLevelDoc.levelOrder + 1) {
              throw new Error('toLevel must be the next academic level after fromLevel')
            }
          } catch (error) {
            // If levels don't exist or other error, throw validation error
            throw new Error('Invalid academic levels provided')
          }
        }
        return data
      },
    ],
    beforeChange: [
      ({ req, data }) => {
        if (req.user) {
          data.promotedBy = req.user.id
        }
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
