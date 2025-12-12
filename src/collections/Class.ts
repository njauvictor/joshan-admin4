// collections/Class.ts
import { CollectionConfig } from 'payload'
import { v4 as uuidv4 } from 'uuid'

export const Class: CollectionConfig = {
  slug: 'classes',

  admin: {
    useAsTitle: 'className',
    defaultColumns: [
      'className',
      'classCode',
      'academicYear',
      'academicLevel',
      'classTeacher',
      'promotionStatus',
      'studentCount',
      'isActive',
    ],
    group: 'Academic',
  },

  fields: [
    // ============================================================
    //                     CORE IDENTIFIERS
    // ============================================================
    {
      name: 'classCode',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Permanent unique identifier',
      },
      defaultValue: () => `CLS-${uuidv4().substring(0, 8).toUpperCase()}`,
    },

    // ============================================================
    //                     ACADEMIC INFORMATION
    // ============================================================
    {
      type: 'row',
      fields: [
        {
          name: 'academicYear',
          type: 'number',
          required: true,
          admin: {
            description: 'Academic year starting',
            width: '50%',
          },
          hooks: {
            beforeValidate: [
              ({ value, operation }) => {
                if (operation === 'create' && !value) {
                  const currentYear = new Date().getFullYear()
                  const currentMonth = new Date().getMonth() + 1
                  // If creating after August, set to next year
                  return currentMonth >= 8 ? currentYear + 1 : currentYear
                }
                return value
              },
            ],
          },
        },
        {
          name: 'academicLevel',
          type: 'relationship',
          relationTo: 'academic-levels',
          required: true,
          admin: {
            description: 'Current grade/level',
            width: '50%',
          },
        },
      ],
    },

    {
      name: 'nextAcademicLevel',
      type: 'relationship',
      relationTo: 'academic-levels',
      admin: {
        description: 'Where this class promotes to (auto-filled)',
        condition: (data) => data.promotionEligible && !data.isFinalYear,
      },
      hooks: {
        beforeValidate: [
          async ({ value, siblingData, req }) => {
            // Auto-determine next level if not specified
            if (!value && siblingData.academicLevel && req?.payload) {
              return await getNextLevel(siblingData.academicLevel, req)
            }
            return value
          },
        ],
      },
    },

    {
      name: 'stream',
      type: 'relationship',
      relationTo: 'classStreams',
      admin: {
        description: 'Section/Stream (East, West, etc.)',
      },
    },

    // ============================================================
    //                     PROMOTION CONFIGURATION
    // ============================================================
    {
      type: 'row',
      fields: [
        {
          name: 'promotionEligible',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Can be promoted next year',
            width: '33%',
            position: 'sidebar',
          },
        },
        {
          name: 'isFinalYear',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Final year (no promotion)',
            width: '33%',
            position: 'sidebar',
            condition: (data) => data.promotionEligible,
          },
        },
        {
          name: 'autoArchive',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Auto-archive after promotion',
            width: '34%',
            position: 'sidebar',
          },
        },
      ],
    },

    {
      name: 'promotionStatus',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Ready for Promotion', value: 'ready' },
        { label: 'Promoted', value: 'promoted' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'active',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },

    {
      name: 'lastPromotedYear',
      type: 'number',
      admin: {
        hidden: true,
      },
    },

    // ============================================================
    //                     CLASS NAME (AUTO-GENERATED)
    // ============================================================
    {
      name: 'className',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: 'Auto-generated: Form1East/2025',
      },
      hooks: {
        beforeValidate: [
          async ({ value, siblingData, req }) => {
            // Always auto-generate to ensure consistency
            try {
              const academicLevelId = siblingData.academicLevel
              const streamId = siblingData.stream
              const academicYear = siblingData.academicYear

              let levelName = 'Unknown'
              let streamCode = ''

              // Get academic level name
              if (academicLevelId && req?.payload) {
                const level = await req.payload.findByID({
                  collection: 'academic-levels',
                  id: typeof academicLevelId === 'object' ? academicLevelId.id : academicLevelId,
                })
                levelName = level?.displayName || 'Unknown'
              }

              // Get stream code
              if (streamId && req?.payload) {
                const stream = await req.payload.findByID({
                  collection: 'classStreams',
                  id: typeof streamId === 'object' ? streamId.id : streamId,
                })
                streamCode = stream?.streamCode || stream?.streamName?.replace(/\s+/g, '') || ''
              }

              // Format: Form1East/2025
              return streamCode
                ? `${levelName}${streamCode}/${academicYear}`
                : `${levelName}/${academicYear}`
            } catch (error) {
              console.error('Error generating className:', error)
              return value || `Class-${siblingData.academicYear || new Date().getFullYear()}`
            }
          },
        ],
      },
    },

    // ============================================================
    //                     CLASS DETAILS
    // ============================================================
    {
      type: 'row',
      fields: [
        {
          name: 'capacity',
          type: 'number',
          defaultValue: 40,
          min: 1,
          max: 60,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'studentCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            width: '50%',
          },
        },
      ],
    },

    {
      name: 'academicSystem',
      type: 'select',
      required: true,
      defaultValue: 'EIGHT_FOUR_FOUR',
      options: [
        { label: '8-4-4 System', value: 'EIGHT_FOUR_FOUR' },
        { label: 'CBC System', value: 'CBC' },
        { label: 'IGCSE', value: 'IGCSE' },
      ],
    },

    {
      name: 'classTeacher',
      type: 'relationship',
      relationTo: 'teachers',
      admin: {
        description: 'Form teacher/Class teacher',
      },
    },

    // ============================================================
    //                     PROMOTION LINEAGE
    // ============================================================
    {
      name: 'lineage',
      type: 'group',
      admin: {
        hidden: true,
      },
      fields: [
        {
          name: 'originalClass',
          type: 'relationship',
          relationTo: 'classes',
          admin: {
            description: 'Very first class in this lineage',
          },
        },
        {
          name: 'previousClass',
          type: 'relationship',
          relationTo: 'classes',
        },
        {
          name: 'nextClass',
          type: 'relationship',
          relationTo: 'classes',
        },
        {
          name: 'generation',
          type: 'number',
          defaultValue: 1,
          admin: {
            description: 'How many promotions from original',
          },
        },
      ],
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'remarks',
      type: 'textarea',
      admin: {
        description: 'Notes about this class',
      },
    },
  ],

  // ============================================================
  //                     HOOKS
  // ============================================================
  hooks: {
    afterChange: [
      async ({ doc, operation, req, previousDoc }) => {
        if (!req?.payload) return

        // Update student count
        const students = await req.payload.find({
          collection: 'students',
          where: {
            class: { equals: doc.id },
            status: { equals: 'active' },
          },
          limit: 0,
        })

        if (students.totalDocs !== doc.studentCount) {
          await req.payload.update({
            collection: 'classes',
            id: doc.id,
            data: { studentCount: students.totalDocs },
          })
        }

        // Mark as ready for promotion if academic year has passed
        if (operation === 'update' || operation === 'create') {
          const currentYear = new Date().getFullYear()
          if (doc.academicYear < currentYear && doc.promotionEligible && !doc.isFinalYear) {
            await req.payload.update({
              collection: 'classes',
              id: doc.id,
              data: { promotionStatus: 'ready' } as any,
            })
          }
        }
      },
    ],

    beforeDelete: [
      async ({ req, id }) => {
        // Prevent deletion if has students
        const students = await req.payload.find({
          collection: 'students',
          where: { class: { equals: id } },
          limit: 1,
        })

        if (students.totalDocs > 0) {
          throw new Error(
            `Cannot delete class with ${students.totalDocs} students. Transfer students first.`,
          )
        }
      },
    ],
  },

  // ============================================================
  //                     ENDPOINTS
  // ============================================================
  endpoints: [
    {
      path: '/annual-promotion',
      method: 'post',
      handler: async (req: any) => {
        try {
          let body = {}
          try {
            if (typeof req.json === 'function') {
              body = await req.json()
            }
          } catch (error) {
            // swallow error, body is already empty object
          }

          const { year = new Date().getFullYear() + 1, tenant } = body as any

          // Only run on January 1st or manually
          const today = new Date()
          const isJan1st = today.getMonth() === 0 && today.getDate() === 1

          if (!isJan1st && !req.user?.roles?.includes('super-admin')) {
            return new Response(
              JSON.stringify({
                error: 'Annual promotion only runs on January 1st',
                today: today.toISOString().split('T')[0],
              }),
              { status: 403, headers: { 'Content-Type': 'application/json' } },
            )
          }

          const result = await runAnnualPromotion(year, tenant, req)
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },

    {
      path: '/promote-class/:id',
      method: 'post',
      handler: async (req: any) => {
        try {
          const { id } = req.params
          const result = await promoteClass(id, req)
          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },

    {
      path: '/promotion-preview',
      method: 'get',
      handler: async (req: any) => {
        try {
          const nextYear = new Date().getFullYear() + 1
          const preview = await getPromotionPreview(nextYear, req)
          return new Response(JSON.stringify(preview), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  ],

  // ============================================================
  //                     ACCESS CONTROL
  // ============================================================
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.roles?.includes('super-admin')) return true

      const tenantIds =
        req.user.tenants?.map((t) => {
          const tenant = t.tenant
          return typeof tenant === 'object' ? tenant.id : tenant
        }) || []

      return { tenant: { in: tenantIds } }
    },

    create: ({ req }) => {
      if (!req.user) return false
      if (req.user.roles?.includes('super-admin')) return true

      const userRoles = req.user.roles || []
      const userTenants = req.user.tenants || []

      return userTenants.some(
        (t) => (t.roles || []).includes('tenant-admin') || userRoles.includes('school-admin'),
      )
    },

    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.roles?.includes('super-admin')) return true

      const userRoles = req.user.roles || []
      const userTenants = req.user.tenants || []

      return userTenants.some(
        (t) =>
          (t.roles || []).includes('tenant-admin') ||
          userRoles.includes('school-admin') ||
          userRoles.includes('teacher'),
      )
    },

    delete: ({ req }) => {
      if (!req.user) return false
      if (req.user.roles?.includes('super-admin')) return true
      if (req.user.roles?.includes('school-admin')) return true
      return false
    },
  },
}

// ============================================================
//                     HELPER FUNCTIONS
// ============================================================

/**
 * Get next academic level automatically
 */
async function getNextLevel(currentLevelId: string | null, req: any): Promise<string | null> {
  try {
    if (!currentLevelId) return null

    const id =
      typeof currentLevelId === 'object' && currentLevelId !== null
        ? (currentLevelId as any).id
        : currentLevelId
    const currentLevel = await req.payload.findByID({
      collection: 'academic-levels',
      id: id as string,
    })

    if (!currentLevel?.nextLevel) return null

    return currentLevel.nextLevel
  } catch (error) {
    console.error('Error getting next level:', error)
    return null
  }
}

/**
 * Check if level is final year
 */
async function isFinalYear(levelId: string | null, req: any): Promise<boolean> {
  try {
    if (!levelId) return false

    const id = typeof levelId === 'object' && levelId !== null ? (levelId as any).id : levelId
    const level = await req.payload.findByID({
      collection: 'academic-levels',
      id: id as string,
    })

    return level?.isFinalYear || false
  } catch {
    return false
  }
}

/**
 * Run annual promotion
 */
async function runAnnualPromotion(targetYear: number, tenantId: string, req: any) {
  console.log(`🔄 Starting annual promotion for ${targetYear}...`)

  const startTime = Date.now()

  // 1. Find all classes ready for promotion
  const classesToPromote = await req.payload.find({
    collection: 'classes',
    where: {
      and: [
        { academicYear: { less_than: targetYear } },
        { promotionStatus: { equals: 'ready' } },
        { promotionEligible: { equals: true } },
        { isFinalYear: { equals: false } },
        { isActive: { equals: true } },
        tenantId ? { tenant: { equals: tenantId } } : {},
      ],
    },
    limit: 1000,
  })

  console.log(`📚 Found ${classesToPromote.totalDocs} classes to promote`)

  const results: {
    year: number
    total: number
    promoted: number
    skipped: number
    errors: Array<{ id: string; className: string; error: string }>
    details: Array<{
      id: string
      className: string
      status: string
      newClassId?: string
      newClassName?: string
    }>
  } = {
    year: targetYear,
    total: classesToPromote.totalDocs,
    promoted: 0,
    skipped: 0,
    errors: [],
    details: [],
  }

  // 2. Process each class
  for (const classDoc of classesToPromote.docs) {
    try {
      // Check if already promoted for this year
      const existing = await req.payload.find({
        collection: 'classes',
        where: {
          and: [
            { 'lineage.previousClass': { equals: classDoc.id } },
            { academicYear: { equals: targetYear } },
          ],
        },
      })

      if (existing.totalDocs > 0) {
        await req.payload.update({
          collection: 'classes',
          id: classDoc.id,
          data: {
            promotionStatus: 'promoted',
            lastPromotedYear: targetYear,
            isActive: classDoc.autoArchive ? false : true,
          } as any,
        })
        results.skipped++
        results.details.push({
          id: classDoc.id,
          className: classDoc.className,
          status: 'Already promoted',
          newClassId: existing.docs[0].id,
        })
        continue
      }

      // 3. Create promoted class
      const promotedClass = await createPromotedClass(classDoc, targetYear, req)

      // 4. Update original class
      await req.payload.update({
        collection: 'classes',
        id: classDoc.id,
        data: {
          promotionStatus: 'promoted',
          lastPromotedYear: targetYear,
          isActive: classDoc.autoArchive ? false : true,
          'lineage.nextClass': promotedClass.id,
        } as any,
      })

      results.promoted++
      results.details.push({
        id: classDoc.id,
        className: classDoc.className,
        status: 'Promoted',
        newClassId: promotedClass.id,
        newClassName: promotedClass.className,
      })
    } catch (error: any) {
      results.errors.push({
        id: classDoc.id,
        className: classDoc.className,
        error: error.message,
      })

      // Mark as error
      await req.payload.update({
        collection: 'classes',
        id: classDoc.id,
        data: {
          promotionStatus: 'active', // Reset to active to retry
          remarks: `Promotion failed: ${error.message}`,
        } as any,
      })
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`✅ Annual promotion completed in ${duration}s`)

  return {
    ...results,
    duration: `${duration} seconds`,
    summary: `Promoted ${results.promoted} classes to ${targetYear}`,
  }
}

/**
 * Create promoted class version
 */
async function createPromotedClass(originalClass: any, targetYear: number, req: any) {
  // Determine original class in lineage
  const originalClassId = originalClass.lineage?.originalClass || originalClass.id
  const generation = (originalClass.lineage?.generation || 1) + 1

  // Get next academic level
  let nextLevel = originalClass.nextAcademicLevel
  if (!nextLevel) {
    nextLevel = await getNextLevel(originalClass.academicLevel, req)
  }

  if (!nextLevel) {
    throw new Error('No next academic level defined')
  }

  // Create promoted class data
  const promotedData = {
    tenant: originalClass.tenant,
    academicYear: targetYear,
    academicLevel: nextLevel,
    stream: originalClass.stream,
    className: '', // Will be auto-generated
    capacity: originalClass.capacity,
    academicSystem: originalClass.academicSystem,
    classTeacher: originalClass.classTeacher, // Could be changed later
    promotionEligible: originalClass.promotionEligible,
    isFinalYear: await isFinalYear(nextLevel, req),
    autoArchive: originalClass.autoArchive,
    promotionStatus: 'active',
    studentCount: 0, // New class starts empty
    lineage: {
      originalClass: originalClassId,
      previousClass: originalClass.id,
      generation: generation,
    },
    isActive: true,
    remarks: `Promoted from ${originalClass.className}`,
  }

  // Create the class (className auto-generates in hook)
  const newClass = await req.payload.create({
    collection: 'classes',
    data: promotedData,
  })

  return newClass
}

/**
 * Get promotion preview
 */
async function getPromotionPreview(targetYear: number, req: any) {
  const classes = await req.payload.find({
    collection: 'classes',
    where: {
      and: [
        { academicYear: { less_than: targetYear } },
        { promotionStatus: { equals: 'ready' } },
        { promotionEligible: { equals: true } },
        { isActive: { equals: true } },
      ],
    },
    limit: 100,
  })

  return {
    targetYear,
    eligibleCount: classes.totalDocs,
    classes: classes.docs.map((c: any) => ({
      id: c.id,
      currentName: c.className,
      currentYear: c.academicYear,
      currentLevel: c.academicLevel,
      nextLevel: c.nextAcademicLevel,
      studentCount: c.studentCount,
    })),
  }
}

/**
 * Promote single class manually
 */
async function promoteClass(classId: string, req: any) {
  const classDoc = await req.payload.findByID({
    collection: 'classes',
    id: classId,
  })

  if (!classDoc) throw new Error('Class not found')
  if (classDoc.promotionStatus === 'promoted') {
    throw new Error('Class already promoted')
  }

  const targetYear = new Date().getFullYear() + 1
  const promotedClass = await createPromotedClass(classDoc, targetYear, req)

  await req.payload.update({
    collection: 'classes',
    id: classId,
    data: {
      promotionStatus: 'promoted',
      lastPromotedYear: targetYear,
      isActive: classDoc.autoArchive ? false : true,
      'lineage.nextClass': promotedClass.id,
    } as any,
  })

  return {
    success: true,
    message: `${classDoc.className} → ${promotedClass.className}`,
    originalClass: classDoc.id,
    promotedClass: promotedClass.id,
    classCode: promotedClass.classCode,
  }
}
