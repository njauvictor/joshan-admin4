import { CollectionConfig } from 'payload'

// Grading scales for different academic systems
const gradingScales = {
  // 8-4-4 System (Letter Grades)
  EIGHT_FOUR_FOUR: [
    { min: 80, max: 100, grade: 'A', points: 12 },
    { min: 75, max: 79, grade: 'A_MINUS', points: 11 },
    { min: 70, max: 74, grade: 'B_PLUS', points: 10 },
    { min: 65, max: 69, grade: 'B', points: 9 },
    { min: 60, max: 64, grade: 'B_MINUS', points: 8 },
    { min: 55, max: 59, grade: 'C_PLUS', points: 7 },
    { min: 50, max: 54, grade: 'C', points: 6 },
    { min: 45, max: 49, grade: 'C_MINUS', points: 5 },
    { min: 40, max: 44, grade: 'D_PLUS', points: 4 },
    { min: 35, max: 39, grade: 'D', points: 3 },
    { min: 30, max: 34, grade: 'D_MINUS', points: 2 },
    { min: 20, max: 29, grade: 'E', points: 1 },
    { min: 0, max: 19, grade: 'F', points: 0 },
  ],
  // CBC System (Competency Levels)
  CBC: [
    { min: 85, max: 100, grade: 'EXCEEDING_EXPECTATIONS', points: 5 },
    { min: 70, max: 84, grade: 'MEETING_EXPECTATIONS', points: 4 },
    { min: 50, max: 69, grade: 'APPROACHING_EXPECTATIONS', points: 3 },
    { min: 30, max: 49, grade: 'BELOW_EXPECTATIONS', points: 2 },
    { min: 0, max: 29, grade: 'WELL_BELOW_EXPECTATIONS', points: 1 },
  ],
}

export const ExamResults: CollectionConfig = {
  slug: 'examResults',
  admin: {
    useAsTitle: 'student',
    defaultColumns: [
      'exam',
      'student',
      'subject',
      'class',
      'totalMarks',
      'maxScore',
      'percentage',
      'grade',
      'gradePoints',
      'status',
    ],
    group: 'Academics',
  },
  labels: {
    singular: 'Exam Result',
    plural: 'Exam Results',
  },

  fields: [
    // Relationships
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
      label: 'Exam',
    },
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students',
      required: true,
      label: 'Student',
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: ['subjects-844', 'subjects-cbc'],
      label: 'Subject',
      admin: {
        description: 'Derived from exam, but can be overridden',
      },
    },
    {
      name: 'class',
      type: 'relationship',
      relationTo: 'classes',
      label: 'Class',
      admin: {
        description: 'Derived from exam',
      },
    },

    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'teachers',
      label: 'Entered By (Teacher)',
    },

    // Scores
    {
      type: 'row',
      fields: [
        {
          name: 'totalMarks',
          type: 'number',
          required: true,
          label: 'Total Marks Obtained',
          min: 0,
          admin: {
            width: '50%',
            step: 0.5,
          },
        },
        {
          name: 'maxScore',
          type: 'number',
          required: true,
          label: 'Maximum Score (Out of)',
          min: 1,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'percentage',
      type: 'number',
      label: 'Percentage',
      admin: {
        readOnly: true,
        description: 'Automatically calculated as (totalMarks / maxScore) * 100',
      },
    },
    {
      name: 'grade',
      type: 'select',
      label: 'Grade',
      admin: {
        readOnly: true,
        description: 'Automatically assigned based on grading system',
      },
      options: [
        // 8-4-4 grades
        { label: 'A', value: 'A' },
        { label: 'A-', value: 'A_MINUS' },
        { label: 'B+', value: 'B_PLUS' },
        { label: 'B', value: 'B' },
        { label: 'B-', value: 'B_MINUS' },
        { label: 'C+', value: 'C_PLUS' },
        { label: 'C', value: 'C' },
        { label: 'C-', value: 'C_MINUS' },
        { label: 'D+', value: 'D_PLUS' },
        { label: 'D', value: 'D' },
        { label: 'D-', value: 'D_MINUS' },
        { label: 'E', value: 'E' },
        { label: 'F', value: 'F' },
        // CBC grades
        { label: 'Exceeding Expectations', value: 'EXCEEDING_EXPECTATIONS' },
        { label: 'Meeting Expectations', value: 'MEETING_EXPECTATIONS' },
        { label: 'Approaching Expectations', value: 'APPROACHING_EXPECTATIONS' },
        { label: 'Below Expectations', value: 'BELOW_EXPECTATIONS' },
        { label: 'Well Below Expectations', value: 'WELL_BELOW_EXPECTATIONS' },
      ],
    },
    {
      name: 'gradePoints',
      type: 'number',
      label: 'Grade Points',
      admin: {
        readOnly: true,
        description: 'Points corresponding to grade',
      },
    },

    // Paper-wise scores (if exam has multiple papers)
    {
      name: 'paperScores',
      type: 'array',
      label: 'Paper Scores',
      admin: {
        condition: (_, siblingData) => siblingData.exam?.paperType === 'MULTIPLE',
      },
      fields: [
        {
          name: 'paper',
          type: 'text',
          label: 'Paper Name',
        },
        {
          name: 'paperCode',
          type: 'text',
          label: 'Paper Code',
        },
        {
          name: 'marksObtained',
          type: 'number',
          label: 'Marks Obtained',
          min: 0,
        },
        {
          name: 'maxMarks',
          type: 'number',
          label: 'Maximum Marks',
          min: 1,
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight',
          defaultValue: 1,
        },
      ],
    },

    // Additional fields
    {
      name: 'remarks',
      type: 'textarea',
      label: 'Remarks',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'DRAFT',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Published', value: 'PUBLISHED' },
        { label: 'Archived', value: 'ARCHIVED' },
      ],
      label: 'Status',
    },
    {
      name: 'isAbsent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Student Absent?',
    },
    {
      name: 'isRemarked',
      type: 'checkbox',
      defaultValue: false,
      label: 'Remarked?',
    },
    {
      name: 'remarkDate',
      type: 'date',
      label: 'Remark Date',
      admin: {
        condition: (_, siblingData) => siblingData.isRemarked === true,
      },
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Attachments',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
  ],

  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (!data) return data

        // Calculate percentage
        if (data.totalMarks !== undefined && data.maxScore !== undefined && data.maxScore > 0) {
          data.percentage = (data.totalMarks / data.maxScore) * 100
        }

        // Determine academic system based on subject
        let academicSystem: 'EIGHT_FOUR_FOUR' | 'CBC' = 'EIGHT_FOUR_FOUR'
        if (data.subject) {
          // subject is a relationship, could be an ID or an object
          // For simplicity, we assume subject is an object with relationTo property
          // In real scenario, we'd need to fetch the subject to know its collection
          // This is a placeholder logic; you may need to adjust based on your data structure
          if (typeof data.subject === 'object' && data.subject.relationTo === 'subjects-cbc') {
            academicSystem = 'CBC'
          } else if (
            typeof data.subject === 'object' &&
            data.subject.relationTo === 'subjects-844'
          ) {
            academicSystem = 'EIGHT_FOUR_FOUR'
          } else if (typeof data.subject === 'string') {
            // Could be ID; we'd need to fetch, but skip for now
            // We'll rely on exam to get subject's system
          }
        }

        // If we have exam relationship, we can get subject from exam
        if (data.exam && req?.payload) {
          try {
            const exam = await req.payload.findByID({
              collection: 'exams',
              id: typeof data.exam === 'object' ? data.exam.id : data.exam,
              depth: 1,
            })
            if (exam.subject) {
              const subject = exam.subject
              if (typeof subject === 'object' && subject.relationTo === 'subjects-cbc') {
                academicSystem = 'CBC'
              } else {
                academicSystem = 'EIGHT_FOUR_FOUR'
              }
            }
          } catch (error) {
            // ignore
          }
        }

        // Assign grade and grade points based on percentage and grading scale
        if (data.percentage !== undefined) {
          const scale = gradingScales[academicSystem]
          const matched = scale.find(
            (item) => data.percentage >= item.min && data.percentage <= item.max,
          )
          if (matched) {
            data.grade = matched.grade
            data.gradePoints = matched.points
          }
        }

        return data
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        // Ensure percentage is calculated if not already
        if (data.totalMarks !== undefined && data.maxScore !== undefined && data.maxScore > 0) {
          data.percentage = (data.totalMarks / data.maxScore) * 100
        }
        return data
      },
    ],
  },

  // -------------------------
  // ACCESS CONTROL
  // -------------------------
  access: {
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

    create: ({ req }) => {
      if (!req.user) return false
      const user = req.user
      if (user.roles?.includes('super-admin')) return true

      const userTenants = user.tenants || []
      const userRoles = user.roles || []

      return userTenants.some(
        (t) =>
          (t.roles || []).includes('tenant-admin') ||
          userRoles.includes('school-admin') ||
          userRoles.includes('teacher'),
      )
    },

    update: ({ req }) => {
      if (!req.user) return false
      const user = req.user
      if (user.roles?.includes('super-admin')) return true

      const userTenants = user.tenants || []
      const userRoles = user.roles || []

      return userTenants.some(
        (t) =>
          (t.roles || []).includes('tenant-admin') ||
          userRoles.includes('school-admin') ||
          userRoles.includes('teacher'),
      )
    },

    delete: ({ req }) => {
      if (!req.user) return false
      const user = req.user
      if (user.roles?.includes('super-admin')) return true

      // Only school-admin and teacher (for their own entries) can delete
      return (user.roles || []).includes('school-admin') || (user.roles || []).includes('teacher')
    },
  },
}
