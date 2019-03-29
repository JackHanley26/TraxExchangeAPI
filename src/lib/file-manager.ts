import {readdirSync, statSync} from 'fs';
import {join} from 'path';
import logger from '../utils/logger';
import * as _ from 'lodash';
import {EnvVars} from '../utils/env-vars';

const ignore = [
  '.plist',
];

export class FileManager {

  private root: string;
  private files: object[];

  constructor() {
    this.root = EnvVars.get('ITUNES_ROOT');
    this.files = this.walkSync(this.root);
    logger.info(`${this.files.length}`);
  }

  getFile(id): object {
    if (this.hasFile(id)) {
      return _.find(this.files, f => f === id);
    } else {
      logger.error(`file ${id} not found`);
      return null;
    }
  }

  getFiles(): object[] {
    return this.files;
  }

  hasFile(id) {
    return !!_.find(this.files, f => f === id);
  }

  private shouldIgnore(file) {
    for (const i in ignore) {
      if (file.indexOf(i) >= 0) {
        return true;
      }
    }
    return false;
  }

  private walkSync(dir, filelist = []) {
    const files = readdirSync(dir);
    for (const file of files) {
      const dirFile = join(dir, file);
      const dirent = statSync(dirFile);
      if (dirent.isDirectory()) {
        console.log('directory', join(dir, file));
        const odir = {file: dirFile, files: []};
        odir.files = this.walkSync(dirFile, dir.files);
        filelist.push(odir);
      } else if (!this.shouldIgnore(dirFile)) {
        filelist.push({file: dirFile});
      }
    }
    return filelist;
  }


}
