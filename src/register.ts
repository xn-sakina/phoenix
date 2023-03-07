import {
  EsbuildInstance,
  EXTS,
  IEsbuildPhoenixOpts,
  IPhoenixCompileOptions,
  IPhoenixFile,
  IPhoenixTransformOptions,
  noop,
  PhoenixFormat,
  TS_EXTS,
} from './interface'
import { addHook } from 'pirates'
import type { Loader } from 'esbuild'
import { basename, extname } from 'path'
import * as esbuild from 'esbuild'
import type { TransformOptions } from 'esbuild'

export class EsbuildPhoenix {
  private files: IPhoenixFile[] = []
  private revert: () => void = noop

  // opts
  private format: PhoenixFormat
  private onlyTransformTs: boolean
  private implementor: EsbuildInstance
  private esbuildOpts: TransformOptions

  constructor(opts: IEsbuildPhoenixOpts = {}) {
    const { format, onlyTransformTs, implementor, ...esbuildOpts } = opts

    // opts
    this.format = format ?? 'cjs'
    this.onlyTransformTs = onlyTransformTs ?? false
    this.implementor = implementor ?? esbuild
    this.esbuildOpts = esbuildOpts || {}

    // init
    this.files = []
    this.initHook()
  }

  private initHook() {
    this.revert = addHook(
      (code, filename) => this.compile({ code, filename }),
      {
        exts: EXTS,
        ignoreNodeModules: true,
      }
    )
  }

  static transform({
    code,
    filename,
    implementor = esbuild,
    format = 'cjs',
    esbuildOpts,
  }: IPhoenixTransformOptions) {
    const ext = extname(filename).slice(1)
    const content = implementor.transformSync(code, {
      loader: ext as Loader,
      target: 'es2016',
      format,
      sourcefile: filename,
      ...esbuildOpts,
    }).code
    return content
  }

  private compile({ code, filename }: IPhoenixCompileOptions) {
    if (this.onlyTransformTs) {
      const ext = extname(filename).slice(1)
      if (!TS_EXTS.includes(ext)) {
        this.files.push({ filename, compiled: false })
        return code
      }
    }
    this.files.push({ filename, compiled: true })
    return EsbuildPhoenix.transform({
      code,
      filename,
      implementor: this.implementor,
      format: this.format,
      esbuildOpts: this.esbuildOpts,
    })
  }

  getFiles() {
    return this.files
  }

  clearFiles() {
    this.files = []
  }

  restore() {
    this.revert()
  }
}
