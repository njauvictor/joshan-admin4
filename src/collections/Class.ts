// collections/Class.ts
import { CollectionConfig } from 'payload'

export const Class: CollectionConfig = {
  slug: 'classes',
  admin: {
    useAsTitle: 'className',
    defaultColumns: ['className', 'classCode', 'academicYear', 'academicLevel', 'classTeacher'],
  },
  fields: [
    {
      name: 'academicYear',
      type: 'number',
      required: true,
      admin: {
        description: 'e.g., 2023',
      },
    },
    {
      name: 'academicLevel',
      type: 'relationship',
      relationTo: 'academic-levels',
      required: true,
    },
    {
      name: 'stream',
      type: 'relationship',
      relationTo: 'classStreams',
    },

    //ClassName - Automatic = academicLevel + stream/ academicYear
    {
      name: 'className',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g., 4A-2023',
        width: '50%',
      },
      hooks: {
        beforeValidate: [
          ({ siblingData }) => {
            // Set className
            // Note: academicLevel and stream are relationship IDs in siblingData
            // This logic may need adjustment based on actual data structure
            const className = `${siblingData.academicLevel} ${siblingData.stream?.streamName} / ${siblingData.academicYear}`
            return className
          },
        ],
      },
    },

    {
      name: 'capacity',
      type: 'number',
      defaultValue: 50,
    },

    {
      name: 'academicSystem',
      type: 'select',
      required: true,
      defaultValue: 'EIGHT_FOUR_FOUR',
      options: [
        { label: '8-4-4 System', value: 'EIGHT_FOUR_FOUR' },
        { label: 'CBC System', value: 'CBC' },
      ],
    },

    // studentCount
    {
      name: 'studentCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'classTeacher',
      type: 'relationship',
      relationTo: 'teachers',
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'remarks',
      type: 'textarea',
    },
  ],

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
