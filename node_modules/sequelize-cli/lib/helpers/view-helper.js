'use strict';

var _cliColor = require('cli-color');

var _cliColor2 = _interopRequireDefault(_cliColor);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  teaser() {
    var versions = ['Node: ' + _index2.default.version.getNodeVersion(), 'CLI: ' + _index2.default.version.getCliVersion(), 'ORM: ' + _index2.default.version.getOrmVersion()];

    this.log();
    this.log(_cliColor2.default.underline('Sequelize CLI [' + versions.join(', ') + ']'));
    this.log();

    // Remove in v4
    if (_index2.default.version.getOrmVersion().match(/^4./)) {
      this.log(_cliColor2.default.yellow('WARNING: This version of Sequelize CLI is not ' + 'fully compatible with Sequelize v4. ' + 'https://github.com/sequelize/cli#sequelize-support'));
      this.log();
    }
  },

  log: console.log,
  error: console.error,

  pad(s, smth) {
    var margin = smth;

    if (_lodash2.default.isObject(margin)) {
      margin = Object.keys(margin);
    }

    if (Array.isArray(margin)) {
      margin = Math.max.apply(null, margin.map(function (o) {
        return o.length;
      }));
    }

    return s + new Array(margin - s.length + 1).join(' ');
  }
};