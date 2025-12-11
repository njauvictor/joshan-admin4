import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tenants } from './collections/Tenants'
import { plugins } from './plugins'
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
  plugins,
})
