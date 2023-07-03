import { Inject, Injectable, Scope } from '@nestjs/common'
import {
  IPennantDefinitions,
  PENNANT_DEFINITIONS_MODULE_OPTIONS,
} from '../definitions'
import { FeatureFlagRepository } from '../repositories'
import { REQUEST } from '@nestjs/core'
import { defaultGetUserFromRequest, uniq } from '../helpers'

@Injectable({ scope: Scope.REQUEST })
export class FeaturesFlagService {
  protected isFetched: boolean = false
  protected isFetchedUser: boolean = false

  protected enabledFeatures: string[] = []
  protected enabledFeaturesForUser: string[] = []

  public constructor(
    @Inject(PENNANT_DEFINITIONS_MODULE_OPTIONS)
    private readonly _options: IPennantDefinitions,
    private readonly _repository: FeatureFlagRepository,
    @Inject(REQUEST)
    private readonly _request: unknown
  ) {
    this.enabledFeatures = uniq(this._options.globalEnabledFeatures)
  }

  public async isEnabled(shouldHaveFeatures: string[]): Promise<boolean> {
    await this.fetch()

    return this.checkFeatures(shouldHaveFeatures)
  }

  public async isEnabledForUser(
    shouldHaveFeatures: string[]
  ): Promise<boolean> {
    await this.fetch()

    const user = (
      this._options.getUserFromRequestHandler || defaultGetUserFromRequest
    )(this._request)

    if (!user) {
      return false
    }

    return this.checkFeatures(shouldHaveFeatures)
  }

  protected async fetch(userId?: string): Promise<void> {
    if (!this.isFetchedUser) {
      if (userId) {
        this.enabledFeaturesForUser = await this._repository.getFeaturesByUser(
          userId
        )

        this.isFetchedUser = true
      }
    }

    if (!this.isFetched) {
      this.enabledFeatures = await this._repository.getFeatures()

      this.isFetched = true

      console.log(`fetch enabledFeatures again`)
    }
  }

  protected checkFeatures(shouldHaveFeatures: string[]) {
    const allEnabledFeatures = uniq([
      ...this.enabledFeatures,
      ...this.enabledFeaturesForUser,
      ...this._options.globalEnabledFeatures,
    ])

    return (
      !allEnabledFeatures.length ||
      shouldHaveFeatures.every((item) => allEnabledFeatures.includes(item))
    )
  }
}
