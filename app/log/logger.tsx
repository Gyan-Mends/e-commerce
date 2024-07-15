import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, printf, errors } = format;

// Define custom log format
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create the logger
const logger: Logger = createLogger({
  level: 'info', // Default log level
  format: combine(
    timestamp(),
    errors({ stack: true }), // Capture stack trace in logs
    customFormat
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'app.log' }) // Log to file
  ]
});

export default logger;
