const gdax = require('gdax');
const leprechaun = require('leprechaun');
const roundTo = require('round-to');

module.exports = (config) => {

  const apiURI = 'https://api.gdax.com';
  const sandboxURI = 'https://api-public.sandbox.gdax.com';
  const currencies = [
    'btc',
    'eth',
    'ltc'
  ].filter((currency) => (config[currency] && config[currency] > 0));

  const client = new gdax.AuthenticatedClient(config.gdax_api_key, config.gdax_api_secret, config.gdax_api_passphrase, apiURI);

  leprechaun.info(`Using ${config.currency.toUpperCase()} as currency`);

  client.getAccounts((err, response, accounts) => {

    if (err) {
      leprechaun.error('Error while fetching accounts');
      leprechaun.error(err);
      process.exit(1);
    }

    leprechaun.info(`Fetched ${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}`);

    const wallet = accounts.find((account) => account.currency.toLowerCase() === config.currency.toLowerCase());

    if (!wallet) {
      leprechaun.error(`Error while fetching your ${config.currency.toUpperCase()} wallet for payment`);
      process.exit(1);
    }

    const balance = parseFloat(wallet.balance, 10);
    const total = currencies.reduce((sum, currency) => sum + parseFloat(config[currency], 10), 0);

    leprechaun.info(`Using »${wallet.id}« for payments`);
    leprechaun.info(`Current balance: ${roundTo(balance, 2)} ${wallet.currency.toUpperCase()}`);

    if (total > balance) {
      leprechaun.warning(`Current balance deceeds scheduled total (= ${roundTo(total, 2)} ${wallet.currency.toUpperCase()})`);
    }

    currencies.forEach((currency) => {

      const amount = parseFloat(config[currency], 10);
      const publicClient = new gdax.PublicClient(`${currency.toUpperCase()}-${config.currency.toUpperCase()}`, apiURI);

      publicClient.getProduct24HrStats((err, response, stats) => {

        if (err) {
          leprechaun.error(`Error while fetching buy prices for ${currency.toUpperCase()}`);
          leprechaun.error(err);
          process.exit(1);
        }

        const price = parseFloat(stats.last, 10);
        const buy = roundTo(amount / price, 8);

        if (!price) {
          leprechaun.error(`Invalid price data for ${currency.toUpperCase()}`);
          leprechaun.error(stats);
          process.exit(1);
        }

        leprechaun.info(`Buy price for ${currency.toUpperCase()} is ${price} ${config.currency.toUpperCase()}`);

        const props = {
          price: price,
          size: buy,
          product_id: `${currency.toUpperCase()}-${config.currency.toUpperCase()}`
        };

        client.buy(props, (err, response, order) => {

          if (err || order.message) {
            leprechaun.error(`Error while buying ${buy} ${currency.toUpperCase()}`);
            leprechaun.error(err || order.message);
            process.exit(1);
          }

          leprechaun.success(`Placed buy order for ${order.size} ${currency.toUpperCase()} (= ${(order.size * order.price)} ${config.currency.toUpperCase()})`);

        });

      });

    });

  });

};
