import type { CollectionConfig } from 'payload'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { isSuperAdmin } from '@/access/isSuperAdmin'
import { authenticated } from '@/access/authenticated'
const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  tenantsCollectionSlug: 'tenants',
  arrayFieldAccess: {},
  tenantFieldAccess: {},
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
      access: {
        update: ({ req }) => {
          const { user } = req
          if (!user) {
            return false
          }

          if (isSuperAdmin(user)) {
            return true
          }

          return false
        },
      },
    },
  ],
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      admin: {
        position: 'sidebar',
      },
      name: 'roles',
      type: 'select',
      defaultValue: ['user'],
      hasMany: true,
      options: [
        'super-admin',
        'school-admin',
        'teacher',
        'accountant',
        'staff',
        'user',
        'parent',
        'student',
      ],
      access: {
        update: () => true,
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterLogin: [],
  },
}
