'use strict';

var sinon = require('sinon');
var should = require('chai').should();
var expect = require('chai').expect;
var bchLib = require('bch-lib');
var explorers = require('../');

var Explorer = explorers.Explorer;
var Address = bchLib.Address;
var Transaction = bchLib.Transaction;
var AddressInfo = explorers.models.AddressInfo;
var Networks = bchLib.Networks;

describe('Explorer', function() {

  describe('instantiation', function() {
    it('can be created without any parameters', function() {
      var explorer = new Explorer();
      should.exist(explorer.url);
      should.exist(explorer.network);
      if (explorer.network === Networks.livenet) {
        explorer.url.should.equal('https://explorer.openwalletstack.com');
      } else if (explorer.network === Networks.testnet) {
        explorer.url.should.equal('https://test-explorer.openwalletstack.com');
      }
    });
    it('can be created providing just a network', function() {
      var explorer = new Explorer(Networks.testnet);
      explorer.url.should.equal('https://test-explorer.openwalletstack.com');
      explorer.network.should.equal(Networks.testnet);
    });
    it('can be created with a custom url', function() {
      var url = 'https://localhost:1234';
      var explorer = new Explorer(url);
      explorer.url.should.equal(url);
    });
    it('can be created with a custom url and network', function() {
      var url = 'https://localhost:1234';
      var explorer = new Explorer(url, Networks.testnet);
      explorer.url.should.equal(url);
      explorer.network.should.equal(Networks.testnet);
    });
    it('defaults to defaultNetwork on a custom url', function() {
      var explorer = new Explorer('https://localhost:1234');
      explorer.network.should.equal(Networks.defaultNetwork);
    });
  });

  describe('getting unspent utxos', function() {
    var explorer = new Explorer();
    var address = 'HBqt2mntvCKa84VGhjsK8yz71FzA9Hp8X6';
    beforeEach(function() {
      explorer.requestPost = sinon.stub();
      explorer.requestPost.onFirstCall().callsArgWith(2, null, {
        statusCode: 200
      });
    });
    it('can receive an address', function(callback) {
      explorer.getUtxos(new Address(address), callback);
    });
    it('can receive a address as a string', function(callback) {
      explorer.getUtxos(address, callback);
    });
    it('can receive an array of addresses', function(callback) {
      explorer.getUtxos([address, new Address(address)], callback);
    });
    it('errors if server is not available', function(callback) {
      explorer.requestPost.onFirstCall().callsArgWith(2, 'Unable to connect');
      explorer.getUtxos(address, function(error) {
        expect(error).to.equal('Unable to connect');
        callback();
      });
    });
    it('errors if server returns errorcode', function(callback) {
      explorer.requestPost.onFirstCall().callsArgWith(2, null, {
        statusCode: 400
      });
      explorer.getUtxos(address, function(error) {
        expect(error).to.deep.equal({
          statusCode: 400
        });
        callback();
      });
    });
    it('errors if server returns invalid data', function(callback) {
      var invalidUtxo = {
        address: '2MvQs7cJe49fbukkTLwhSYnV3hSXe6Bu8tb',
        txid: '7d1eea0c7bed061a6ce1b49d57ef385621766e765bc3ed48bde04d816a4c3ea8',
        vout: 1,
        ts: 1428103500,
        amount: 0.000198,
        confirmations: 6,
        confirmationsFromCache: true
      };
      explorer.requestPost.onFirstCall().callsArgWith(2, null, {
        statusCode: 200
      }, [invalidUtxo]);
      explorer.getUtxos(address, function(error, unspent) {
        expect(error).to.exist;
        expect(error.name).to.equal('ows.ErrorInvalidArgument');
        expect(error.toString()).to.contain('scriptPubKey');
        callback();
      });
    });
  });

  describe('broadcasting a transaction', function() {
    var explorer = new Explorer();
    beforeEach(function() {
      explorer.requestPost = sinon.stub();
      explorer.requestPost.onFirstCall().callsArgWith(2, null, {
        statusCode: 200
      });
    });
    it('accepts a raw transaction', function(callback) {
      explorer.broadcast(rawTx, callback);
    });
    it('accepts a transaction model', function(callback) {
      var tx = new Transaction()
        .from({
          "txid": "e42447187db5a29d6db161661e4bc66d61c3e499690fe5ea47f87b79ca573986",
          "vout": 1,
          "address": "mgBCJAsvzgT2qNNeXsoECg2uPKrUsZ76up",
          "scriptPubKey": "76a914073b7eae2823efa349e3b9155b8a735526463a0f88ac",
          "amount": 0.01080000
        })
        .to("mn9new5vPYWuVN5m3gUBujfKh1uPQvR9mf", 500000)
        .change("mw5ctwgEaNRbxkM4JhXH3rp5AyGvTWDZCD")
        .sign("cSQUuwwJBAg6tYQhzqqLWW115D1s5KFZDyhCF2ffrnukZxMK6rNZ");
      explorer.broadcast(tx, callback);
    });
    it('errors if server is not available', function(callback) {
      explorer.requestPost.onFirstCall().callsArgWith(2, 'Unable to connect');
      explorer.broadcast(rawTx, function(error) {
        expect(error).to.equal('Unable to connect');
        callback();
      });
    });
    it('errors if server returns errorcode', function(callback) {
      explorer.requestPost.onFirstCall().callsArgWith(2, null, {
        statusCode: 400
      }, 'error');
      explorer.broadcast(rawTx, function(error) {
        expect(error).to.equal('error');
        callback();
      });
    });
  });
  describe('requestPost', function() {
    var explorer = new Explorer();
    explorer.request = sinon.stub();
    explorer.request.onFirstCall().callsArgWith(1);
    it('works', function(cb) {
      explorer.requestPost('some/path', {}, cb);
    });
  });

  describe('get information about an address', function() {
    var explorer = new Explorer();
    var data = require('./models/sampleAddressFromExplorer.json');
    beforeEach(function() {
      explorer.requestGet = sinon.stub();
      explorer.requestGet.onFirstCall().callsArgWith(1, null, {
        statusCode: 200
      }, JSON.stringify(data));
    });
    it('makes the request as expected', function(cb) {
      explorer.address('mmvP3mTe53qxHdPqXEvdu8WdC7GfQ2vmx5', function(err, addressInfo) {
        (addressInfo instanceof AddressInfo).should.equal(true);
        cb();
      });
    });
    it('calls with error on parse error', function(cb) {
      explorer.requestGet.onFirstCall().callsArgWith(1, null, {
        statusCode: 200
      }, 'malformed json');
      explorer.address('mmvP3mTe53qxHdPqXEvdu8WdC7GfQ2vmx5', function(err) {
        should.exist(err);
        err.toString().should.contain('SyntaxError');
        cb();
      });
    });
  });
});

var rawTx = '01000000015884e5db9de218238671572340b207ee85b628074e7e467096c267266baf77a4000000006a473044022013fa3089327b50263029265572ae1b022a91d10ac80eb4f32f291c914533670b02200d8a5ed5f62634a7e1a0dc9188a3cc460a986267ae4d58faf50c79105431327501210223078d2942df62c45621d209fab84ea9a7a23346201b7727b9b45a29c4e76f5effffffff0150690f00000000001976a9147821c0a3768aa9d1a37e16cf76002aef5373f1a888ac00000000';
