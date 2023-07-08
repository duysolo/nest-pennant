export const PENNANT_DEFINITIONS_MODULE_OPTIONS: symbol = Symbol(
  'PENNANT_DEFINITIONS_MODULE_OPTIONS'
)

export interface IUSerFromRequest {
  [x: string]: unknown

  id: string
}

export interface IPennantDefinitions {
  globalEnabledFeatures: string[]
  getUserFromRequestHandler?: (
    req: unknown
  ) => IUSerFromRequest | undefined | Promise<IUSerFromRequest | undefined>
}
