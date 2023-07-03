import { Injectable } from '@nestjs/common'

@Injectable()
export abstract class FeatureFlagRepository {
  public abstract getFeatures(): Promise<string[]>

  public abstract getFeaturesByUser(userId: string): Promise<string[]>
}
