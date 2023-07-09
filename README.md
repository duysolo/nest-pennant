# NestJS Pennant

### A simple and light-weight feature flag package exclusively designed for NestJS
- This purpose-built tool eliminates unnecessary complexity
- allowing you to seamlessly roll out new application features with confidence
- conduct A/B testing for interface designs
- effortlessly complement a trunk-based development strategy 
- unlock a multitude of possibilities within your NestJS projects.

## Installation
First, install PennantModule into your project using the `npm`:

```shell
npm install --save @pipelife-labs/nest-pennant
```

### Register `PennantModule` to your application module

```
import { ConfigModule, ConfigService } from '@nestjs/config'
import { IPennantDefinitions, PennantModule } from '@pipelife-labs/nest-pennant'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PennantModule.forRootAsync({
      imports: [],
      definitions: {
        imports: [],
        useFactory: (config: ConfigService): IPennantDefinitions => {
          return {
            enabledFeatures: config
              .get<string>('FEATURES_FLAG_ENABLED', '')
              .split(',')
              .map((ft) => ft.trim()),
          }
        },
        inject: [ConfigService],
      },
      /**
      * In case you want to register some providers inside PennantModule
      * These providers will be also exported from PennantModule
      */
      otherProviders: [],
      /**
      * To make the PennantModule available throughout the entire app
      */
      global: true,
    }),
  ],
  ...
})
export class AppModule {}
```

### Definitions

```
interface IPennantDefinitions {
  enabledFeatures: string[]
  getUserFromRequestHandler?: (
    req: unknown
  ) => string | undefined | Promise<string | undefined>
}
```

- `enabledFeatures`: specifies all the enabled features. In most cases, we fetch them via environment variables.
- `getUserFromRequestHandler`: used when you want to check the features that are specified for specific users (A/B testing). This hook helps us to get the currently logged-in user. By default, we have a built-in function to get the current user:

```
/**
* @see ./domain/helpers/get-user-from-request.helper.ts
*/

interface IUSerFromRequest {
  [x: string]: unknown

  id: string
}

export const defaultGetUserFromRequest = (req: any): string | undefined => {
  const user: IUSerFromRequest = req.user

  return user?.id
}
```

This default approach is compatible with Passport JWT strategy for both `Express` and `Fastify` frameworks.

### Define your own handler to get user from request

```
PennantModule.forRootAsync({
  definitions: {
    imports: [],
    useFactory: (config: ConfigService): IPennantDefinitions => {
      return {
        enabledFeatures: config
          .get<string>('FEATURES_FLAG_ENABLED', '')
          .split(',')
          .map((feature) => feature.trim()),
        getUserFromRequestHandler: async (
          req: any
        ): Promise<string | undefined> => {
          // Put your updated logic here
          return req?.user?.id
        },
      }
    },
    inject: [ConfigService],
  },
  ...
})
```

## Define the repository to get the enabled features
This approach will be helpful if you need to fetch the features list from other data sources such as Firebase, MongoDB, PostgreSQL, or external APIs.

```
import { Injectable } from '@nestjs/common'
import { FeatureFlagRepository } from '@pipelife-labs/nest-pennant'

@Injectable()
export class SampleFeatureFlagRepository implements FeatureFlagRepository {
  public async getFeatures(): Promise<string[]> {
    // Put your updated logic here
    return []
  }

  public async getFeaturesByUser(userId: string): Promise<string[]> {
    // Put your updated logic here
    return []
  }
}
```

Then you need to define it when register our `PennantModule`

```
PennantModule.forRootAsync({
  featureFlagRepository: {
    useFactory: () => {
      return new SampleFeatureFlagRepository()
    },
    inject: []
  },
  ...
})
```

## Usages

### `FeaturesEnabledSimple` decorator

It will only check the features passed to the package via the `enabledFeatures` from `definitions` options when you register the `PennantModule`.

Internally, it utilizes the `SimpleFeaturesFlagService` to check the features flag.

```
import { FeaturesEnabledSimple } from '@pipelife-labs/nest-pennant'

@Controller('test-3')
@FeaturesEnabledSimple(['FEATURE_6', 'FEATURE_7'])
export class Test3Controller {
  @Get()
  public index(): string {
    return 'Hello World!'
  }
}

@Controller('test-4')
export class Test4Controller {
  @Get()
  @FeaturesEnabledSimple(['FEATURE_6', 'FEATURE_7'])
  public index(): string {
    return 'Hello World!'
  }
}
```

### `FeaturesEnabled` decorator
The fetched features from `featureFlagRepository` will then be merged with the features list in the `enabledFeatures` from the `definitions` option mentioned above.

Internally, it utilizes the `FeaturesFlagService` (which defined in `REQUEST` scope) to check the features flag.

```
import { FeaturesEnabled } from '@pipelife-labs/nest-pennant'

@Controller('test')
@FeaturesEnabled(['FEATURE_5'])
export class TestController {
  @Get()
  public index(): string {
    return 'Hello World!'
  }
}

@Controller('test-2')
export class Test2Controller {
  @Get()
  @FeaturesEnabled(['FEATURE_6', 'FEATURE_7'])
  public index(): string {
    return 'Hello World!'
  }
}
```

### `FeaturesEnabledForUser` decorator
This approach functions similarly to `FeaturesEnabled`, but it verifies the features for the currently logged-in user.

Certainly, please make sure to check the `getUserFromRequestHandler` handler that was mentioned earlier.

```
import { FeaturesEnabled } from '@pipelife-labs/nest-pennant'

@Controller('test-5')
export class Test2Controller {
  @Get()
  @FeaturesEnabledForUser(['FEATURE_6', 'FEATURE_7'])
  public index(): string {
    return 'Hello World!'
  }
}
```

### `SimpleFeaturesFlagService` & `FeaturesFlagService` services
You can also use the exposed services `SimpleFeaturesFlagService` and `FeaturesFlagService` from the package to perform logical checks as well.

```
import { SimpleFeaturesFlagService, FeaturesFlagService } from '@pipelife-labs/nest-pennant'

@Controller('test-6')
export class Test6Controller {
  public constructor(
    private readonly _simpleFeaturesFlagService: SimpleFeaturesFlagService,
    private readonly _featuresFlagService: FeaturesFlagService
  ) {}

  @Get()
  public index(): string {
    console.log(this._simpleFeaturesFlagService)
    console.log(this._featuresFlagService)
    return 'Hello World!'
  }
}
```

Note: `FeaturesFlagService` is initialized with a `REQUEST` scope.
[NestJS Injection Scopes](https://docs.nestjs.com/fundamentals/injection-scopes)