import {inspect} from 'util';
import logger from '../utils/logger';

const errorDefinitions = {
  BAD_REQUEST: {
    status: 400,
    message: 'Client request is invalid.'
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'You are not authorized to perform this request.'
  },
  PAYMENT_REQUIRED: {
    status: 402,
    message: 'Payment required to perform this request.'
  },
  FORBIDDEN: {
    status: 403,
    message: 'Performing this request has been denied.'
  },
  NOT_FOUND: {
    status: 404,
    message: 'Requested resource was not found.'
  },
  METHOD_NOT_ALLOWED: {
    status: 405,
    message: 'Method is not allowed.'
  },
  CONFLICT: {
    status: 409,
    message: 'A conflict occurred on the server.'
  },
  PAYLOAD_TOO_LARGE: {
    status: 413,
    message: 'Payload is too large.'
  },
  TOO_MANY_REQUESTS: {
    status: 429,
    message: 'Frequency of requests is too high.'
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: 'An internal server has occurred.'
  },
  NOT_IMPLEMENTED: {
    status: 501,
    message: 'Requested resource is not implemented.'
  },
  BAD_GATEWAY: {
    status: 502,
    message: 'A bad gateway error has occurred.'
  },
  SERVICE_UNAVAILABLE: {
    status: 503,
    message: 'Service is not available.'
  },
  GATEWAY_TIMEOUT: {
    status: 504,
    message: 'A gateway timeout has occurred.'
  }
};

const httpErrors = Object.keys(errorDefinitions);

const errorCodeMap = httpErrors.reduce((m, k) => {
  m[errorDefinitions[k].status] = errorDefinitions[k];
  return m;
}, {});

const errorHandler = (err, req, res, next) => {

  // users may want to use their own logger
  if (!req.logger) {
    req.logger = logger;
  }

  const sendError = (e) => {
    const status = e.status || e.statusCode;
    res.status(status)
      .json({
        error: e.message,
        status
      });
  };

  if (err && typeof err === 'string' && (errorDefinitions[err])) {
    sendError(errorDefinitions[err]);
  } else if (err && typeof err === 'object' && (err.status != null || err.statusCode != null) && err.message != null) {
    sendError(err);
  } else if (err && typeof err === 'object' && (err.status != null || err.statusCode != null)) {
    sendError(errorCodeMap[err.status || err.statusCode]);
  } else if (err && typeof err === 'number' && errorCodeMap[err]) {
    sendError(errorCodeMap[err]);
  } else {
    sendError(errorDefinitions.INTERNAL_SERVER_ERROR);
  }
  req.logger.error(
    `An internal error has occurred.
    Endpoint: ${req.originalUrl}
    Body: ${inspect(req.body)}
    Query: ${inspect(req.query)}
    Err: ${inspect(err)}`
  );
  next();
};

module.exports = {
  errorHandler,
  errorDefinitions
};
