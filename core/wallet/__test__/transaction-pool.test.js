const TransactionPool = require('../transaction-pool')
const Transaction = require('../transaction')
const Wallet = require('../wallet.app')

describe('TransactionPool', () => {
  let transactionPool, transaction, senderWallet

  beforeEach(() => {
    transactionPool = new TransactionPool()
    senderWallet = new Wallet()
    transaction = new Transaction({
      senderWallet,
      recipient: 'foo-recipient',
      amount: 50,
    })
  })

  describe('setTransaction()', () => {
    it('adds a transaction', () => {
      transactionPool.setTransaction(transaction)
      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction)
    })
  })

  describe('existingTransaction()', () => {
    it('returns an existing transaction given an input address', () => {
      transactionPool.setTransaction(transaction)
      transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })
      expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(
        transaction
      )
    })
  })

  describe('validTransactions()', () => {
    let validTransactions, errorMock

    beforeEach(() => {
      validTransactions = []
      errorMock = jest.fn()
      global.console.error = errorMock

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: 'xyz-recipient',
          amount: 30,
        })
        if (i % 3 === 0) {
          transaction.input.amount = 99999
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign('foo')
        } else {
          validTransactions.push(transaction)
        }
        transactionPool.setTransaction(transaction)
      }
    })

    it('returns valid transactions', () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions)
    })

    it('logs error for the invalid transactions', () => {
      transactionPool.validTransactions()
      expect(errorMock).toHaveBeenCalled()
    })
  })
})
