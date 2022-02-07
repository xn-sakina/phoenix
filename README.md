# @xn-sakina/phoenix

Esbuild transform register for require typescript file

### Install

```bash
  pnpm add -D @xn-sakina/phoenix
```

### Usage

```ts
// use es module
import { EsbuildPhoenix } from '@xn-sakina/phoenix'
// or use cjs: 
//   const { EsbuildPhoenix } = require('@xn-sakina/phoenix')

// esbuild register init
const ins = new EsbuildPhoenix()

// require typescript
const result = require('./some-typescript-file')

// use `result`
// ...

// restore register
ins.restore()
```

### License

MIT
