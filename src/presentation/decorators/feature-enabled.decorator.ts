import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { HAVE_FEATURES_FLAG_ENABLED, HAVE_SIMPLE_FEATURES_FLAG_ENABLED } from '../../domain/guards'

export const FeaturesEnabled: (features: string[]) => CustomDecorator = (
  features
) => SetMetadata(HAVE_FEATURES_FLAG_ENABLED, features)

export const FeaturesEnabledSimple: (features: string[]) => CustomDecorator = (
  features
) => SetMetadata(HAVE_SIMPLE_FEATURES_FLAG_ENABLED, features)
