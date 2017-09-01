Bcccore Blockchain APIs
======

[![NPM Package](https://img.shields.io/npm/v/bcccore-explorers.svg?style=flat-square)](https://www.npmjs.org/package/bcccore-explorers)
[![Build Status](https://img.shields.io/travis/owstack/bcccore-explorers.svg?branch=master&style=flat-square)](https://travis-ci.org/owstack/bcccore-explorers)
[![Coverage Status](https://img.shields.io/coveralls/owstack/bcccore-explorers.svg?style=flat-square)](https://coveralls.io/r/owstack/bcccore-explorers)

A module for [bcccore](https://github.com/owstack/bcccore) that implements HTTP requests to different Web APIs to query the state of the blockchain.

## Attribution

This repository was created by copy forking [bitcore-explorers commit 1f1334f](https://github.com/bitpay/bitcore-explorers/commit/1f1334f7ea7f75ed80f62d379613a961a66403f2).

## Getting started

Be careful! When using this module, the information retrieved from remote servers may be compromised and not reflect the actual state of the blockchain.

```sh
npm install bcccore-explorers
bower install bcccore-explorers
```

At the moment, only Explorer is supported, and only getting the UTXOs for an address and broadcasting a transaction.

```javascript
var explorers = require('bcccore-explorers');
var explorer = new explorers.Explorer();

explorer.getUtxos('1Bitcoin...', function(err, utxos) {
  if (err) {
    // Handle errors...
  } else {
    // Maybe use the UTXOs to create a transaction
  }
});
```

## Contributing

See [CONTRIBUTING.md](https://github.com/owstack/bcccore/blob/master/CONTRIBUTING.md) on the main bcccore repo for information about how to contribute.

## License

Code released under [the MIT license](https://github.com/owstack/bcccore/blob/master/LICENSE).

Copyright 2017 Open Wallet Stack. Bcccore is a trademark maintained by Open Wallet Stack.

[bcccore]: http://github.com/owstack/bcccore-explorers
