import express from 'express';
import fs from 'fs';
import http from 'http';
import https from 'https';

import {logger} from './utils/logger.mjs';

const app =  express();
const options = {key: fs.readFileSync('./config/certs/server.key'), cert: fs.readFileSync('./config/certs/server.cert')};

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(options, app);

const httpPort = 3000;
const httpsPort = 3001;

httpServer.listen(httpPort, () => {
  logger.info(`HTTP Server running on port ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
  logger.info(`HTTPS Server running on port ${httpsPort}`);
});