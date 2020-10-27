import _ from 'lodash';

export const isBadContentfulObject = (obj: unknown): boolean => {
  return typeof obj === 'object' && _.has(obj, 'sys') && !_.has(obj, 'fields');
};

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
  return (_.get(obj, 'sys.contentType.sys.id') as string) || null;
};

export const extractModifiedDate = (obj: unknown): Date | null => {
  return (_.get(obj, 'sys.updatedAt') as Date) || null;
};

export const extractId = (obj: unknown): string | null => {
  return (_.get(obj, 'sys.id') as string) || null;
};

export const extractSlug = (obj: unknown): string | null => {
  return (_.get(obj, 'fields.slug') as string) || null;
};

export const isLink = (obj: unknown, contentTypeId: string): boolean => {
  return isEntry(obj) && contentTypeId === extractContentTypeId(obj);
};

export const warn = (...args: unknown[]): void => {
  // TODO: we could use an env var to determine whether to throw error or warn.
  // eslint-disable-next-line no-console
  console.warn(...args);
};
