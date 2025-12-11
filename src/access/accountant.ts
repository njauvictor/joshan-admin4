import { Access } from 'payload'
import { User } from '../payload-types'

export const isAccountantAccess: Access = ({ req }): boolean => {
  return isAccountant(req.user)
}

export const isAccountant = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('accountant'))
}
