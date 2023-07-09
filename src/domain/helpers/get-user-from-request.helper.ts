interface IUSerFromRequest {
  [x: string]: unknown

  id: string
}

export const defaultGetUserFromRequest = (req: any): string | undefined => {
  const user: IUSerFromRequest = req.user

  return user?.id
}
