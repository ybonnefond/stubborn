## [7.1.1](https://github.com/ybonnefond/stubborn/compare/v7.1.0...v7.1.1) (2024-10-23)


### Bug Fixes

* output of log diff show route and path ([1606f9c](https://github.com/ybonnefond/stubborn/commit/1606f9c098621892b70b56e7c9e03ee184f8c8e8))

# [7.1.0](https://github.com/ybonnefond/stubborn/compare/v7.0.0...v7.1.0) (2024-10-23)


### Features

* output the line of the route on log diff ([7cd4a01](https://github.com/ybonnefond/stubborn/commit/7cd4a016baac16e8c719027a6e051073ef6e5b6b))
* retrun diffs for matched endpoints routes in 501 response ([79594e9](https://github.com/ybonnefond/stubborn/commit/79594e992629488dd10c8396852e4c954e637348))

# [7.0.0](https://github.com/ybonnefond/stubborn/compare/v6.2.0...v7.0.0) (2024-10-22)


### Features

* add support for HEAD methods ([e8f3e78](https://github.com/ybonnefond/stubborn/commit/e8f3e78303951ac93f80cc54c36e2f14fed370c2))
* add support for options ([d452bf9](https://github.com/ybonnefond/stubborn/commit/d452bf93589bacc80d0d1633b72cbc3836a4ad3a))
* move to node 20 ([346ce4c](https://github.com/ybonnefond/stubborn/commit/346ce4c587d8028410700b2317233e81b66efeef))
* pass subject in DiffError ([2a096e1](https://github.com/ybonnefond/stubborn/commit/2a096e1f9ebf7b24970ccfef9cb4ed183877d24b))
* show file line when logDiffOn501 called on a mathcing route ([3814881](https://github.com/ybonnefond/stubborn/commit/3814881dd63e8a7c344e9a634d6255d9e5939a56))
* show warn when log diff called and route matched ([8c9ed84](https://github.com/ybonnefond/stubborn/commit/8c9ed84faba12632f5496574e89f02682928fc5d))


### BREAKING CHANGES

* remove support for node 18 & 19

# [6.2.0](https://github.com/ybonnefond/stubborn/compare/v6.1.0...v6.2.0) (2023-03-16)


### Features

* automatic remove route after matching X times ([60b6b39](https://github.com/ybonnefond/stubborn/commit/60b6b399f87558f0932bb047e94a1b19e70fe722))

# [6.1.0](https://github.com/ybonnefond/stubborn/compare/v6.0.0...v6.1.0) (2023-03-08)


### Features

* support multipart/form-data content type ([cea8793](https://github.com/ybonnefond/stubborn/commit/cea879317860d90da37f977cf912c5de62e9970b))

# [6.0.0](https://github.com/ybonnefond/stubborn/compare/v5.5.0...v6.0.0) (2023-03-06)


### Bug Fixes

* remove max event listener warning ([faa6a7e](https://github.com/ybonnefond/stubborn/commit/faa6a7ed9dc45b87d4aed888e24c78fa62828fae))


### chore

* update dependencies ([0f8ad66](https://github.com/ybonnefond/stubborn/commit/0f8ad66f03991a96415fcbb100f4a3cca5263112))


### Features

* drop support for node < LTS ([3903fb0](https://github.com/ybonnefond/stubborn/commit/3903fb066aa73a22684a5c12fa93a00fb496166f))


### BREAKING CHANGES

* CHANGE
node 12.x, 13.x, 14.x, 15.x are no longer supported
Only version >= to latest LTS are now supported
* CHANGE
Drop support for node 10.x and 11.x

If you are not using node 10 or 11 you can upgrade
from 5.x to 6.x eyes closed 😘

# [5.5.0](https://github.com/ybonnefond/stubborn/compare/v5.4.0...v5.5.0) (2021-10-06)


### Features

* support AWS JSON 1.0 and 1.1 content-types ([1811453](https://github.com/ybonnefond/stubborn/commit/18114532d53ad4203f58435739311211600b7fda))

# [5.4.0](https://github.com/ybonnefond/stubborn/compare/v5.3.14...v5.4.0) (2021-09-21)


### Features

* support buffer as response body ([17368e6](https://github.com/ybonnefond/stubborn/commit/17368e65d36a5dd29dca43280e1488cf023f8d4e))

## [5.3.14](https://github.com/ybonnefond/stubborn/compare/v5.3.13...v5.3.14) (2021-08-03)


### Automatic Dependencies Upgrade

* [security] bump tar from 4.4.13 to 4.4.15 ([7522554](https://github.com/ybonnefond/stubborn/commit/75225543096a9fcdc348e3c39fcf6c4e490ffc65))

## [5.3.13](https://github.com/ybonnefond/stubborn/compare/v5.3.12...v5.3.13) (2021-07-30)


### Automatic Dependencies Upgrade

* bump chalk from 4.1.1 to 4.1.2 ([1dfd2d6](https://github.com/ybonnefond/stubborn/commit/1dfd2d607271ab232612bebea6aa42cc678c231f))

## [5.3.12](https://github.com/ybonnefond/stubborn/compare/v5.3.11...v5.3.12) (2021-06-14)


### Automatic Dependencies Upgrade

* [security] bump normalize-url from 4.5.0 to 4.5.1 ([341bc30](https://github.com/ybonnefond/stubborn/commit/341bc30267f84cf29f00971e041b145f2665a4e2))

## [5.3.11](https://github.com/ybonnefond/stubborn/compare/v5.3.10...v5.3.11) (2021-06-14)


### Automatic Dependencies Upgrade

* bump chalk from 4.1.0 to 4.1.1 ([b8103b1](https://github.com/ybonnefond/stubborn/commit/b8103b17bb00efb3a014b2ccc941f27e72c9f4f5))

## [5.3.10](https://github.com/ybonnefond/stubborn/compare/v5.3.9...v5.3.10) (2021-06-12)


### Automatic Dependencies Upgrade

* [security] bump handlebars from 4.7.6 to 4.7.7 ([ff51a8f](https://github.com/ybonnefond/stubborn/commit/ff51a8fc31927d66c656fe5e6674ee9531ab0f4d))

## [5.3.9](https://github.com/ybonnefond/stubborn/compare/v5.3.8...v5.3.9) (2021-06-12)


### Automatic Dependencies Upgrade

* [security] bump trim-newlines from 3.0.0 to 3.0.1 ([8824574](https://github.com/ybonnefond/stubborn/commit/8824574e26070f24ae15ed79067fb9fc79cf87bf))

## [5.3.8](https://github.com/ybonnefond/stubborn/compare/v5.3.7...v5.3.8) (2021-06-11)


### Automatic Dependencies Upgrade

* [security] bump y18n from 3.2.1 to 3.2.2 ([b92e576](https://github.com/ybonnefond/stubborn/commit/b92e57651c8aa2f537b1d59b25578c9a8578e806))

## [5.3.7](https://github.com/ybonnefond/stubborn/compare/v5.3.6...v5.3.7) (2021-06-11)


### Automatic Dependencies Upgrade

* [security] bump hosted-git-info from 2.8.8 to 2.8.9 ([828e4f8](https://github.com/ybonnefond/stubborn/commit/828e4f8c58a72e72b078aec5ccad8cc12857c57b))

## [5.3.6](https://github.com/ybonnefond/stubborn/compare/v5.3.5...v5.3.6) (2021-06-11)


### Automatic Dependencies Upgrade

* [security] bump ssri from 6.0.1 to 6.0.2 ([474d3b3](https://github.com/ybonnefond/stubborn/commit/474d3b37a3545e8783895a6652c1b49aac5bcbd9))

## [5.3.5](https://github.com/ybonnefond/stubborn/compare/v5.3.4...v5.3.5) (2021-06-11)


### Bug Fixes

* res.write throwing error if body is null ([d22119e](https://github.com/ybonnefond/stubborn/commit/d22119e4f263ba2f611cc93dc053bf33622264f3))

## [5.3.4](https://github.com/ybonnefond/stubborn/compare/v5.3.3...v5.3.4) (2021-02-20)


### Automatic Dependencies Upgrade

* bump lodash from 4.17.20 to 4.17.21 ([fac4187](https://github.com/ybonnefond/stubborn/commit/fac4187aa1187886b09663e731c9a776f893e29f))

## [5.3.3](https://github.com/ybonnefond/stubborn/compare/v5.3.2...v5.3.3) (2021-02-05)


### Automatic Dependencies Upgrade

* bump @hapi/accept from 5.0.1 to 5.0.2 ([5be48f0](https://github.com/ybonnefond/stubborn/commit/5be48f045a1dec14e60fc64b1f58ff4bf9e0ebaa))

## [5.3.2](https://github.com/ybonnefond/stubborn/compare/v5.3.1...v5.3.2) (2020-12-21)


### Automatic Dependencies Upgrade

* [security] bump node-notifier from 8.0.0 to 8.0.1 ([5ea3da5](https://github.com/ybonnefond/stubborn/commit/5ea3da57318c1fbd90b99ef8bf412c056a1387a2))

## [5.3.1](https://github.com/ybonnefond/stubborn/compare/v5.3.0...v5.3.1) (2020-12-10)


### Automatic Dependencies Upgrade

* [security] bump ini from 1.3.5 to 1.3.7 ([1d45f92](https://github.com/ybonnefond/stubborn/commit/1d45f926ccedd09bc7ff658b011b6409e8cab7a3))

# [5.3.0](https://github.com/ybonnefond/stubborn/compare/v5.2.2...v5.3.0) (2020-11-18)


### Features

* add title with request's method and path on logDiffOn501 ([eba1ebe](https://github.com/ybonnefond/stubborn/commit/eba1ebe8cf7945967137f3c91f20e26058cd31f1))

## [5.2.2](https://github.com/ybonnefond/stubborn/compare/v5.2.1...v5.2.2) (2020-10-17)


### Automatic Dependencies Upgrade

* [security] bump npm-user-validate from 1.0.0 to 1.0.1 ([4f53c32](https://github.com/ybonnefond/stubborn/commit/4f53c32afee19186e22ee8a2a4566b9b7ae06856))

## [5.2.1](https://github.com/ybonnefond/stubborn/compare/v5.2.0...v5.2.1) (2020-09-11)


### Automatic Dependencies Upgrade

* [security] bump node-fetch from 2.6.0 to 2.6.1 ([e065d1a](https://github.com/ybonnefond/stubborn/commit/e065d1a9ca2b0025c7212fa03187a8e784ecb0e4))

# [5.2.0](https://github.com/ybonnefond/stubborn/compare/v5.1.4...v5.2.0) (2020-08-27)


### Features

* allow to remove a route ([9787627](https://github.com/ybonnefond/stubborn/commit/97876270b12222179f8387bbc9fa564288badcb1))

## [5.1.4](https://github.com/ybonnefond/stubborn/compare/v5.1.3...v5.1.4) (2020-08-15)


### Automatic Dependencies Upgrade

* bump lodash from 4.17.19 to 4.17.20 ([43acdba](https://github.com/ybonnefond/stubborn/commit/43acdba7c1f0b8854a87f960aff5afc36900f327))

## [5.1.3](https://github.com/ybonnefond/stubborn/compare/v5.1.2...v5.1.3) (2020-07-08)


### Automatic Dependencies Upgrade

* bump lodash from 4.17.18 to 4.17.19 ([463449c](https://github.com/ybonnefond/stubborn/commit/463449caedbfcbaf8649129cfc273a7d36ee3d0a))

## [5.1.2](https://github.com/ybonnefond/stubborn/compare/v5.1.1...v5.1.2) (2020-07-08)


### Automatic Dependencies Upgrade

* bump lodash from 4.17.15 to 4.17.18 ([0b3c577](https://github.com/ybonnefond/stubborn/commit/0b3c5777986b95bf2d4843ecbe2445747e33e292))

## [5.1.1](https://github.com/ybonnefond/stubborn/compare/v5.1.0...v5.1.1) (2020-07-07)


### Automatic Dependencies Upgrade

* [security] bump npm from 6.14.5 to 6.14.6 ([7df3365](https://github.com/ybonnefond/stubborn/commit/7df3365c15f8ec4bcefd6369ea5527f36eadd7f7))

# [5.1.0](https://github.com/ybonnefond/stubborn/compare/v5.0.4...v5.1.0) (2020-06-26)


### Features

* add logDiffon501 method to route ([003d4ef](https://github.com/ybonnefond/stubborn/commit/003d4efc3ca08d15d29c2b9559bb1ec2be720c47))

## [5.0.4](https://github.com/ybonnefond/stubborn/compare/v5.0.3...v5.0.4) (2020-06-23)


### Bug Fixes

* fix packaged files ([56c446c](https://github.com/ybonnefond/stubborn/commit/56c446c35066cb4b38cbb08d4822cbcbb82c627e))

## [5.0.3](https://github.com/ybonnefond/stubborn/compare/v5.0.2...v5.0.3) (2020-06-23)


### Automatic Dependencies Upgrade

* bump dependencies ([0de24fa](https://github.com/ybonnefond/stubborn/commit/0de24fa95e067337a8bdde932e682849c8b26e73))

## [5.0.2](https://github.com/ybonnefond/stubborn/compare/v5.0.1...v5.0.2) (2020-06-23)


### Automatic Dependencies Upgrade

* bump chalk from 3.0.0 to 4.1.0 ([c40f8a5](https://github.com/ybonnefond/stubborn/commit/c40f8a5cdfb3011a13df997a0f7f5d54be4a12a5))

## [5.0.1](https://github.com/ybonnefond/stubborn/compare/v5.0.0...v5.0.1) (2020-06-23)


### Automatic Dependencies Upgrade

* [security] bump acorn from 5.7.3 to 5.7.4 ([248fdf1](https://github.com/ybonnefond/stubborn/commit/248fdf18ac7352661a139b0e74515f8d4ff91535))
