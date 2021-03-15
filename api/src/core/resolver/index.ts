import * as z from 'zod'
import { GraphQLResolveInfo } from 'graphql'
import * as nexus from 'nexus'
import {
  FieldOutConfig,
  FieldResolver,
  NexusExtendTypeDef,
} from 'nexus/dist/core'
import { logError } from '@core/utils'
import chalk from 'chalk'
import { getCoreConfig } from '@core/setup'

interface PipeFn<Input, Ctx, Return> {
  (input: Input, ctx: Ctx): Return
}

interface PipeSchema<FieldName extends string, Input, Ctx> {
  pipe: <Return>(
    fn: PipeFn<Input, Ctx, Return>,
  ) => PipeSchema<FieldName, Return, Ctx>
  publish: Input extends ReturnType<FieldResolver<'Mutation', FieldName>>
    ? () => NexusExtendTypeDef<'Mutation'>
    : never
}

interface MergedContext<Parent> extends ConfigClaim<'context'> {
  parent?: Parent
  info: GraphQLResolveInfo
}
const registeredFields: NexusExtendTypeDef<any>[] = []
let getRegisteredFieldsCalled = false

export const getRegisteredFields = (): NexusExtendTypeDef<any>[] => {
  getRegisteredFieldsCalled = true
  return registeredFields
}

const formatFieldNameLog = (fieldName: string): string => {
  if (fieldName.startsWith('queryField')) {
    return `${chalk.italic.green('query')} ${fieldName.substr(
      11,
      fieldName.length - 12,
    )}`
  }

  if (fieldName.startsWith('mutationField')) {
    return `${chalk.italic.magenta('mutation')} ${fieldName.substr(
      14,
      fieldName.length - 15,
    )}`
  }

  return `${chalk.italic.gray('type')} ${fieldName}`
}

const registerField = (
  field: NexusExtendTypeDef<any>,
  logFieldName?: string,
): void => {
  let logLevel: string | undefined = 'all'
  try {
    logLevel = getCoreConfig().log
  } catch (error) {
    // ... supress
  }

  if (getRegisteredFieldsCalled) {
    logError('registerField called after getRegisteredFields was Called')
  }

  if (logLevel === 'all') {
    // eslint-disable-next-line no-console
    console.log('🌱', formatFieldNameLog(logFieldName || field.name))
  }
  registeredFields.push(field)
}

interface Piped<TypeName extends 'Mutation' | 'Query'> {
  <
    FieldName extends string,
    Args extends Parameters<FieldResolver<TypeName, FieldName>>
  >(
    name: FieldName,
    config: Omit<FieldOutConfig<TypeName, FieldName>, 'resolve'>,
  ): PipeSchema<FieldName, Args[1], MergedContext<Args[0]>>
}

export const piper = <TypeName extends 'Mutation' | 'Query'>(
  defineField: (name: string, config: any) => NexusExtendTypeDef<TypeName>,
): Piped<TypeName> => {
  return <
    FieldName extends string,
    Args extends Parameters<FieldResolver<TypeName, FieldName>>
  >(
    name: FieldName,
    config: Omit<FieldOutConfig<TypeName, FieldName>, 'resolve'>,
  ): PipeSchema<FieldName, Args[1], MergedContext<Args[0]>> => {
    const piped: Array<PipeFn<any, any, any>> = []
    const publish = (): void => {
      const field = defineField(
        name,

        // We expect an error because strict mode is on
        // On this mode typescript forces us to show that this function matches a valid resolve function for this field
        // Since we can't know which field at compile time we can't strictly prove this
        {
          ...config,
          resolve: async (
            parent: any,
            args: any,
            prevCtx: ConfigClaim<'context'>,
          ) => {
            let input = args
            const ctx = { ...prevCtx, parent }
            for (let i = 0; piped.length; i += 1) {
              input = await piped[i](input, ctx)
            }
            return input
          },
        },
      )

      registerField(field, `${defineField.name}(${name})`)
    }
    const schema: PipeSchema<FieldName, Args[1], MergedContext<Args[0]>> = {
      pipe: <Return>(fn: PipeFn<Args[1], MergedContext<Args[0]>, Return>) => {
        piped.push(fn)
        return (schema as any) as PipeSchema<
          FieldName,
          Return,
          MergedContext<Args[0]>
        >
      },
      publish: publish as any,
    }

    return schema
  }
}

export const mutation = piper(nexus.mutationField)
export const query = piper(nexus.queryField)

export const zod = <Schema extends z.ZodType<any>>(schema: Schema) => {
  return (input: z.infer<Schema>): z.infer<Schema> => {
    try {
      return schema.parse(input)
    } catch (error) {
      const zError = error as z.ZodError
      // TODO: Format ZodError
      throw zError
    }
  }
}

export const createAndRegister = <T extends (...args: any[]) => any>(
  fn: T,
): T => {
  return ((...args: any[]) => {
    const payload = fn(...args)
    registerField(payload)
    return payload
  }) as T
}

export const objectType = createAndRegister(nexus.objectType)
export const inputObjectType = createAndRegister(nexus.inputObjectType)
export const enumType = createAndRegister(nexus.enumType)
