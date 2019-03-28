import logger from './logger';

export class EnvVars {

  public static get(key, type = types.STRING, backup = null) {
    if (key in process.env) {
      switch (type) {
        case types.STRING:
          return process.env[key];
        case types.INT:
          return parseInt(process.env[key], 10);
        case types.FLOAT:
          return parseFloat(process.env[key]);
        case types.BOOLEAN:
          const val = process.env[key];
          if (val === 'true' || val === 'True' || val === 'TRUE') {
            return true;
          } else if (val === 'false' || val === 'False' || val === 'FALSE') {
            return false;
          }
          return process.env[key];
        default:
          return process.env[key];
      }
    } else {
      logger.error(`Env var not found: ${key}`);
      return backup;
    }
  }

  public static set(key, value) {
    if (key && value) {
      process.env[key] = value;
    } else {
      logger.error('set cache error: invalid input');
    }
  }

}

export const types = {
  STRING: 'string',
  INT: 'integer',
  FLOAT: 'float',
  BOOLEAN: 'boolean'
};
