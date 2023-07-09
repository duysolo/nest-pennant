import { HAVE_FEATURES_FLAG_ENABLED_FOR_USER } from '../../../domain'
import { metadataDecoratorTestHelper } from './helpers/metadata-decorator.test.helper'
import { FeaturesEnabledForUser } from '../feature-enabled-for-user.decorator'

const featuresShouldHave = ['FEATURE_1']

metadataDecoratorTestHelper(
  'CurrentUserHaveFeaturesEnabled',
  {
    handler: FeaturesEnabledForUser,
    params: [featuresShouldHave],
  },
  HAVE_FEATURES_FLAG_ENABLED_FOR_USER,
  featuresShouldHave
)
