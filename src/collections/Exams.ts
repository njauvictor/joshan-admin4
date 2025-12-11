import { CollectionConfig } from 'payload'

export const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'examName',
    defaultColumns: [
      'examName',
      'examCode',
      'academicYear',
      'term',
      'subject',
      'class',
      'maxScore',
      'status',
    ],
    group: 'Academics',
  },
  labels: {
    singular: 'Exam',
    plural: 'Exams',
  },

  fields: [
    // Exam Metadata
    {
      name: 'examName',
      type: 'text',
      required: true,
      label: 'Exam Name',
      admin: {
        description: 'e.g., Mathematics End Term 1, English Midterm',
      },
    },
    {
      name: 'examCode',
      type: 'text',
      label: 'Exam Code',
      unique: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'academicYear',
          type: 'number',
          required: true,
          label: 'Academic Year',
          admin: {
            width: '33%',
            description: 'e.g., 2024',
          },
        },
        {
          name: 'term',
          type: 'select',
          required: true,
          label: 'Term',
          options: [
            { label: 'Term 1', value: 'TERM_1' },
            { label: 'Term 2', value: 'TERM_2' },
            { label: 'Term 3', value: 'TERM_3' },
          ],
          admin: {
            width: '33%',
          },
        },
        {
          name: 'examType',
          type: 'select',
          required: true,
          label: 'Exam Type',
          options: [
            { label: 'Beginning of Term', value: 'BEGINNING_OF_TERM' },
            { label: 'Midterm', value: 'MIDTERM' },
            { label: 'Midterm 2', value: 'MIDTERM_2' },
            { label: 'Midterm 3', value: 'MIDTERM_3' },
            { label: 'End Term', value: 'END_TERM' },
            { label: 'Continuous Assessment', value: 'CONTINUOUS_ASSESSMENT' },
            { label: 'Practical', value: 'PRACTICAL' },
            { label: 'Project', value: 'PROJECT' },
            { label: 'Other', value: 'OTHER' },
          ],
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'examDate',
      type: 'date',
      required: true,
      label: 'Exam Date',
    },
    {
      name: 'dueDate',
      type: 'date',
      label: 'Due Date (if different)',
    },

    // Relationships
    {
      name: 'subject',
      type: 'relationship',
      relationTo: ['subjects-844', 'subjects-cbc'],
      required: true,
      label: 'Subject',
      admin: {
        description: 'Select subject from 8-4-4 or CBC',
      },
    },
    {
      name: 'class',
      type: 'relationship',
      relationTo: 'classes',
      required: true,
      label: 'Class',
    },
    {
      name: 'academicLevel',
      type: 'relationship',
      relationTo: 'academic-levels',
      label: 'Academic Level',
      admin: {
        description: 'Automatically derived from class, but can be overridden',
      },
    },
    {
      name: 'teacher',
      type: 'relationship',
      relationTo: 'teachers',
      label: 'Entered By (Teacher)',
    },

    // Exam Configuration
    {
      name: 'maxScore',
      type: 'number',
      required: true,
      label: 'Maximum Score (Out of)',
      min: 1,
      defaultValue: 100,
    },
    {
      name: 'paperType',
      type: 'select',
      required: true,
      label: 'Paper Type',
      defaultValue: 'SINGLE',
      options: [
        { label: 'Single Paper', value: 'SINGLE' },
        { label: 'Multiple Papers', value: 'MULTIPLE' },
      ],
      admin: {
        description: 'Single paper exam or multiple papers (e.g., Paper 1, Paper 2, Paper 3)',
      },
    },
    {
      name: 'papers',
      type: 'array',
      label: 'Papers',
      admin: {
        condition: (_, siblingData) => siblingData.paperType === 'MULTIPLE',
      },
      fields: [
        {
          name: 'paperName',
          type: 'text',
          required: true,
          label: 'Paper Name',
        },
        {
          name: 'paperCode',
          type: 'text',
          required: true,
          label: 'Paper Code',
        },
        {
          name: 'maxMarks',
          type: 'number',
          required: true,
          label: 'Maximum Marks',
          min: 1,
        },
        {
          name: 'weight',
          type: 'number',
          label: 'Weight',
          defaultValue: 1,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
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
  ],

  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data) return data
        // Calculate grade points based on grade (if grade present)
        const gradePointsMap: Record<string, number> = {
          A: 12,
          A_MINUS: 11,
          B_PLUS: 10,
          B: 9,
          B_MINUS: 8,
          C_PLUS: 7,
          C: 6,
          C_MINUS: 5,
          D_PLUS: 4,
          D: 3,
          D_MINUS: 2,
          E: 1,
          F: 0,
        }
        if (data.grade && gradePointsMap[data.grade] !== undefined) {
          data.gradePoints = gradePointsMap[data.grade]
        }

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
