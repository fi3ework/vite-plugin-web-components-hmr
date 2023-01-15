import type { Plugin } from 'vite'

interface BaseClass {
  name: string
  import?: string
}

interface Decorator {
  name: string
  import?: string
}

interface FunctionOption {
  name: string
  import?: string
}

interface Preset {
  baseClasses: BaseClass[]
  decorators: Decorator[]
  patch: string
}

// at least one of include or exclude is required
// https://stackoverflow.com/a/60881998/8063488
type Range = {
  include?: string[]
  exclude?: string[]
} & (
  | {
      include: string[]
    }
  | {
      exclude: string[]
    }
)

type HmrPluginConfig = Range & {
  presets?: Preset[]
  baseClasses?: BaseClass[]
  decorators?: Decorator[]
  functions?: FunctionOption[]
  patches?: string[]
}

type HmrPluginFactory = (options: HmrPluginConfig) => Plugin

export const hmrPlugin: HmrPluginFactory
export const presets: Record<
  'listElement' | 'fastElement' | 'haunted' | 'lit',
  Preset
>
export const WC_HMR_MODULE_RUNTIME: string
