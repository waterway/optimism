/* Imports: External */
import Config from 'bcfg'
import * as dotenv from 'dotenv'
import { cloneDeep } from 'lodash'
import { Command, Option } from 'commander'

/* Imports: Internal */
import { Logger } from '../common/logger'
import { TypingFunction } from './types'

export type Options = {
  [key: string]: string
}

export type ParsedOptions<TOptions extends Options> = {
  [P in keyof TOptions]: any
}

export type OptionSettings<
  TOptions extends Options,
  TParsedOptions extends ParsedOptions<TOptions>
> = {
  [P in keyof TOptions]: {
    description: string
    default?: TOptions[P]
    type: TypingFunction<TParsedOptions[P]>
  }
}

export abstract class Service<
  TOptions extends Options,
  TParsedOptions extends ParsedOptions<TOptions>,
  TServiceState
> {
  protected loop: boolean
  protected logger: Logger
  protected state: TServiceState
  protected readonly options: TParsedOptions
  protected readonly optionSettings: OptionSettings<TOptions, TParsedOptions>

  constructor(params: {
    name: string
    options?: Partial<TOptions>
    optionSettings: OptionSettings<TOptions, TParsedOptions>
    state: TServiceState
    loop?: boolean
  }) {
    this.loop = params.loop || false
    this.state = params.state
    this.optionSettings = params.optionSettings

    // Use commander as a way to communicate info about the service. We don't actually *use*
    // commander for anything besides the ability to run `ts-node ./service.ts --help`.
    const program = new Command()
    for (const [optionName, optionSettings] of Object.entries(
      this.optionSettings
    )) {
      program.addOption(
        new Option(
          `--${optionName.toLowerCase()}`,
          `${optionSettings.description}`
        ).env(
          `${params.name
            .replace(/-/g, '_')
            .toUpperCase()}__${optionName.toUpperCase()}`
        )
      )
    }
    program.parse()

    dotenv.config()
    const config = new Config(params.name)
    config.load({
      env: true,
      argv: true,
    })

    params.options = params.options || {}
    this.options = {} as any
    for (const [optionName, optionSettings] of Object.entries(
      this.optionSettings
    )) {
      const optionValue =
        params.options[optionName] || config.str(optionName) || undefined

      if (optionValue === undefined) {
        if (optionSettings.default) {
          // TODO: Figure out how to deal with this typing hell.
          ;(this.options as any)[optionName] = cloneDeep(optionSettings.default)
        } else {
          throw new Error(
            `value for option "${optionName}" was undefined but no default was specified`
          )
        }
      }

      if (optionSettings.type) {
        try {
          // TODO: Figure out how to deal with this typing hell.
          ;(this.options as any)[optionName] =
            optionSettings.type.parse(optionValue)
        } catch (err) {
          throw new Error(
            `unparseable value for option "${optionName}": ${optionValue}`
          )
        }

        if (!optionSettings.type.validate((this.options as any)[optionName])) {
          throw new Error(
            `value for option "${optionName}" is invalid: ${optionValue}`
          )
        }
      }
    }

    this.logger = new Logger({ name: params.name })
  }

  public run(): void {
    const _run = async () => {
      if (this.init) {
        this.logger.info('initializing service')
        await this.init()
        this.logger.info('service initialized')
      }

      if (this.loop) {
        this.logger.info('starting main loop')
        while (true) {
          try {
            await this.main()
          } catch (err) {
            this.logger.error('caught an unhandled exception', {
              message: err.message,
              stack: err.stack,
              code: err.code,
            })
          }
        }
      } else {
        this.logger.info('running main function')
        await this.main()
      }
    }

    _run()
  }

  protected abstract init?(): Promise<void>
  protected abstract main(): Promise<void>
}
