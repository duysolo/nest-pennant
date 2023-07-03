import { IUSerFromRequest } from '../definitions'

export const defaultGetUserFromRequest = (
  req: any
): IUSerFromRequest | undefined => {
  return req.user
}
