const cloudant = require('@cloudant/cloudant');

import {EnvVars} from '../utils/env-vars';

export default class Cloudant {

  private static instance: Cloudant = null;
  // @ts-ignore
  private db: any;

  private constructor() {
    const url = EnvVars.get('CLOUDANT_URL');
    const username = EnvVars.get('CLOUDANT_USERNAME');
    const password = EnvVars.get('CLOUDANT_PASSWORD');
    const db = EnvVars.get('CLOUDANT_DB');
    this.db = cloudant({url, username, password}).db.use(db);
  }

  public static getInstance() {
    if (this.instance == null) {
      this.instance = new Cloudant();
    }
    return this.instance;
  }


}
