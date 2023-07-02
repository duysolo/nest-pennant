import {
  DynamicModule,
  InjectionToken,
  Module,
  ModuleMetadata,
  OptionalFactoryDependency,
  Provider,
  Scope,
} from '@nestjs/common'
import { FeaturesFlagService } from './domain/services/features-flag.service'
import {
  IPennantDefinitions,
  PENNANT_DEFINITIONS_MODULE_OPTIONS,
} from './domain/definitions'
import { APP_GUARD, Reflector } from '@nestjs/core'
import { FeatureFlagGuard } from './domain/guards'
import { FeatureFlagRepository } from './domain/repositories'
import { DefaultFeatureFlagRepository } from './infrastructure/repositories'

export interface IPennantModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  global: boolean
  definitions: Pick<ModuleMetadata, 'imports'> & {
    useFactory: (
      ...args: any[]
    ) => Promise<IPennantDefinitions> | IPennantDefinitions
    inject?: Array<InjectionToken | OptionalFactoryDependency>
  }
  featureFlagRepository?: {
    useFactory: (
      ...args: any[]
    ) => Promise<FeatureFlagRepository> | FeatureFlagRepository
    inject?: Array<InjectionToken | OptionalFactoryDependency>
  }
}

@Module({})
class PennantDefinitionsModule {
  public static forRootAsync(
    options: IPennantModuleOptions['definitions']
  ): DynamicModule {
    const definitionModuleProvider: Provider = {
      provide: PENNANT_DEFINITIONS_MODULE_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject,
    }

    return {
      module: PennantDefinitionsModule,
      providers: [definitionModuleProvider],
      exports: [definitionModuleProvider],
      imports: options.imports || [],
    }
  }
}

@Module({})
export class PennantModule {
  public static forRootAsync({
    imports,
    definitions,
    featureFlagRepository,
    global,
  }: IPennantModuleOptions): DynamicModule {
    return {
      module: PennantModule,
      global,
      imports: [
        ...(imports || []),
        PennantDefinitionsModule.forRootAsync(definitions),
      ],
      providers: [
        FeaturesFlagService,
        {
          ...(featureFlagRepository || {
            useClass: DefaultFeatureFlagRepository,
          }),
          provide: FeatureFlagRepository,
        },
        {
          provide: APP_GUARD,
          scope: Scope.REQUEST,
          useFactory: (ref: Reflector, service: FeaturesFlagService) => {
            return new FeatureFlagGuard(ref, service)
          },
          inject: [Reflector, FeaturesFlagService],
        },
      ],
      exports: [FeaturesFlagService, FeatureFlagRepository],
    }
  }
}
