import { ExecutionContext, Inject, Injectable } from '@nestjs/common'
import {
  IPennantDefinitions,
  PENNANT_DEFINITIONS_MODULE_OPTIONS,
} from '../definitions'
import { FeatureFlagRepository } from '../repositories'

export interface IUSer {
  id: string
}

@Injectable()
export class FeaturesFlagService {
  protected isFetched: boolean = false

  protected enabledFeatures: string[] = []

  public constructor(
    @Inject(PENNANT_DEFINITIONS_MODULE_OPTIONS)
    private readonly _options: IPennantDefinitions,
    private readonly _repository: FeatureFlagRepository
  ) {
    this.enabledFeatures = uniq(this._options.globalEnabledFeatures)
  }

  public async isEnabled(
    shouldHaveFeatures: string[],
    context: ExecutionContext
  ): Promise<boolean> {
    if (!this.isFetched) {
      this.enabledFeatures = uniq([
        ...(await this._repository.getFeatures(context)),
        ...this.enabledFeatures,
      ])

      this.isFetched = true
    }

    return checkFeatures(this.enabledFeatures, shouldHaveFeatures)
  }
}

function checkFeatures(
  enabledFeatures: string[],
  shouldHaveFeatures: string[]
) {
  return (
    !enabledFeatures.length ||
    shouldHaveFeatures.every((item) => enabledFeatures.includes(item))
  )
}

function uniq<T>(array: T[]): T[] {
  return Array.from(new Set<T>(array))
}
