import { Access } from 'payload'
import { User } from '../payload-types'

export const isStudentAccess: Access = ({ req }): boolean => {
  return isStudent(req.user)
}

export const isStudent = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('student'))
}
