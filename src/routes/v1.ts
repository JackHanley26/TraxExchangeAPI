import logger from '../utils/logger';
import {inspect} from 'util';
import {Router} from 'express';

const router = Router();


const root = (req, res, next) => {
  try {
    const result = '/ Hello from root!';
    res.send(result);
  } catch (e) {
    logger.error(`Error occurred on root of routes - ${inspect(e)}`);
    next(e);
  }
};


// endpoint mapping
router.get('/', root);


export default router;
