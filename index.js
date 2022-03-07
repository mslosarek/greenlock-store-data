const DataLayer = require('@slosarek/greenlock-data-layer');
const store = {
  options: {},
  accounts: {},
  certificates: {},
};

module.exports.create = (opts = {}) => {
  console.log({ source: 'store', opts });

  const data = DataLayer(opts);
  store._data = data;

  store.accounts.setKeypair = async (opts) => {
    console.log('accounts.setKeypair:', opts.account, opts.email);
    console.log(opts.keypair);

    const id = (opts.account || {}).id || opts.email || 'default';
    const keypair = opts.keypair;

    return data.write('keypairs', id, keypair);
  };

  // We need a way to retrieve a prior account's keypair for renewals and additional ACME certificate "orders"
  store.accounts.checkKeypair = async (opts) => {
    console.log('accounts.checkKeypair:', opts.account, opts.email);

    const id = (opts.account || {}).id || opts.email || 'default';
    const keyblob = await data.read('keypairs', id);

    return keyblob || null;
  };

  store.accounts.set = async (opts) => {
    const id = (opts.account || {}).id || opts.email || 'default';
    return data.write('accounts', id, opts);
  };

  store.accounts.check = async (opts) => {
    const id = (opts.account || {}).id || opts.email || 'default';
    const keyblob = await data.read('accounts', id);

    return keyblob || null;
  };

  store.certificates.setKeypair = async (opts) => {
    console.log('certificates.setKeypair:', opts.certificate, opts.subject);
    console.log(opts.keypair);

    const id =
      (opts.certificate || {}).kid ||
      (opts.certificate || {}).id ||
      opts.subject;
    const keypair = opts.keypair;

    return data.write('keypairs', id, keypair);
  };

  store.certificates.checkKeypair = async (opts) => {
    console.log('certificates.checkKeypair:', opts);

    const id =
      (opts.certificate || {}).kid ||
      (opts.certificate || {}).id ||
      opts.subject;
    let keyblob = await data.read('keypairs', id);

    return keyblob || null;
  };

  store.certificates.set = async (opts) => {
    console.log('certificates.set:', opts.certificate, opts.subject);

    const id = (opts.certificate || {}).id || opts.subject;
    const pems = opts.pems;
    return data.write('certificates', id, pems);
  };

  store.certificates.check = async (opts) => {
    console.log('certificates.check:', opts.certificate, opts.subject);

    const id = (opts.certificate || {}).id || opts.subject;
    const certblob = await data.read('certificates', id);
    return certblob;
  };

  return store;
};
