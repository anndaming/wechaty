#!/usr/bin/env ts-node

/**
 *   Wechaty Chatbot SDK - https://github.com/wechaty/wechaty
 *
 *   @copyright 2016 Huan LI (李卓桓) <https://github.com/huan>, and
 *                   Wechaty Contributors <https://github.com/wechaty>.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import test  from 'blue-tape'

import Peer, {
  format,
  parse,
  JsonRpcPayloadResponse,
}                           from 'json-rpc-peer'

import {
  getPeer,
}                   from './io-peer'

test('getPeer()', async t => {
  const EXPECTED_PORT = 8788
  const server = getPeer({
    hostieGrpcPort: EXPECTED_PORT,
  })
  const client = new Peer()

  server.pipe(client).pipe(server)

  const port = await client.request('getHostieGrpcPort')
  t.equal(port, EXPECTED_PORT, 'should get the right port')
})

test('exec()', async t => {
  const EXPECTED_PORT = 8788
  const server = getPeer({
    hostieGrpcPort: EXPECTED_PORT,
  })

  const request = format.request(42, 'getHostieGrpcPort')
  const response = await server.exec(request) as string
  // console.info('response: ', response)

  const obj = parse(response) as JsonRpcPayloadResponse
  t.equal(obj.result, EXPECTED_PORT, 'should get the right port from payload')
})
