import { Config, Plugin } from 'payload'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { isSuperAdmin } from '@/access/isSuperAdmin'

export const plugins: Plugin[] = [
  multiTenantPlugin<Config>({
    collections: {
      classStreams: {},
      teachers: {},
      classes: {},
      promotionBatches: {},
      students: {},
      parents: {},
      exams: {},
      examResults: {},
    },
    userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    tenantsArrayField: {
      includeDefaultField: false,
    },
  }),
]
