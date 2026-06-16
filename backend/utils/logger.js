const morgan = require('morgan');

/**
 * HTTP request logger using morgan
 * dev mode: colored output with method, URL, status, response time
 */
const httpLogger = morgan('dev');

/**
 * Simple console error logger utility
 */
const logError = (err, req) => {
  const timestamp = new Date().toISOString();
  const method = req?.method || 'UNKNOWN';
  const url = req?.originalUrl || 'UNKNOWN';
  console.error(`[${timestamp}] ERROR ${method} ${url} — ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
};

/**
 * Simple console info logger
 */
const logInfo = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] INFO — ${message}`);
};

module.exports = { httpLogger, logError, logInfo };
