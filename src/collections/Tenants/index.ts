import type { CollectionConfig } from 'payload'

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  admin: {
    useAsTitle: 'schoolName',
  },

  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'schoolName',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          index: true,
        },

        {
          name: 'schoolCode',
          type: 'text',
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'schoolType',
          type: 'select',
          options: [
            { label: 'Primary School', value: 'primary' },
            { label: 'Secondary School', value: 'secondary' },
            { label: 'Mixed (Primary & Secondary)', value: 'mixed' },
          ],
        },
        {
          name: 'schoolEmail',
          type: 'email',
        },
        {
          name: 'schoolPhone',
          type: 'text',
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'schoolAddress',
          type: 'text',
          admin: {
            placeholder: 'P.O. Box 12345-00100 Nairobi',
            width: '50%',
          },
        },
        {
          name: 'county',
          type: 'text',
          admin: {
            placeholder: 'Nairobi',
          },
        },
        {
          name: 'subCounty',
          type: 'text',
          admin: {
            placeholder: 'Westlands',
          },
        },
        {
          name: 'constituency',
          type: 'text',
        },
      ],
    },

    {
      type: 'row',
      fields: [
        {
          name: 'principalName',
          type: 'text',
        },
        {
          name: 'principalPhone',
          type: 'text',
        },

        {
          name: 'principalEmail',
          type: 'email',
        },
      ],
    },
    //deputy principal

    {
      type: 'row',
      fields: [
        {
          name: 'deputyPrincipalName',
          type: 'text',
        },
        { name: 'deputyPrincipalPhone', type: 'text' },

        {
          name: 'deputyPrincipalEmail',
          type: 'email',
        },
      ],
    },

    //sidebar
    {
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'allowPublicRead',
          type: 'checkbox',
          defaultValue: false,
        },

        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
