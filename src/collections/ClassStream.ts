// collections/ClassStream.ts
import type { CollectionConfig } from 'payload'

export const ClassStream: CollectionConfig = {
  slug: 'classStreams',

  admin: {
    useAsTitle: 'streamName',
    defaultColumns: ['streamName', 'streamCode', 'remarks', 'isActive'],
  },

  fields: [
    // 🔐 REQUIRED FOR MULTI-TENANCY

    {
      name: 'streamName',
      type: 'text',
      required: true,
    },
    {
      name: 'streamCode',
      type: 'text',
      required: true,
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
