import winston from 'winston';
import fs from 'fs';

const logFolder = "./logs";

// Create; load log path
if (!fs.existsSync(logFolder))
  fs.mkdirSync(logFolder);


export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({dirname: logFolder, filename: 'error.log', level: 'error'}),
    new winston.transports.File({dirname: logFolder, filename: 'info.log'})
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}