import { Access } from 'payload'

import { User } from '../payload-types'

export const isSchoolAdminAccess: Access = ({ req }): boolean => {
  return isSchoolAdmin(req.user)
}

export const isSchoolAdmin = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('school-admin'))
}
