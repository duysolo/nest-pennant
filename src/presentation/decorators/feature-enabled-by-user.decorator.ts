import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { HAVE_FEATURES_FLAG_ENABLED_FOR_USER } from '../../domain/guards'

export const CurrentUserHaveFeaturesEnabled: (
  features: string[]
) => CustomDecorator = (features) =>
  SetMetadata(HAVE_FEATURES_FLAG_ENABLED_FOR_USER, features)
