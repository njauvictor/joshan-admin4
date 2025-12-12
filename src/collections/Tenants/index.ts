import type { CollectionConfig } from 'payload'

import { isSuperAdminAccess } from '../../access/isSuperAdmin'
import { updateAndDeleteAccess } from './access/updateAndDelete'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: isSuperAdminAccess,
    delete: updateAndDeleteAccess,
    read: ({ req }) => Boolean(req.user),
    update: updateAndDeleteAccess,
  },
  admin: {
    useAsTitle: 'name',
    group: 'System',
    defaultColumns: ['name', 'schoolType', 'gender', 'country', 'isActive'],
  },
  fields: [
    // ============================================================
    //                     BASIC INFORMATION
    // ============================================================
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Official school name',
                  },
                },
                {
                  name: 'slug',
                  type: 'text',
                  index: true,
                  admin: {
                    description: 'Auto-generated URL identifier from school name',
                    width: '50%',
                    readOnly: true,
                  },
                  hooks: {
                    beforeValidate: [
                      ({ value, siblingData, operation }) => {
                        // Auto-generate slug from name if not provided
                        if (
                          (!value || value === '') &&
                          siblingData.name &&
                          operation === 'create'
                        ) {
                          return siblingData.name
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
                            .replace(/\s+/g, '-') // Replace spaces with hyphens
                            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                            .trim()
                        }
                        return value
                      },
                    ],
                  },
                },

                {
                  name: 'domain',
                  type: 'text',
                  admin: {
                    description: 'Custom domain for school',
                    width: '50%',
                  },
                },

                {
                  name: 'motto',
                  type: 'text',
                  admin: {
                    description: 'School motto',
                  },
                },
              ],
            },

            {
              name: 'vision',
              type: 'textarea',
              admin: {
                description: 'School vision statement',
              },
            },
            {
              name: 'mission',
              type: 'textarea',
              admin: {
                description: 'School mission statement',
              },
            },
          ],
        },
        // ============================================================
        //                     SCHOOL CHARACTERISTICS
        // ============================================================
        {
          label: 'School Profile',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'schoolType',
                  type: 'select',
                  options: [
                    { label: 'Boarding', value: 'boarding' },
                    { label: 'Day', value: 'day' },
                    { label: 'Mixed (Boarding & Day)', value: 'mixed' },
                  ],
                  defaultValue: 'mixed',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'schoolLevel',
                  type: 'select',
                  options: [
                    { label: 'Junior Secondary', value: 'junior_secondary' },
                    { label: 'Senior Secondary', value: 'senior_secondary' },
                    { label: 'Mixed (JSS & SSS)', value: 'mixed' },
                  ],
                  defaultValue: 'mixed',
                  admin: {
                    width: '33%',
                  },
                },
                {
                  name: 'gender',
                  type: 'select',
                  options: [
                    { label: 'Girls', value: 'girls' },
                    { label: 'Boys', value: 'boys' },
                    { label: 'Mixed', value: 'mixed' },
                  ],
                  defaultValue: 'mixed',
                  admin: {
                    width: '34%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'establishedYear',
                  type: 'number',
                  admin: {
                    description: 'Year school was established',
                    width: '50%',
                  },
                },
                {
                  name: 'schoolCategory',
                  type: 'select',
                  options: [
                    { label: 'Public', value: 'public' },
                    { label: 'Private', value: 'private' },
                    { label: 'Mission', value: 'mission' },
                    { label: 'International', value: 'international' },
                  ],
                  defaultValue: 'public',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'academicSystems',
              type: 'select',
              hasMany: true,
              options: [
                { label: '8-4-4 System', value: 'EIGHT_FOUR_FOUR' },
                { label: 'CBC System', value: 'CBC' },
                { label: 'IGCSE', value: 'IGCSE' },
                { label: 'IB', value: 'IB' },
              ],
              defaultValue: ['EIGHT_FOUR_FOUR'],
              admin: {
                description: 'Academic systems offered',
              },
            },
          ],
        },
        // ============================================================
        //                     LOCATION & CONTACT
        // ============================================================
        {
          label: 'Location & Contact',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'country',
                  type: 'text',
                  required: true,
                  defaultValue: 'Kenya',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'county',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'subcounty',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'constituency',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'ward',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  admin: {
                    description: 'Postal/ZIP code',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'physicalAddress',
              type: 'textarea',
              admin: {
                description: 'Physical location address',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'poBox',
                  type: 'text',
                  label: 'P.O. Box',
                  admin: {
                    width: '50%',
                  },
                },
                {
                  name: 'town',
                  type: 'text',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'telephone',
                  type: 'text',
                  admin: {
                    description: 'Main telephone line',
                    width: '50%',
                  },
                },
                {
                  name: 'mobile',
                  type: 'text',
                  admin: {
                    description: 'Mobile contact',
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  admin: {
                    description: 'Primary email address',
                    width: '50%',
                  },
                },
                {
                  name: 'website',
                  type: 'text',
                  admin: {
                    description: 'School website',
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'additionalEmails',
              type: 'array',
              admin: {
                description: 'Additional email addresses',
              },
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  required: true,
                },
                {
                  name: 'purpose',
                  type: 'select',
                  options: [
                    { label: 'General Inquiry', value: 'general' },
                    { label: 'Admissions', value: 'admissions' },
                    { label: 'Accounts', value: 'accounts' },
                    { label: 'Principal', value: 'principal' },
                    { label: 'Academic', value: 'academic' },
                  ],
                  defaultValue: 'general',
                },
              ],
            },
          ],
        },
        // ============================================================
        //                     LEADERSHIP & GOVERNANCE
        // ============================================================
        {
          label: 'Leadership & Governance',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'principal',
                  type: 'text',
                  admin: {
                    description: 'School Principal',
                    width: '50%',
                  },
                },
                {
                  name: 'principalTitle',
                  type: 'select',
                  options: [
                    { label: 'Mr.', value: 'mr' },
                    { label: 'Mrs.', value: 'mrs' },
                    { label: 'Miss', value: 'miss' },
                    { label: 'Dr.', value: 'dr' },
                    { label: 'Prof.', value: 'prof' },
                  ],
                  defaultValue: 'mr',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'deputyPrincipal',
                  type: 'text',
                  admin: {
                    description: 'Deputy Principal',
                    width: '50%',
                  },
                },
                {
                  name: 'deputyTitle',
                  type: 'select',
                  options: [
                    { label: 'Mr.', value: 'mr' },
                    { label: 'Mrs.', value: 'mrs' },
                    { label: 'Miss', value: 'miss' },
                    { label: 'Dr.', value: 'dr' },
                  ],
                  defaultValue: 'mr',
                  admin: {
                    width: '50%',
                  },
                },
              ],
            },
            {
              name: 'bogChairperson',
              type: 'text',
              label: 'BOG Chairperson',
              admin: {
                description: 'Board of Governors Chairperson',
              },
            },
            {
              name: 'bogMembers',
              type: 'array',
              label: 'BOG Members',
              admin: {
                description: 'Board of Governors Members',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'select',
                  options: [
                    { label: 'Mr.', value: 'mr' },
                    { label: 'Mrs.', value: 'mrs' },
                    { label: 'Miss', value: 'miss' },
                    { label: 'Dr.', value: 'dr' },
                    { label: 'Prof.', value: 'prof' },
                    { label: 'Rev.', value: 'rev' },
                  ],
                  defaultValue: 'mr',
                },
                {
                  name: 'role',
                  type: 'select',
                  options: [
                    { label: 'Chairperson', value: 'chairperson' },
                    { label: 'Vice Chair', value: 'vice_chair' },
                    { label: 'Secretary', value: 'secretary' },
                    { label: 'Treasurer', value: 'treasurer' },
                    { label: 'Member', value: 'member' },
                    { label: 'Parent Rep', value: 'parent_rep' },
                    { label: 'Teacher Rep', value: 'teacher_rep' },
                    { label: 'Student Rep', value: 'student_rep' },
                  ],
                  defaultValue: 'member',
                },
                {
                  name: 'email',
                  type: 'email',
                },
                {
                  name: 'phone',
                  type: 'text',
                },
                {
                  name: 'appointmentDate',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
                {
                  name: 'termEnds',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayOnly',
                    },
                  },
                },
              ],
            },
            {
              name: 'sponsors',
              type: 'array',
              admin: {
                description: 'School sponsors/partners',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'type',
                  type: 'select',
                  options: [
                    { label: 'Religious', value: 'religious' },
                    { label: 'Corporate', value: 'corporate' },
                    { label: 'Government', value: 'government' },
                    { label: 'Community', value: 'community' },
                    { label: 'Individual', value: 'individual' },
                  ],
                  defaultValue: 'religious',
                },
                {
                  name: 'contactPerson',
                  type: 'text',
                },
                {
                  name: 'contactEmail',
                  type: 'email',
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                },
                {
                  name: 'sponsorshipLevel',
                  type: 'select',
                  options: [
                    { label: 'Major', value: 'major' },
                    { label: 'Minor', value: 'minor' },
                    { label: 'In-kind', value: 'in_kind' },
                  ],
                  defaultValue: 'minor',
                },
              ],
            },
          ],
        },
        // ============================================================
        //                     MEDIA & SETTINGS
        // ============================================================
        {
          label: 'Media & Settings',
          admin: {
            position: 'sidebar',
          },
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'School logo',
              },
            },
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'School banner/header image',
              },
            },
            {
              name: 'schoolPhotos',
              type: 'array',
              admin: {
                description: 'School facility photos',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
                {
                  name: 'category',
                  type: 'select',
                  options: [
                    { label: 'Classrooms', value: 'classrooms' },
                    { label: 'Laboratories', value: 'laboratories' },
                    { label: 'Library', value: 'library' },
                    { label: 'Sports', value: 'sports' },
                    { label: 'Administration', value: 'administration' },
                    { label: 'Dormitories', value: 'dormitories' },
                    { label: 'Dining', value: 'dining' },
                    { label: 'Grounds', value: 'grounds' },
                  ],
                  defaultValue: 'classrooms',
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'allowPublicRead',
                  type: 'checkbox',
                  admin: {
                    description: 'Allow public access to school profile',
                    width: '50%',
                    position: 'sidebar',
                  },
                  defaultValue: false,
                  index: true,
                },
                {
                  name: 'isActive',
                  type: 'checkbox',
                  admin: {
                    description: 'Active school status',
                    width: '50%',
                    position: 'sidebar',
                  },
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'settings',
              type: 'group',
              admin: {
                description: 'School-specific settings',
              },
              fields: [
                {
                  name: 'academicYearStart',
                  type: 'number',
                  defaultValue: 1,
                  admin: {
                    description: 'Month when academic year starts (1-12)',
                  },
                },
                {
                  name: 'academicYearEnd',
                  type: 'number',
                  defaultValue: 12,
                  admin: {
                    description: 'Month when academic year ends (1-12)',
                  },
                },
                {
                  name: 'defaultLanguage',
                  type: 'select',
                  options: [
                    { label: 'English', value: 'en' },
                    { label: 'Kiswahili', value: 'sw' },
                    { label: 'French', value: 'fr' },
                  ],
                  defaultValue: 'en',
                },
                {
                  name: 'timezone',
                  type: 'select',
                  options: [
                    { label: 'East Africa Time (UTC+3)', value: 'Africa/Nairobi' },
                    { label: 'Central Africa Time (UTC+2)', value: 'Africa/Harare' },
                    { label: 'West Africa Time (UTC+1)', value: 'Africa/Lagos' },
                    { label: 'GMT (UTC+0)', value: 'GMT' },
                  ],
                  defaultValue: 'Africa/Nairobi',
                },
                {
                  name: 'currency',
                  type: 'select',
                  options: [
                    { label: 'Kenyan Shilling (KES)', value: 'KES' },
                    { label: 'US Dollar (USD)', value: 'USD' },
                    { label: 'Euro (EUR)', value: 'EUR' },
                    { label: 'British Pound (GBP)', value: 'GBP' },
                  ],
                  defaultValue: 'KES',
                },
                {
                  name: 'dateFormat',
                  type: 'select',
                  options: [
                    { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
                    { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
                    { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
                  ],
                  defaultValue: 'DD/MM/YYYY',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
