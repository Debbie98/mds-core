/**
 * Copyright 2022 City of Los Angeles
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NotFoundError, UnsupportedTypeError } from '@mds-core/mds-utils'
import { ConfigFileReader } from '../index'

const config = ConfigFileReader.mount('./tests/data')

describe('Test Config File Reader', () => {
  it('Missing Mount', async () => {
    expect(() => ConfigFileReader.mount('./not-found')).toThrow(NotFoundError)
  })

  it('Missing File', async () => {
    expect(config.fileExists('missing')).toEqual(false)
    await expect(() => config.readFile('missing')).rejects.toThrowError(NotFoundError)
    expect(config.jsonFileExists('missing')).toEqual(false)
    await expect(() => config.readJsonFile('missing')).rejects.toThrowError(NotFoundError)
  })

  it('Exising JSON File', async () => {
    expect(config.jsonFileExists('good')).toEqual(true)
    const file = await config.readJsonFile<{ good: string }>('good')
    expect(file.good).toEqual('good')
  })

  it('Exising JSON5 File', async () => {
    expect(config.jsonFileExists('good5')).toEqual(true)
    const file = await config.readJsonFile<{ good5: string }>('good5')
    expect(file.good5).toEqual('good5')
  })

  it('File Not JSON', async () => {
    await expect(() => config.readJsonFile('bad')).rejects.toThrowError(UnsupportedTypeError)
    await expect(() => config.readJsonFile('bad5')).rejects.toThrowError(UnsupportedTypeError)
  })

  it('Existing non-JSON File', async () => {
    const file = await config.readFile('text', 'txt')
    expect(file).toEqual('text')
  })
})
