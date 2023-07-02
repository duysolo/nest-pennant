import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { FEATURES_FLAG_ENABLED } from '../../domain/guards'

export const ShouldHaveFeaturesEnabled: (
  features: string[]
) => CustomDecorator = (features) =>
  SetMetadata(FEATURES_FLAG_ENABLED, features)
