const { createLogger, format, transports } = require('winston');

const env = process.env.NODE_ENV || 'development';
const level = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');

const productionFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json()
);

const devFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    const msg = stack || message;
    return `${timestamp} ${level}: ${msg}`;
  })
);

const logger = createLogger({
  level,
  format: env === 'production' ? productionFormat : devFormat,
  transports: [
    new transports.Console({
      handleExceptions: true,
    })
  ],
  exitOnError: false,
});

if (process.env.LOG_FILE) {
  logger.add(new transports.File({
    filename: process.env.LOG_FILE,
    level,
    format: productionFormat,
    handleExceptions: true,
  }));
}

module.exports = logger;
