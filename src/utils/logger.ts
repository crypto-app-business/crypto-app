import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logs', 'server.log');

const logger = {
  info: (message) => logToFile('INFO', message),
  error: (message) => logToFile('ERROR', message),
};

function logToFile(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  fs.appendFileSync(logFile, logMessage, { encoding: 'utf8' });
}

export default logger;