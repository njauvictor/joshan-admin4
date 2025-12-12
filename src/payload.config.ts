import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, Config } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { AcademicLevel } from './collections/AcademicLevel'
import { ClassStream } from './collections/ClassStream'
import { Subject844 } from './collections/Subject844'
import { SubjectCBC } from './collections/SubjectCBC'
import { Teacher } from './collections/Teacher'
import { Class } from './collections/Class'
import { Student } from './collections/Student'
import { Parent } from './collections/Parent'
import { PromotionBatch } from './collections/PromotionBatch'
import { Exams } from './collections/Exams'
import { ExamResults } from './collections/ExamResults'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { isSuperAdmin } from './access/isSuperAdmin'
import { getUserTenantIDs } from './utilities/getUserTenantIDs'
import Users from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Tenants,
    AcademicLevel,
    ClassStream,
    Subject844,
    SubjectCBC,
    Teacher,
    Class,
    Student,
    Parent,
    PromotionBatch,
    Exams,
    ExamResults,
  ],

  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  // CORS configuration for production (Vercel)
  cors: [
    process.env.NODE_ENV === 'production' && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  ].filter(Boolean),
  // CSRF protection configuration
  csrf: [
    process.env.NODE_ENV === 'production' && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
  ].filter(Boolean),
  // Cookie configuration for production
  cookiePrefix: 'joshan_admin',
  plugins: [
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
      tenantField: {
        access: {
          read: () => true,
          update: ({ req }) => {
            if (isSuperAdmin(req.user)) {
              return true
            }
            return getUserTenantIDs(req.user).length > 0
          },
        },
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
  ],
})
