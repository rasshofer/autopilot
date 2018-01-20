# Autopilot

> A simple (CLI) tool to »Cost Average«-buy Bitcoin, Litecoin, and/or Ethereum using Coinbase or GDAX

Cost averaging is a common investment technique of buying a fixed amount of a particular investment (e.g. cryptocurrencies) on a regular schedule, regardless of the share price. Hence one purchases more shares when prices are low and fewer shares when prices are high. This way one is able to compensate for exchange rate fluctuations.

Autopilot is supposed to be configured as a cronjob that is executed once per day/week/month.

<img src="https://cdn.rawgit.com/rasshofer/autopilot/master/screenshot.png" alt="Autopilot" width="675" height="327">

## CLI

```shell
npm install -g autopilot
```

```shell
$ autopilot {OPTIONS}
```

## Configuration

Autopilot is configured using the following options via a configuration file, environment variables, and/or command-line arguments.

First of all, Autopilot looks for a JSON file called `autopilot.json` within the current working directory.

```json
{
  "coinbase_api_key": "NlpFapHtwkqyOfg",
  "coinbase_api_secret": "bchx51JunqVeEH2LG2li7iKDWMj1lrVo",
  "btc": "10"
}
```

Afterwards, Autopilot will take environment variables into account.

```shell
coinbase_api_key=Ffs0PvsT9OSgDs3 coinbase_api_secret=SuOMOn7GMjcetdamzD2OWqAN8DQex0nB btc=12 eth=34 ltc=56 autopilot
```

Concluding, Autopilot will take command-line arguments into account.

```shell
autopilot --coinbase_api_key=Ffs0PvsT9OSgDs3 --coinbase_api_secret=SuOMOn7GMjcetdamzD2OWqAN8DQex0nB --btc=12 --eth=34 --ltc=56
```

(All options are merged into a single configuration using the hierarchy described above.)

## Options

### Coinbase account

In order to use Autopilot, you need to create a new API key for your Coinbase account. To do so, head over to [https://www.coinbase.com/settings/api](https://www.coinbase.com/settings/api) and create a new key. Autopilot needs the following permissions in order to perform buys for you.

- `wallet:accounts:read`
- `wallet:buys:create`
- `wallet:payment-methods:read`

Make sure you granted all of these permissions for the API key.

#### `coinbase_api_key`

Your Coinbase API key. 15 characters long.

Example: `NlpFapHtwkqyOfg`

#### `coinbase_api_secret`

Your Coinbase API secret. 32 characters long.

Example: `bchx51JunqVeEH2LG2li7iKDWMj1lrVo`

### GDAX account

Besides Coinbase you’re also able to buy coins using GDAX. In order to use Autopilot with GDAX, you need to create a new API key for your GDAX account. To do so, head over to [https://www.gdax.com/settings/api](https://www.gdax.com/settings/api) and create a new key. Autopilot needs the following permissions in order to perform buys for you.

- `View`
- `Trade`

Make sure you granted all of these permissions for the API key.

#### `gdax_api_key`

Your GDAX API key. 32 characters long.

Example: `1ab05e21dc847c87970130229b61a987`

#### `gdax_api_secret`

Your GDAX API secret.

Example: `AwtyoyLzp3MyDGxuJvj2nGSTWR1mBHMDIxybMH1YqJcsYwOaDIH6JQxbDGLdFmWIKl0bDwcaHJ56JRVaM2gsYD==`

#### `gdax_api_passphrase`

Your GDAX API passphrase. 11 characters long.

Example: `johxudf2va4`

### Purchases

Now that Autopilot is able to perform buys for you, you need to specify what kind of buys you want to be performed.

#### `strategy`

The strategy used when buying. Choose `total` in case your specified amount is supposed to be bought including any Coinbase fees (= contained) or choose `amount` in case the specified amount is supposed to be bought excluding any Coinbase fees (= charged supplementary).

Default: `total`

#### `currency`

The base currency used for buying cryptocurrencies. As of now, Autopilot is not able to handle credit card payments or SEPA bank accounts (due to security restrictions), thus it will always use the FIAT account/wallet matching your base currency.

Example: `USD`

Default: `EUR`

#### `btc`

Amount of your base currency to buy Bitcoin for.

Example: `12.34`

Default: `0`

#### `eth`

Amount of your base currency to buy Ethereum for.

Example: `13.37`

Default: `0`

#### `ltc`

Amount of your base currency to buy Litecoin for.

Example: `0.50`

Default: `0`

## Changelog

* 0.0.9
  * Add disclaimer
* 0.0.8
  * Include intended amount of coins within order error logs
  * Implement support for failing GDAX orders due to undershot minimum sizes
* 0.0.7
  * Implement early exits in case exchange APIs are returning invalid price data
  * Fix typo within balance error message
* 0.0.6
  * Rename to »Autopilot«
* 0.0.5
  * Fix README
* 0.0.4
  * Implement support for GDAX
* 0.0.3
  * Remove unused import
* 0.0.2
  * Fix screenshot within README
* 0.0.1
  * Initial version

## Disclaimer

You use Autopilot at your own risk. I would only recommend trying out Autopilot with small amounts you are willing to lose for educational purposes. Running a bot (and trading in general) requires careful study of the risks and parameters. Wrong settings can cause a major loss. Autopilot relies on 3rd party APIs which may fail at any time and is experimental software which also may fail at any time. Thus never leave Autopilot un-monitored for long periods of time. Be prepared to stop it if too much loss occurs. You alone are responsible for anything that happens when you’re live-trading.

## License

Copyright (c) 2018 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.
