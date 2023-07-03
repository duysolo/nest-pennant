import { CustomDecorator, Type } from '@nestjs/common'

interface IDecorator {
  (...params: unknown[]): CustomDecorator
}

interface IDecoratorWithParams {
  handler: IDecorator
  params: unknown[]
}

export function metadataDecoratorTestHelper(
  name: string,
  decorator: IDecoratorWithParams,
  metadataKey: string,
  expectedValue: unknown
) {
  describe(`${name} decorator tests`, () => {
    const testClass: Type = generateTestDecorator(decorator, 'class')

    const testMethod = generateTestDecorator(decorator, 'method') as Type & {
      handle: () => void
    }

    it('should able to get class metadata', function () {
      const metadata = Reflect.getMetadata(metadataKey, testClass)

      expect(metadata).toEqual(expectedValue)
    })

    it('should able to get method metadata', function () {
      const metadata = Reflect.getMetadata(metadataKey, testMethod.handle)

      expect(metadata).toEqual(expectedValue)
    })
  })

  function generateTestDecorator(
    { handler, params }: IDecoratorWithParams,
    type: 'method' | 'class'
  ): Type {
    if (type === 'class') {
      @handler(...params)
      class TestDecoratorClass {}

      return TestDecoratorClass
    }

    class TestDecoratorMethod {
      @handler(...params)
      public static handle() {}
    }

    return TestDecoratorMethod
  }
}
