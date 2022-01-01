const log4js = require('log4js');
const log4js_configure = require('../log4js.json');
log4js.configure(log4js_configure);

export const log = log4js.getLogger('app');
