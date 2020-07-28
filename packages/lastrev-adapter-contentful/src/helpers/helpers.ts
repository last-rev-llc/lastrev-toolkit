import _ from 'lodash';

export const isContentfulObject = (obj: unknown): boolean => {
  return typeof obj === 'object' && _.has(obj, 'sys') && _.has(obj, 'fields');
};

export const isEntry = (obj: unknown): boolean => {
  return isContentfulObject(obj) && _.get(obj, 'sys.type') === 'Entry';
};

export const isAsset = (obj: unknown): boolean => {
  return isContentfulObject(obj) && _.get(obj, 'sys.type') === 'Asset';
};

export const extractContentTypeId = (obj: unknown): string | null => {
  return (isEntry(obj) && _.get(obj, 'sys.contentType.sys.id')) || null;
};

export const extractId = (obj: unknown): string | null => {
  return (isEntry(obj) && _.get(obj, 'sys.id')) || null;
};

export const extractSlug = (obj: unknown): string | null => {
  return (isEntry(obj) && _.get(obj, 'fields.slug')) || null;
};

export const isLink = (obj, contentTypeId): boolean => {
  return isEntry(obj) && contentTypeId === extractContentTypeId(obj);
};
