#!/usr/bin/env node

const path = require('path');
const nconf = require('nconf');
const leprechaun = require('leprechaun');

const coinbase = require('./services/coinbase');
const gdax = require('./services/gdax');

nconf.argv().env().file({
  file: path.resolve(process.cwd(), 'autopilot.json')
}).defaults({
  currency: 'EUR'
});

const config = nconf.get();

if (config.gdax_api_key) {
  leprechaun.info('Using GDAX');
  gdax(config);
} else if (config.coinbase_api_key) {
  leprechaun.info('Using Coinbase');
  coinbase(config);
} else {
  leprechaun.error('Invalid/Missing credentials');
  process.exit(1);
}
