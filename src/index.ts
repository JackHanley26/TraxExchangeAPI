require('dotenv').config();
require('ts-node').register({files: true});

import * as express from 'express';
import {json} from 'body-parser';
import {createServer} from 'http';
import * as https from 'https';
import * as cors from 'cors';
import {readFileSync} from 'fs';
import {EnvVars, types} from './utils/env-vars';
import logger from './utils/logger';
import routes from './routes/v1';

const API_URL = EnvVars.get('API_URL');

// options for cors midddleware
const options: cors.CorsOptions = {
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'X-Access-Token'],
  credentials: true,
  methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
  origin: API_URL,
  preflightContinue: false
};


const index = express();
const apiBase = EnvVars.get('API_BASE', types.STRING, '/trax-exchange/api');
index.use(cors(options));
index.use('*', cors(options));
index.use(json());
index.use(`${apiBase}/v1`, routes);


const serverOpts = {
  key: readFileSync('src/config/certs/server.key'),
  cert: readFileSync('src/config/certs/server.cert')
};

// Starting both http & https servers
const httpServer = createServer(index);
const httpsServer = https.createServer(serverOpts, index);

const httpPort = EnvVars.get('PORT', types.INT, 3000);
const httpsPort = EnvVars.get('PORT', types.INT, 3000) + 1;

httpServer.listen(httpPort, () => {
  logger.info(`HTTP Server running on http://http-server:${httpPort}${apiBase}/v1`);
});

httpsServer.listen(httpsPort, () => {
  logger.info(`HTTPS Server running on https://https-server:${httpsPort}${apiBase}/v1`);
});
