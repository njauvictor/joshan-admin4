import { Access } from 'payload'

import { User } from '../payload-types'

export const isParentAccess: Access = ({ req }): boolean => {
  return isParent(req.user)
}

export const isParent = (user: User | null): boolean => {
  return Boolean(user?.roles?.includes('parent'))
}
