import { CollectionConfig } from 'payload'

export const Parent: CollectionConfig = {
  slug: 'parents',
  admin: {
    useAsTitle: 'parentName',
    defaultColumns: ['parentName', 'parentPhone', 'parentEmail', 'parentRelationship', 'isActive'],
  },

  fields: [
    // Parent Information
    {
      name: 'parentName',
      type: 'text',
      required: true,
    },

    {
      name: 'parentPhone',
      type: 'text',
      required: true,
    },

    {
      name: 'parentEmail',
      type: 'email',
    },

    {
      name: 'parentRelationship',
      type: 'select',
      required: true,
      options: [
        { label: 'Father', value: 'FATHER' },
        { label: 'Mother', value: 'MOTHER' },
        { label: 'Relative', value: 'RELATIVE' },
        { label: 'Guardian', value: 'GUARDIAN' },
        { label: 'Sponsor', value: 'SPONSOR' },
      ],
    },

    //student relationships
    {
      name: 'students',
      type: 'relationship',
      relationTo: 'students',
      hasMany: true,
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'address',
      type: 'textarea',
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
