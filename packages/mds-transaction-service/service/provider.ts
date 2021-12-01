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

import { ProcessController, ServiceException, ServiceProvider, ServiceResult } from '@mds-core/mds-service-helpers'
import { UUID } from '@mds-core/mds-types'
import { TransactionSearchParams, TransactionService } from '../@types'
import { TransactionServiceLogger } from '../logger'
import { TransactionRepository } from '../repository'
import { TransactionStreamKafka } from './stream'
import {
  validateTransactionDomainModel,
  validateTransactionId,
  validateTransactionIds,
  validateTransactionOperationDomainModel,
  validateTransactionStatusDomainModel
} from './validators'

export const TransactionServiceProvider: ServiceProvider<TransactionService> & ProcessController = {
  start: async () => {
    await Promise.all([TransactionRepository.initialize(), TransactionStreamKafka.initialize()])
  },
  stop: async () => {
    await Promise.all([TransactionRepository.shutdown(), TransactionStreamKafka.shutdown()])
  },
  createTransaction: async transaction => {
    try {
      const recordedTransaction = await TransactionRepository.createTransaction(
        validateTransactionDomainModel(transaction),
        {
          beforeCommit: async pendingTransaction => {
            await TransactionStreamKafka.write(pendingTransaction)
          }
        }
      )
      return ServiceResult(recordedTransaction)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Creating Transaction', error)
      TransactionServiceLogger.error('createTransaction error', { exception, error })
      return exception
    }
  },
  createTransactions: async transactions => {
    try {
      const recordedTransactions = await TransactionRepository.createTransactions(
        transactions.map(validateTransactionDomainModel),
        {
          beforeCommit: async pendingTransactions => {
            await TransactionStreamKafka.write(pendingTransactions)
          }
        }
      )
      return ServiceResult(recordedTransactions)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Creating Transactions', error)
      TransactionServiceLogger.error('createTransactions error', { exception, error })
      return exception
    }
  },
  getTransaction: async (transaction_id: UUID) => {
    try {
      const transaction = await TransactionRepository.getTransaction(transaction_id)
      return ServiceResult(transaction)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException(`Error Getting Transaction: ${transaction_id}`, error)
      TransactionServiceLogger.error('getTransaction error', { exception, error })
      return exception
    }
  },
  // TODO search params
  getTransactions: async (search: TransactionSearchParams) => {
    try {
      const transactions = await TransactionRepository.getTransactions(search)
      return ServiceResult(transactions)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Getting Transactions', error)
      TransactionServiceLogger.error('getTransactions error', { exception, error })
      return exception
    }
  },
  addTransactionOperation: async transactionOperation => {
    try {
      const operation = await TransactionRepository.addTransactionOperation(
        validateTransactionOperationDomainModel(transactionOperation)
      )
      return ServiceResult(operation)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Creating Transaction Operation', error)
      TransactionServiceLogger.error('addTransactionOperation error', { exception, error })
      return exception
    }
  },
  // TODO search params
  getTransactionOperations: async (transaction_id: UUID) => {
    try {
      const operations = await TransactionRepository.getTransactionOperations(transaction_id)
      return ServiceResult(operations)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Getting Transaction Operations', error)
      TransactionServiceLogger.error('getTransactionOperations error', { exception, error })
      return exception
    }
  },
  setTransactionStatus: async transactionStatus => {
    try {
      const status = await TransactionRepository.setTransactionStatus(
        validateTransactionStatusDomainModel(transactionStatus)
      )
      return ServiceResult(status)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Creating Transaction Status', error)
      TransactionServiceLogger.error('setTransactionStatus error', { exception, error })
      return exception
    }
  },
  // TODO search params
  getTransactionStatuses: async (transaction_id: UUID) => {
    try {
      validateTransactionId(transaction_id)
      const statuses = await TransactionRepository.getTransactionStatuses(transaction_id)
      return ServiceResult(statuses)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Getting Transaction Operations', error)
      TransactionServiceLogger.error('getTransactionStatuses error', { exception, error })
      return exception
    }
  },
  getTransactionsStatuses: async (transaction_ids: UUID[]) => {
    try {
      validateTransactionIds(transaction_ids)
      const statuses = await TransactionRepository.getTransactionsStatuses(transaction_ids)
      return ServiceResult(statuses)
    } catch (error) /* istanbul ignore next */ {
      const exception = ServiceException('Error Getting Transaction Operations', error)
      TransactionServiceLogger.error('getTransactionsStatuses error', { exception, error })
      return exception
    }
  }
}