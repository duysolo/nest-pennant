import { ExecutionContext, Injectable } from '@nestjs/common'
import { FeatureFlagRepository } from '../../domain/repositories'

/**
 * Be default, we only get from globalEnabledFeatures definitions
 * @see IPennantDefinitions
 */

@Injectable()
export class DefaultFeatureFlagRepository implements FeatureFlagRepository {
  public async getFeatures(__: ExecutionContext): Promise<string[]> {
    return []
  }

  public async getFeaturesByUser(__: string): Promise<string[]> {
    return []
  }
}
