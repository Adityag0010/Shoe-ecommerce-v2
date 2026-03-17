import winston from "winston";
import morgan from "morgan";

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export const logger = morgan("dev", {
  stream: { write: (message) => winstonLogger.info(message.trim()) },
});
