import { resolve } from 'path';
import { get } from 'lodash';
import { existsSync } from 'fs';

import { NestedParentPathItemConfig, RootLogicFunc } from '../types';

import {
    PROJECT_ROOT
  } from '../constants';

export default (entry: any, config: NestedParentPathItemConfig): string => {
  if (!config || !config.rootDomainFile) {
    return "";
  }
  
  const rootDomainFile = config.rootDomainFile;
  const contentTypeId = get(entry, 'sys.contentType.sys.id');
  try {
    const rootDomainPath = resolve(PROJECT_ROOT, rootDomainFile);
    if (!existsSync(rootDomainPath)) {
      throw new Error(`File does not exist. Path: ${rootDomainPath}`);
    }

    const rootLogic = require(rootDomainPath).default as RootLogicFunc;

    if (!rootLogic) return "";

    const root = rootLogic(entry);

    if (!root || root.trim() === '') return "";

    return root;
  } catch (e) {
    console.log(
      `Error during pull root domain logic for ${rootDomainFile ? `file ${rootDomainFile}` : ''} (${contentTypeId}). Reason: ${
        e.message
      }`
    );
    return null;
  }
};
