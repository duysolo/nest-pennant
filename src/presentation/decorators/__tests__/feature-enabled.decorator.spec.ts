import {
  HAVE_FEATURES_FLAG_ENABLED,
  HAVE_SIMPLE_FEATURES_FLAG_ENABLED,
} from '../../../domain'
import { FeaturesEnabled, FeaturesEnabledSimple } from '../feature-enabled.decorator'
import { metadataDecoratorTestHelper } from './helpers/metadata-decorator.test.helper'

const featuresShouldHave = ['FEATURE_1', 'FEATURE_2']

metadataDecoratorTestHelper(
  'FeaturesEnabled',
  {
    handler: FeaturesEnabled,
    params: [featuresShouldHave],
  },
  HAVE_FEATURES_FLAG_ENABLED,
  featuresShouldHave
)

metadataDecoratorTestHelper(
  'FeaturesEnabledSimple',
  {
    handler: FeaturesEnabledSimple,
    params: [featuresShouldHave],
  },
  HAVE_SIMPLE_FEATURES_FLAG_ENABLED,
  featuresShouldHave
)
