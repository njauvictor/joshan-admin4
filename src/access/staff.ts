import { Access } from 'payload'
import { User } from '../payload-types'

export const isStaffAccess: Access = ({ req }): boolean => {
  return isStaff(req.user)
}

export const isStaff = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('staff'))
}
