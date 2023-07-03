import { Reflector } from '@nestjs/core'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { FeaturesFlagService, SimpleFeaturesFlagService } from '../services'

export const HAVE_FEATURES_FLAG_ENABLED = 'HAVE_FEATURES_FLAG_ENABLED'

export const HAVE_SIMPLE_FEATURES_FLAG_ENABLED =
  'HAVE_SIMPLE_FEATURES_FLAG_ENABLED'

export const HAVE_FEATURES_FLAG_ENABLED_FOR_USER =
  'HAVE_FEATURES_FLAG_ENABLED_FOR_USER'

@Injectable()
export class FeaturesFlagGuard implements CanActivate {
  public constructor(
    private readonly _reflector: Reflector,
    private readonly _featuresFlagService: FeaturesFlagService,
    private readonly _simpleFeaturesFlagService: SimpleFeaturesFlagService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const simpleFeatures = this._reflector.getAllAndOverride<string[]>(
      HAVE_SIMPLE_FEATURES_FLAG_ENABLED,
      [context.getHandler(), context.getClass()]
    )

    if (simpleFeatures) {
      return this.handle(simpleFeatures, true)
    }

    const featuresForUser = this._reflector.getAllAndOverride<string[]>(
      HAVE_FEATURES_FLAG_ENABLED_FOR_USER,
      [context.getHandler(), context.getClass()]
    )

    const features = this._reflector.getAllAndOverride<string[]>(
      HAVE_FEATURES_FLAG_ENABLED,
      [context.getHandler(), context.getClass()]
    )

    if (featuresForUser) {
      return this.handle([...featuresForUser, ...(features || [])])
    }

    return this.handle(features)
  }

  protected async handle(features: string[], keepSimple?: boolean) {
    if (!Array.isArray(features) || !features.length) {
      return true
    }

    if (keepSimple) {
      return this._simpleFeaturesFlagService.isEnabled(features)
    }

    return this._featuresFlagService.isEnabled(features)
  }
}
