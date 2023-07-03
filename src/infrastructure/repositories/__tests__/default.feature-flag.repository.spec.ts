import { DefaultFeatureFlagRepository } from '../default.feature-flag.repository'

describe(`DefaultFeatureFlagRepository tests`, () => {
  const featureFlagRepo = new DefaultFeatureFlagRepository()

  it('should able to call getFeatures', async function () {
    expect(await featureFlagRepo.getFeatures()).toEqual([])
  })

  it('should able to call getFeaturesByUser', async function () {
    expect(await featureFlagRepo.getFeaturesByUser('sample-id')).toEqual([])
  })
})
