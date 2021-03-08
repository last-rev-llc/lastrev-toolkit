import jsonLogic from 'json-logic-js';
import { Entry } from 'contentful';
import { chain, get, identity, some } from 'lodash';
import { ResolvedBuildConfig } from '../types';
import getFieldValue from './getFieldValue';

const excludeContent = (
  buildConfig: ResolvedBuildConfig,
  content: Entry<any>,
  locale: string,
  defaultLocale?: string
): { excludeIfParentIsExcluded: boolean; exclude: boolean } => {
  const contentTypeId = get(content, 'sys.contentType.sys.id');
  const config = get(buildConfig, `excludePages.${contentTypeId}`);

  if (!contentTypeId || !config) return { excludeIfParentIsExcluded: false, exclude: false };

  const { rules, fields, excludeIfParentIsExcluded } = config;

  const data = chain(fields)
    .keyBy(identity)
    .mapValues((fieldName) => getFieldValue(content, fieldName, locale, defaultLocale))
    .value();

  const exclude = !!jsonLogic.apply(rules, data);

  return { excludeIfParentIsExcluded, exclude };
};

export default excludeContent;
