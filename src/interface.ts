export interface IPhoenixFile {
  filename: string
  compiled: boolean
}

export interface IPhoenixCompileOptions {
  code: string
  filename: string
}

export interface IPhoenixTransformOptions extends IPhoenixCompileOptions {
  /**
   * @default require('esbuild')
   */
  implementor?: EsbuildInstance
  /**
   * @default cjs
   */
  format?: PhoenixFormat
}

export type EsbuildInstance = typeof import('esbuild')
export type PhoenixFormat = 'cjs' | 'esm'
export interface IEsbuildPhoenixOpts {
  /**
   * default will transform all format file
   * @default false
   */
  onlyTransformTs?: boolean
  /**
   * transform target format
   * @default cjs
   */
  format?: PhoenixFormat
  /**
   * esbuild instance
   * @default require('esbuild')
   */
  implementor?: EsbuildInstance
}

export const TS_EXTS = ['.ts', '.tsx']
export const EXTS = [...TS_EXTS, '.js', '.jsx']

export const noop = () => {}
