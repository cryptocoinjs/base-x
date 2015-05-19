# bs*

[![TRAVIS](https://secure.travis-ci.org/dcousens/bs\*.png)](http://travis-ci.org/dcousens/bs\*)
[![NPM](http://img.shields.io/npm/v/bs\*.svg)](https://www.npmjs.org/package/bs\*)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)


## Example

``` javascript
var bs58 = require('bs*')('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz')

var decoded = bs58.decode('5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr')

console.log(decoded)
// => <Buffer 80 ed db dc 11 68 f1 da ea db d3 e4 4c 1e 3f 8f 5a 28 4c 20 29 f7 8a d2 6a f9 85 83 a4 99 de 5b 19>

console.log(bs58.encode(decoded))
// => 5Kd3NBUAdUnhyzenEwVLy9pBKxSwXvE9FMPyR4UKZvpe6E3AgLr
```


## License

This library is free and open-source software released under the MIT license.

