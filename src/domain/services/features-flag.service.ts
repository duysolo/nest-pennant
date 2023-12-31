import { Inject, Injectable } from '@nestjs/common'
import {
  IPennantDefinitions,
  PENNANT_DEFINITIONS_MODULE_OPTIONS,
} from '../definitions'
import { FeatureFlagRepository } from '../repositories'
import { REQUEST } from '@nestjs/core'
import { defaultGetUserFromRequest, uniq } from '../helpers'

@Injectable()
export class FeaturesFlagService {
  protected isFetched: boolean = false
  protected enabledFeatures: string[] = []

  protected isFetchedUser: Record<string, boolean> = {}
  protected enabledFeaturesForUser: Record<string, string[]> = {}

  public constructor(
    @Inject(PENNANT_DEFINITIONS_MODULE_OPTIONS)
    private readonly _options: IPennantDefinitions,
    private readonly _repository: FeatureFlagRepository,
    @Inject(REQUEST)
    private readonly _request: unknown
  ) {
    this.enabledFeatures = uniq(this._options.enabledFeatures)
  }

  public async isEnabled(shouldHaveFeatures: string[]): Promise<boolean> {
    await this.fetch()

    return this.checkFeatures(shouldHaveFeatures)
  }

  public async isEnabledForUser(
    shouldHaveFeatures: string[]
  ): Promise<boolean> {
    const userId = await (this._options.getUserFromRequestHandler
      ? this._options.getUserFromRequestHandler
      : defaultGetUserFromRequest)(this._request)

    if (!userId) {
      return false
    }

    await this.fetch(userId)

    return this.checkFeatures(shouldHaveFeatures, userId)
  }

  protected async fetch(userId?: string): Promise<void> {
    if (userId) {
      if (!this.isFetchedUser[userId]) {
        this.enabledFeaturesForUser[userId] =
          await this._repository.getFeaturesByUser(userId)

        this.isFetchedUser[userId] = true
      }
    }

    if (!this.isFetched) {
      this.enabledFeatures = await this._repository.getFeatures()

      this.isFetched = true
    }
  }

  protected checkFeatures(shouldHaveFeatures: string[], userId?: string) {
    const allEnabledFeatures = [
      ...this.enabledFeatures,
      ...(userId ? this.enabledFeaturesForUser[userId] || [] : []),
      ...this._options.enabledFeatures,
    ]

    return (
      !allEnabledFeatures.length ||
      shouldHaveFeatures.every((item) => allEnabledFeatures.includes(item))
    )
  }
}
