import { Injectable } from '@nestjs/common'
import { FeatureFlagRepository } from '../../domain/repositories'

/**
 * Be default, we only get from globalEnabledFeatures definitions
 * @see IPennantDefinitions
 */

@Injectable()
export class DefaultFeatureFlagRepository implements FeatureFlagRepository {
  public async getFeatures(): Promise<string[]> {
    return []
  }

  public async getFeaturesByUser(__: string): Promise<string[]> {
    return []
  }
}
