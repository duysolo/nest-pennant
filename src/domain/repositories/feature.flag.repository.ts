import { ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export abstract class FeatureFlagRepository {
  public abstract getFeatures(context: ExecutionContext): Promise<string[]>

  public abstract getFeaturesByUser(userId: string): Promise<string[]>
}
