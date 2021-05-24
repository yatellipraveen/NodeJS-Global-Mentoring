import winston, { format }  from 'winston';

export const winstonLogger = winston.createLogger({
    format: format.combine(
        format.splat(),
        format.simple()
      ),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});