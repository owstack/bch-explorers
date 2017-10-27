# Explorers
The `bch-explorers` module provides a convenient interface to retrieve unspent transaction outputs and broadcast transactions to the Bitcoin network via blockchain explorers.

## Installation
Explorers is implemented as a separate module.

For node projects:

```
npm install bch-explorers --save
```

For client-side projects:

```
bower install bch-explorers --save
```

## OWS Explorer
### Description
`Explorer` is a simple agent to perform queries to an OWS Explorer blockchain explorer. The default servers are `https://explorer.openwalletstack.com` and `https://test-explorer.openwalletstack.com`, hosted by Open Wallet Stack. You can (and we strongly suggest you do) run your own explorer server. For more information, head to [https://github.com/owstack/explorer-api](https://github.com/owstack/explorer-api)

There are currently two methods implemented: `getUnspentUtxos` and `broadcast`. The API will grow as features are requested.

#### Retrieving Unspent UTXOs for an Address (or set of)

```javascript
var Explorer = require('@owstack/bch-explorers').Explorer;
var explorer = new Explorer();

explorer.getUnspentUtxos('1Bitcoin...', function(err, utxos) {
  if (err) {
    // Handle errors...
  } else {
    // Maybe use the UTXOs to create a transaction
  }
});
```

#### Broadcasting a Transaction

```javascript
var explorer = new Explorer();
explorer.broadcast(tx, function(err, returnedTxId) {
  if (err) {
    // Handle errors...
  } else {
    // Mark the transaction as broadcasted
  }
});
```
