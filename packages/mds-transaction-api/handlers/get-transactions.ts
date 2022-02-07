/**
 * Copyright 2020 City of Los Angeles
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

import { parseRequest } from '@mds-core/mds-api-helpers'
import { ApiRequestParams, ApiResponse } from '@mds-core/mds-api-server'
import {
  PaginationLinks,
  SORTABLE_COLUMN,
  SORT_DIRECTION,
  TransactionDomainModel,
  TransactionSearchParams,
  TransactionServiceClient
} from '@mds-core/mds-transaction-service'
import { deepPickProperties, ValidationError } from '@mds-core/mds-utils'
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { Parser } from 'json2csv'
import { DateTime } from 'luxon'
import { TransactionApiRequest, TransactionApiResponse } from '../@types'

export type TransactionApiGetTransactionsRequest = TransactionApiRequest &
  ApiRequestParams<'provider_id' | 'start_timestamp' | 'end_timestamp'>
export type TransactionApiGetTransactionsRequestWithCursor = TransactionApiGetTransactionsRequest &
  ApiRequestParams<'before' | 'after'>
export type TransactionApiGetTransactionsRequestWithPickColumns = TransactionApiGetTransactionsRequest &
  ApiRequestParams<'pick_columns'>

export type TransactionApiGetTransactionsResponse = TransactionApiResponse<{
  transactions: TransactionDomainModel[]
  links: PaginationLinks
}>

export type TransactionApiGetTransactionsAsCsvResponse = ApiResponse<string>

const getOrderOption = (req: TransactionApiGetTransactionsRequest) => {
  const { order_column: column } = parseRequest(req)
    .single({
      parser: queryVal => {
        const isSortableColumn = (value: unknown): value is SORTABLE_COLUMN =>
          typeof value === 'string' && SORTABLE_COLUMN.includes(value as SORTABLE_COLUMN)

        if (queryVal) {
          if (isSortableColumn(queryVal)) {
            return queryVal
          }

          /**
           * If the param exists but is not a string or sortable column, throw a validation error
           */
          throw new ValidationError(`Invalid sortable column ${queryVal}`)
        }
      }
    })
    .query('order_column')

  const { order_direction: direction = 'ASC' } = parseRequest(req)
    .single({
      parser: queryVal => {
        const isDirection = (value: unknown): value is SORT_DIRECTION =>
          typeof queryVal === 'string' && SORT_DIRECTION.includes(value as SORT_DIRECTION)

        if (queryVal) {
          if (isDirection(queryVal)) {
            return queryVal
          }

          /**
           * If the param exists but is not a direction, throw a validation error
           */
          throw new ValidationError(`Invalid sort direction ${queryVal}`)
        }
      }
    })
    .query('order_direction')

  const order = column ? { column, direction } : undefined

  return order
}

/**
 * Construct URLs given search options & cursor location
 * @param req Express Request
 * @param param1 Search options & cursor location
 */
const constructUrls = (
  req: TransactionApiGetTransactionsRequest,
  { order, ...basicOptions }: TransactionSearchParams
) => {
  const url = new URL(`${req.get('x-forwarded-proto') || req.protocol}://${req.get('host')}${req.path}`)

  const basicOptionsUrls = Object.entries(basicOptions).reduce((urlParams, [key, val]) => {
    if (val) {
      const paramsTail = urlParams.slice(-1)

      if (paramsTail === '?') return `${urlParams}${key}=${val}`
      return `${urlParams}&${key}=${val}`
    }

    return urlParams
  }, `${url}?`)

  // We can do this because we're assured to have *something* in `basicOptionsUrls` if we're generating a page
  if (order) {
    return `${basicOptionsUrls}&order_column=${order.column}&order_direction=${order.direction}`
  }

  return basicOptionsUrls
}

export const GetTransactionsHandler = async (
  req: TransactionApiGetTransactionsRequestWithCursor,
  res: TransactionApiGetTransactionsResponse,
  next: express.NextFunction
) => {
  try {
    const { scopes } = res.locals

    const order = getOrderOption(req)
    const {
      provider_id: queried_provider_id,
      before,
      after
    } = parseRequest(req).single({ parser: String }).query('provider_id', 'before', 'after')

    // eslint-reason checkAccess middleware has previously verified that local.claims.provider_id is a UUID
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const provider_id = scopes.includes('transactions:read') ? queried_provider_id : res.locals.claims!.provider_id!

    const {
      start_timestamp,
      end_timestamp,
      limit = 10
    } = parseRequest(req).single({ parser: Number }).query('start_timestamp', 'end_timestamp', 'limit')

    const { transactions, cursor } = await TransactionServiceClient.getTransactions({
      provider_id,
      before,
      after,
      start_timestamp,
      end_timestamp,
      order,
      limit
    })

    const { version } = res.locals

    const links: PaginationLinks = {
      prev: cursor.beforeCursor
        ? constructUrls(req, {
            order,
            provider_id,
            start_timestamp,
            end_timestamp,
            limit,
            before: cursor.beforeCursor
          })
        : null,
      next: cursor.afterCursor
        ? constructUrls(req, {
            order,
            provider_id,
            start_timestamp,
            end_timestamp,
            limit,
            after: cursor.afterCursor
          })
        : null
    }

    return res.status(200).send({ version, transactions, links })
  } catch (error) {
    next(error)
  }
}
export const GetTransactionsAsCsvHandler = async (
  req: TransactionApiGetTransactionsRequestWithPickColumns,
  res: TransactionApiGetTransactionsAsCsvResponse,
  next: express.NextFunction
) => {
  try {
    const { provider_id } = parseRequest(req).single({ parser: String }).query('provider_id')
    const order = getOrderOption(req)
    const {
      start_timestamp,
      end_timestamp,
      limit = 10
    } = parseRequest(req).single({ parser: Number }).query('start_timestamp', 'end_timestamp', 'limit')
    const PICKABLE_COLUMNS = <const>[
      'transaction_id',
      'provider_id',
      'device_id',
      'timestamp',
      'fee_type',
      'amount',
      'receipt.receipt_id',
      'receipt.timestamp',
      'receipt.origin_url',
      'receipt.receipt_details'
    ]
    type PickableColumn = typeof PICKABLE_COLUMNS[number]
    const isColumn = (col: string): col is PickableColumn => (PICKABLE_COLUMNS as readonly string[]).includes(col)
    const { pick_columns } = parseRequest(req)
      .list({
        parser: vals => vals.filter(isColumn)
      })
      .query('pick_columns')

    const fields: Array<{ label: string; value: PickableColumn }> = [
      { label: 'Transaction', value: 'transaction_id' },
      { label: 'Provider', value: 'provider_id' },
      { label: 'Device', value: 'device_id' },
      { label: 'Timestamp', value: 'timestamp' },
      { label: 'Fee Type', value: 'fee_type' },
      { label: 'Amount', value: 'amount' },
      { label: 'Receipt', value: 'receipt.receipt_id' },
      { label: 'Receipt Timestamp', value: 'receipt.timestamp' },
      { label: 'Receipt Origin URL', value: 'receipt.origin_url' },
      { label: 'Receipt Details (JSON)', value: 'receipt.receipt_details' } // TODO test this
    ]

    const conf = {
      fields: pick_columns
        ? fields
            .filter(({ value }) => pick_columns.includes(value))
            .sort((a, b) => pick_columns.indexOf(a.value) - pick_columns.indexOf(b.value))
        : fields
    }
    const parser = new Parser(conf)

    const { transactions, cursor } = await TransactionServiceClient.getTransactions({
      provider_id,
      start_timestamp,
      end_timestamp,
      order,
      limit
    })

    const chunk = pick_columns ? transactions.map(row => deepPickProperties(row, pick_columns)) : transactions
    res
      .status(StatusCodes.OK)
      .contentType('text/csv')
      .header('Access-Control-Expose-Headers', 'Content-Disposition')
      .header(
        'Content-Disposition',
        `attachment; filename="transactions-${DateTime.now().toFormat('yyyy-LL-dd hh.mm.ss a')}.csv"`
      )
      .write(parser.parse(chunk))

    let next = cursor.afterCursor
    const headlessParser = new Parser({
      header: false,
      ...conf
    })
    while (next !== null) {
      const { transactions, cursor: current } = await TransactionServiceClient.getTransactions({
        provider_id,
        start_timestamp,
        end_timestamp,
        order,
        limit,
        after: next
      })
      const chunk = pick_columns ? transactions.map(row => deepPickProperties(row, pick_columns)) : transactions
      res.write('\n' + headlessParser.parse(chunk))
      next = current.afterCursor
    }

    return res.end()
  } catch (error) {
    next(error)
  }
}
