var assert = require('assert')
var Wallet = require('../')

var fixturekey = new Buffer('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex')
var fixturewallet = Wallet.fromPrivateKey(fixturekey)

describe('.getPrivateKey()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getPrivateKey().toString('hex'), 'efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378')
  })
})

describe('.getPrivateKeyString()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getPrivateKeyString(), '0xefca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378')
  })
})

describe('.getPublicKey()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getPublicKey().toString('hex'), '5d4392f450262b276652c1fc037606abac500f3160830ce9df53aa70d95ce7cfb8b06010b2f3691c78c65c21eb4cf3dfdbfc0745d89b664ee10435bb3a0f906c')
  })
})

describe('.getPublicKeyString()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getPublicKeyString(), '0x5d4392f450262b276652c1fc037606abac500f3160830ce9df53aa70d95ce7cfb8b06010b2f3691c78c65c21eb4cf3dfdbfc0745d89b664ee10435bb3a0f906c')
  })
})

describe('.getAddress()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getAddress().toString('hex'), 'b14ab53e38da1c172f877dbc6d65e4a1b0474c3c')
  })
})

describe('.getAddressString()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getAddressString(), '0xb14ab53e38da1c172f877dbc6d65e4a1b0474c3c')
  })
})

describe('.getChecksumAddressString()', function () {
  it('should work', function () {
    assert.equal(fixturewallet.getChecksumAddressString(), '0xB14Ab53E38DA1C172f877DBC6d65e4a1B0474C3c')
  })
})

describe('.generate()', function () {
  it('should generate an account', function () {
    assert.equal(Wallet.generate().getPrivateKey().length, 32)
  })
  it('should generate an account compatible with ICAP Direct', function () {
    var wallet = Wallet.generate(true)
    assert.equal(wallet.getPrivateKey().length, 32)
    assert.equal(wallet.getAddress()[0], 0)
  })
})

describe('.toV3()', function () {
  var salt = new Buffer('dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6', 'hex')
  var iv = new Buffer('cecacd85e9cb89788b5aab2f93361233', 'hex')
  var uuid = new Buffer('7e59dc028d42d09db29aa8a0f862cc81', 'hex')

  it('should work with PBKDF2', function () {
    var key = new Buffer('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex')
    var wallet = Wallet.fromPrivateKey(key)
    var w = '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"b14ab53e38da1c172f877dbc6d65e4a1b0474c3c","Crypto":{"ciphertext":"01ee7f1a3c8d187ea244c92eea9e332ab0bb2b4c902d89bdd71f80dc384da1be","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","c":262144,"prf":"hmac-sha256"},"mac":"0c02cd0badfebd5e783e0cf41448f84086a96365fc3456716c33641a86ebc7cc"}}'
    // FIXME: just test for ciphertext and mac?
    assert.equal(wallet.toV3String('testtest', { kdf: 'pbkdf2', uuid: uuid, salt: salt, iv: iv }), w)
  })
  it('should work with Scrypt', function () {
    var key = new Buffer('efca4cdd31923b50f4214af5d2ae10e7ac45a5019e9431cc195482d707485378', 'hex')
    var wallet = Wallet.fromPrivateKey(key)
    var w = '{"version":3,"id":"7e59dc02-8d42-409d-b29a-a8a0f862cc81","address":"b14ab53e38da1c172f877dbc6d65e4a1b0474c3c","Crypto":{"ciphertext":"c52682025b1e5d5c06b816791921dbf439afe7a053abb9fac19f38a57499652c","cipherparams":{"iv":"cecacd85e9cb89788b5aab2f93361233"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"dc9e4a98886738bd8aae134a1f89aaa5a502c3fbd10e336136d4d5fe47448ad6","n":262144,"r":8,"p":1},"mac":"27b98c8676dc6619d077453b38db645a4c7c17a3e686ee5adaf53c11ac1b890e"}}'
    this.timeout(180000) // 3minutes
    // FIXME: just test for ciphertext and mac?
    assert.equal(wallet.toV3String('testtest', { kdf: 'scrypt', uuid: uuid, salt: salt, iv: iv }), w)
  })
})

/*
describe('.fromV1()', function () {
  it('should work', function () {
    var sample = '{"Address":"d4584b5f6229b7be90727b0fc8c6b91bb427821f","Crypto":{"CipherText":"07533e172414bfa50e99dba4a0ce603f654ebfa1ff46277c3e0c577fdc87f6bb4e4fe16c5a94ce6ce14cfa069821ef9b","IV":"16d67ba0ce5a339ff2f07951253e6ba8","KeyHeader":{"Kdf":"scrypt","KdfParams":{"DkLen":32,"N":262144,"P":1,"R":8,"SaltLen":32},"Version":"1"},"MAC":"8ccded24da2e99a11d48cda146f9cc8213eb423e2ea0d8427f41c3be414424dd","Salt":"06870e5e6a24e183a5c807bd1c43afd86d573f7db303ff4853d135cd0fd3fe91"},"Id":"0498f19a-59db-4d54-ac95-33901b4f1870","Version":"1"}'
    var wallet = Wallet.fromV1(sample, 'foo')
    assert.equal(wallet.getAddressString(), '0xd4584b5f6229b7be90727b0fc8c6b91bb427821f')
  })
})
*/

describe('.fromV3()', function () {
  it('should work with PBKDF2', function () {
    var w = '{"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"6087dab2f9fdbbfaddc31a909735c1e6"},"ciphertext":"5318b4d5bcd28de64ee5559e671353e16f075ecae9f99c7a79a38af5f869aa46","kdf":"pbkdf2","kdfparams":{"c":262144,"dklen":32,"prf":"hmac-sha256","salt":"ae3cd4e7013836a3df6bd7241b12db061dbe2c6785853cce422d148a624ce0bd"},"mac":"517ead924a9d0dc3124507e3393d175ce3ff7c1e96529c6c555ce9e51205e9b2"},"id":"3198bc9c-6672-5ab3-d995-4942343ae5b6","version":3}'
    var wallet = Wallet.fromV3(w, 'testpassword')
    assert.equal(wallet.getAddressString(), '0x008aeeda4d805471df9b2a5b0f38a0c3bcba786b')
  })
  it('should work with Scrypt', function () {
    var sample = '{"address":"2f91eb73a6cd5620d7abb50889f24eea7a6a4feb","Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"a2bc4f71e8445d64ceebd1247079fbd8"},"ciphertext":"6b9ab7954c9066fa1e54e04e2c527c7d78a77611d5f84fede1bd61ab13c51e3e","kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"r":1,"p":8,"salt":"caf551e2b7ec12d93007e528093697a4c68e8a50e663b2a929754a8085d9ede4"},"mac":"506cace9c5c32544d39558025cb3bf23ed94ba2626e5338c82e50726917e1a15"},"id":"1b3cad9b-fa7b-4817-9022-d5e598eb5fe3","version":3}'
    var wallet = Wallet.fromV3(sample, 'testtest')
    this.timeout(180000) // 3minutes
    assert.equal(wallet.getAddressString(), '0x2f91eb73a6cd5620d7abb50889f24eea7a6a4feb')
  })
  it('should work with \'unencrypted\' wallets', function () {
    var w = '{"address":"a9886ac7489ecbcbd79268a79ef00d940e5fe1f2","Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"c542cf883299b5b0a29155091054028d"},"ciphertext":"0a83c77235840cffcfcc5afe5908f2d7f89d7d54c4a796dfe2f193e90413ee9d","kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"r":1,"p":8,"salt":"699f7bf5f6985068dfaaff9db3b06aea8fe3dd3140b3addb4e60620ee97a0316"},"mac":"613fed2605240a2ff08b8d93ccc48c5b3d5023b7088189515d70df41d65f44de"},"id":"0edf817a-ee0e-4e25-8314-1f9e88a60811","version":3}'
    var wallet = Wallet.fromV3(w, '')
    this.timeout(180000) // 3minutes
    assert.equal(wallet.getAddressString(), '0xa9886ac7489ecbcbd79268a79ef00d940e5fe1f2')
  })
})

describe('.fromEthSale()', function () {
  // Generated using https://github.com/ethereum/pyethsaletool/ [4afd19ad60cee8d09b645555180bc3a7c8a25b67]
  var json = '{"encseed": "81ffdfaf2736310ce87df268b53169783e8420b98f3405fb9364b96ac0feebfb62f4cf31e0d25f1ded61f083514dd98c3ce1a14a24d7618fd513b6d97044725c7d2e08a7d9c2061f2c8a05af01f06755c252f04cab20fee2a4778130440a9344", "ethaddr": "22f8c5dd4a0a9d59d580667868df2da9592ab292", "email": "hello@ethereum.org", "btcaddr": "1DHW32MFwHxU2nk2SLAQq55eqFotT9jWcq"}'
  it('should work', function () {
    var wallet = Wallet.fromEthSale(json, 'testtest')
    assert.equal(wallet.getAddressString(), '0x22f8c5dd4a0a9d59d580667868df2da9592ab292')
  })
})

describe('.fromEtherWallet()', function () {
  it('should work with unencrypted input', function () {
    var etherWalletUnencrypted = '{"address":"0x9d6abd11d36cc20d4836c25967f1d9efe6b1a27c","encrypted":true,"locked":false,"hash":"b7a6621e8b125a17234d3e5c35522696a84134d98d07eab2479d020a8613c4bd","private":"a2c6222146ca2269086351fda9f8d2dfc8a50331e8a05f0f400c13653a521862","public":"2ed129b50b1a4dbbc53346bf711df6893265ad0c700fd11431b0bc3a66bd383a87b10ad835804a6cbe092e0375a0cc3524acf06b1ec7bb978bf25d2d6c35d120"}'
    var wallet = Wallet.fromEtherWallet(etherWalletUnencrypted)
    assert.equal(wallet.getAddressString(), '0x9d6abd11d36cc20d4836c25967f1d9efe6b1a27c')
  })
  it('should work with encrypted input', function () {
    var etherWalletEncrypted = '{"address":"0x9d6abd11d36cc20d4836c25967f1d9efe6b1a27c","encrypted":true,"locked":true,"hash":"b7a6621e8b125a17234d3e5c35522696a84134d98d07eab2479d020a8613c4bd","private":"U2FsdGVkX1/hGPYlTZYGhzdwvtkoZfkeII4Ga4pSd/Ak373ORnwZE4nf/FFZZFcDTSH1X1+AmewadrW7dqvwr76QMYQVlihpPaFV307hWgKckkG0Mf/X4gJIQQbDPiKdcff9","public":"U2FsdGVkX1/awUDAekZQbEiXx2ct4ugXwgBllY0Hz+IwYkHiEhhxH+obu7AF7PCU2Vq5c0lpCzBUSvk2EvFyt46bw1OYIijw0iOr7fWMJEkz3bfN5mt9pYJIiPzN0gxM8u4mrmqLPUG2SkoZhWz4NOlqRUHZq7Ep6aWKz7KlEpzP9IrvDYwGubci4h+9wsspqtY1BdUJUN59EaWZSuOw1g=="}'
    var wallet = Wallet.fromEtherWallet(etherWalletEncrypted, 'testtest')
    assert.equal(wallet.getAddressString(), '0x9d6abd11d36cc20d4836c25967f1d9efe6b1a27c')
  })
})

describe('.fromEtherCamp()', function () {
  it('should work with seed text', function () {
    var wallet = Wallet.fromEtherCamp('ethercamp123')
    assert.equal(wallet.getAddressString(), '0x182b6ca390224c455f11b6337d74119305014ed4')
  })
})

describe('.fromKryptoKit()', function () {
  it('should work with basic input (d-type)', function () {
    var wallet = Wallet.fromKryptoKit('dBWfH8QZSGbg1sAYHLBhqE5R8VGAoM7')
    assert.equal(wallet.getAddressString(), '0x3611981ad2d6fc1d7579d6ce4c6bc37e272c369c')
  })
  it('should work with encrypted input (q-type)', function () {
    var wallet = Wallet.fromKryptoKit('qhah1VeT0RgTvff1UKrUrxtFViiQuki16dd353d59888c25', 'testtest')
    assert.equal(wallet.getAddressString(), '0x3c753e27834db67329d1ec1fab67970ec1e27112')
  })
})