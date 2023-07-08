# Mercury Pennant

### A sleek and lightweight feature flag package exclusively designed for NestJS
- This purpose-built tool eliminates unnecessary complexity
- allowing you to seamlessly roll out new application features with confidence
- conduct A/B testing for interface designs
- effortlessly complement a trunk-based development strategy 
- unlock a multitude of possibilities within your NestJS projects.

## Installation
```shell
npm install --save @mercury-labs/nest-pennant
```

### Register `PennantModule` to your application module

```
PennantModule.forRootAsync({
  imports: [],
  definitions: {
    imports: [],
    useFactory: (config: ConfigService) => {
      return {
        globalEnabledFeatures: config
          .get<string>('GLOBAL_FEATURES_FLAG_ENABLED', '')
          .split(',')
          .map((feature) => feature.trim()),
      }
    },
    inject: [ConfigService],
  },
  /**
  * In case you want to register some providers inside PennantModule
  * These providers will be also exported from PennantModule
  */
  otherProviders: [],
  global: true,
})
```

## Usages

#### `FeaturesEnabledSimple` decorator

It will only check the features passed to the package via the `globalEnabledFeatures` from `definitions` options when you register the `PennantModule`.

#### `FeaturesEnabled` decorator
In case you want to fetch the features from the other data source (Firebase, MongoDB, PostgreSQL...)