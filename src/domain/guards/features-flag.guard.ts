import { Reflector } from '@nestjs/core'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FeaturesFlagService } from '../services'

export const FEATURES_FLAG_ENABLED: string = 'FEATURE_FLAG_ENABLED'

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  public constructor(
    private readonly _reflector: Reflector,
    private readonly _featuresFlagService: FeaturesFlagService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const features = this._reflector.getAllAndOverride<string[]>(
      FEATURES_FLAG_ENABLED,
      [context.getHandler(), context.getClass()]
    )

    if (!Array.isArray(features) || !features.length) {
      return true
    }

    return await this._featuresFlagService.isEnabled(features, context)
  }
}
