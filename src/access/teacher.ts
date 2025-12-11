import type { Access } from 'payload'

import { User } from '../payload-types'

export const isTeacherAccess: Access = ({ req }): boolean => {
  return isTeacher(req.user)
}

export const isTeacher = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('teacher'))
}
