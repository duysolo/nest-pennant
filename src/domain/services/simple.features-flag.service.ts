import { Inject, Injectable } from '@nestjs/common'
import {
  IPennantDefinitions,
  PENNANT_DEFINITIONS_MODULE_OPTIONS,
} from '../definitions'
import { uniq } from '../helpers'

@Injectable()
export class SimpleFeaturesFlagService {
  protected enabledFeatures: string[] = []

  public constructor(
    @Inject(PENNANT_DEFINITIONS_MODULE_OPTIONS)
    private readonly _options: IPennantDefinitions
  ) {
    this.enabledFeatures = uniq(this._options.globalEnabledFeatures)
  }

  public isEnabled(shouldHaveFeatures: string[]): boolean {
    return (
      !this.enabledFeatures.length ||
      shouldHaveFeatures.every((item) => this.enabledFeatures.includes(item))
    )
  }
}
