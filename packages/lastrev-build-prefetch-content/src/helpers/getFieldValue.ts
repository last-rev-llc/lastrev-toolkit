import { Entry } from 'contentful';
import { get, has } from 'lodash';

const getFieldValue = (
  content: Entry<any>,
  fieldName: string,
  locale: string,
  defaultLocale?: string,
  defaultValue?: any
) => {
  return has(content, `fields.${fieldName}['${locale}']`)
    ? get(content, `fields.${fieldName}['${locale}']`)
    : get(content, `fields.${fieldName}['${defaultLocale}']`, defaultValue);
};

export default getFieldValue;
