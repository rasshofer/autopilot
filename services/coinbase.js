const coinbase = require('coinbase');
const leprechaun = require('leprechaun');
const roundTo = require('round-to');

module.exports = (config) => {

  const client = new coinbase.Client({
    apiKey: config.coinbase_api_key,
    apiSecret: config.coinbase_api_secret
  });

  leprechaun.info(`Using ${config.currency.toUpperCase()} as currency`);
  leprechaun.info(`Using »${config.strategy === 'amount' ? 'amount' : 'total'}« as pricing strategy`);

  client.getAccounts({}, (err, accounts) => {

    if (err) {
      leprechaun.error('Error while fetching accounts');
      leprechaun.error(err);
      process.exit(1);
    }

    leprechaun.info(`Fetched ${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}`);

    client.getPaymentMethods({}, (err, paymentMethods) => {

      if (err) {
        leprechaun.error('Error while fetching payment methods');
        leprechaun.error(err);
        process.exit(1);
      }

      leprechaun.info(`Fetched ${paymentMethods.length} payment ${paymentMethods.length === 1 ? 'method' : 'methods'}`);

      const wallet = paymentMethods.find((paymentMethod) => paymentMethod.type === 'fiat_account' && paymentMethod.currency.toLowerCase() === config.currency.toLowerCase());

      if (!wallet) {
        leprechaun.error(`Error while fetching your ${config.currency.toUpperCase()} wallet for payment`);
        process.exit(1);
      }

      leprechaun.info(`Using »${wallet.name}« for payments`);

      [
        'btc',
        'eth',
        'ltc'
      ].forEach((currency) => {

        if (config[currency] && config[currency] > 0) {

          const amount = parseFloat(config[currency], 10);
          const account = accounts.find((account) => account.currency.toLowerCase() === currency);

          client.getBuyPrice({
            currencyPair: `${currency}-${config.currency}`.toUpperCase()
          }, (err, obj) => {

            if (err) {
              leprechaun.error(`Error while fetching buy prices for ${currency.toUpperCase()}`);
              leprechaun.error(err);
              process.exit(1);
            }

            const price = parseFloat(obj.data.amount, 10);
            const buy = roundTo(amount / price, 8);

            if (!price) {
              leprechaun.error(`Invalid price data for ${currency.toUpperCase()}`);
              leprechaun.error(stats);
              process.exit(1);
            }

            leprechaun.info(`Buy price for ${currency.toUpperCase()} is ${price} ${config.currency.toUpperCase()}`);

            const props = {
              currency: currency.toUpperCase(),
              payment_method: wallet.id
            };

            props[config.strategy === 'amount' ? 'amount' : 'total'] = buy;

            account.buy(props, (err, details) => {

              if (err) {
                leprechaun.error(`Error while buying ${buy} ${currency.toUpperCase()}`);
                leprechaun.error(err);
                process.exit(1);
              }

              leprechaun.success(`Bought ${details.amount.amount} ${details.amount.currency} (= ${details.subtotal.amount} ${details.subtotal.currency}) onto »${account.name}« (= ${details.total.amount} ${details.total.currency} in total incl. fees)`);

            });

          });

        }

      });

    });

  });

};
