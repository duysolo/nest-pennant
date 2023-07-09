export const PENNANT_DEFINITIONS_MODULE_OPTIONS: symbol = Symbol(
  'PENNANT_DEFINITIONS_MODULE_OPTIONS'
)

export interface IPennantDefinitions {
  enabledFeatures: string[]
  getUserFromRequestHandler?: (req: unknown) => Promise<string | undefined>
}
