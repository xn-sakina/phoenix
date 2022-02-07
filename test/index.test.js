const { EsbuildPhoenix } = require('../dist')
const assert = require('assert')

const ins = new EsbuildPhoenix()

const res = require('./check')

assert(res.a === 'aaa')
assert(res.b === 222)
assert(res.c === 'ccc')
assert(ins.getFiles().length === 3)
