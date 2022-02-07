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
import { extname } from 'path'
import * as esbuild from 'esbuild'

export class EsbuildPhoenix {
  private files: IPhoenixFile[] = []
  private revert: () => void = noop

  // opts
  private format: PhoenixFormat
  private onlyTransformTs: boolean
  private implementor: EsbuildInstance

  constructor(opts: IEsbuildPhoenixOpts = {}) {
    // opts
    this.format = opts?.format ?? 'cjs'
    this.onlyTransformTs = opts?.onlyTransformTs ?? false
    this.implementor = opts?.implementor ?? esbuild

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
  }: IPhoenixTransformOptions) {
    const ext = extname(filename).slice(1)
    const content = implementor.transformSync(code, {
      loader: ext as Loader,
      target: 'es2016',
      format,
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
