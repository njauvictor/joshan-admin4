// collections/Teacher.ts
import { CollectionConfig } from 'payload'

export const Teacher: CollectionConfig = {
  slug: 'teachers',
  admin: {
    useAsTitle: 'employeeNumber',
    defaultColumns: ['fullName', 'tscNumber', 'status', 'phone'],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'middleName',
          type: 'text',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },

        //full name - automatic
        {
          name: 'fullName',
          type: 'text',
          required: true,
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeValidate: [
              ({ siblingData }) => {
                const fullName = `${siblingData.firstName} ${siblingData.middleName || ''} ${siblingData.lastName}`
                return fullName.trim()
              },
            ],
          },
        },
        {
          name: 'phone',
          type: 'text',
          required: true,
        },

        //email
        {
          name: 'email',
          type: 'email',
          unique: true,
        },

        {
          name: 'employeeNumber',
          type: 'text',
          unique: true,
        },
        {
          name: 'tscNumber',
          type: 'text',
          unique: true,
        },
        {
          name: 'gender',
          type: 'select',
          required: true,
          options: [
            { label: 'Male', value: 'MALE' },
            { label: 'Female', value: 'FEMALE' },
          ],
        },
        {
          name: 'dateOfBirth',
          type: 'date',
        },
        {
          name: 'idNumber',
          type: 'text',
          unique: true,
        },

        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'ACTIVE',
          options: [
            { label: 'Active', value: 'ACTIVE' },
            { label: 'On Leave', value: 'ON_LEAVE' },
            { label: 'Resigned', value: 'RESIGNED' },
            { label: 'Terminated', value: 'TERMINATED' },
            { label: 'Retired', value: 'RETIRED' },
            { label: 'Probation', value: 'PROBATION' },
          ],
        },
        {
          name: 'employmentType',
          type: 'select',
          defaultValue: 'PERMANENT',
          options: [
            { label: 'Permanent', value: 'PERMANENT' },
            { label: 'Contract', value: 'CONTRACT' },
            { label: 'Part Time', value: 'PART_TIME' },
            { label: 'Intern', value: 'INTERN' },
            { label: 'Probation', value: 'PROBATION' },
            { label: 'Casual', value: 'CASUAL' },
          ],
        },
        {
          name: 'qualifications',
          type: 'text',
        },
        {
          name: 'specialization',
          type: 'text',
        },
        // Subjects - Different for 8-4-4 and CBC
        {
          name: 'subjects844',
          type: 'array',
          label: '8-4-4 Subjects',
          fields: [
            {
              name: 'subject',
              type: 'relationship',
              relationTo: 'subjects-844',
            },
          ],
        },
        {
          name: 'subjectsCBC',
          type: 'array',
          label: 'CBC Subjects',
          fields: [
            {
              name: 'subject',
              type: 'relationship',
              relationTo: 'subjects-cbc',
            },
            {
              name: 'strand',
              type: 'text',
            },
            {
              name: 'isPrimary',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'employmentDate',
          type: 'date',
          required: true,
        },
        {
          name: 'department',
          type: 'text',
        },

        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    // Class/Stream Responsibilities

    //Bank Details
    {
      type: 'collapsible',
      label: 'Bank Details',
      fields: [
        {
          name: 'bankName',
          type: 'text',
        },
        {
          name: 'bankAccount',
          type: 'text',
        },
        {
          name: 'bankBranch',
          type: 'text',
        },
      ],
    },
    // Statutory Details
    {
      type: 'collapsible',
      label: 'Statutory Details',
      fields: [
        {
          name: 'nhifNumber',
          type: 'text',
        },
        {
          name: 'nssfNumber',
          type: 'text',
        },
        {
          name: 'kraPin',
          type: 'text',
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'remarks',
      type: 'textarea',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
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
