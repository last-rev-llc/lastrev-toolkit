import { omit, has, isArray, map, isObject, mapValues, without, omitBy, isNil } from 'lodash';

const isUnexpandedEntryLink = (v) => {
  return v.sys && v.sys.type === 'Link' && v.sys.linkType === 'Entry' && v.sys.id && !v.sys.space;
};

const isUnexpandedAssetLink = (v) => {
  return v.sys && v.sys.type === 'Link' && v.sys.linkType === 'Asset' && v.sys.id && !v.sys.space;
};

const compose = ({
  contentId,
  contentById,
  include,
  assetsById,
  locale,
  defaultLocale,
  rootOmitFields,
  childOmitFields
}) => {
  const content = contentById[contentId];

  let killIt = false;

  const traverse = (node: any, maxDepth: number, isField: boolean) => {
    if (node === undefined || node === null) {
      return node;
    }
    if (isField) {
      if (has(node, locale)) {
        return traverse(node[locale], maxDepth, false);
      }
      if (has(node, defaultLocale)) {
        return traverse(node[defaultLocale], maxDepth, false);
      }
      return undefined;
    } else {
      if (isArray(node)) {
        return map(without(node, undefined, null), (item) => traverse(item, maxDepth, false));
      }
      if (maxDepth > 0 && isUnexpandedEntryLink(node)) {
        const newNode = contentById[node.sys.id];
        // reference field, decrement maxDepth.
        return traverse(newNode, maxDepth - 1, false);
      }
      if (isUnexpandedAssetLink(node)) {
        const newNode = assetsById[node.sys.id];
        return traverse(newNode, maxDepth, false);
      }
      if (isObject(node)) {
        return mapValues(omitBy(node, isNil), (v, k) => {
          if (k === 'sys') {
            // don't traverse sys;
            return v;
          }
          if (k === 'fields') {
            // omit child fields
            return mapValues(omit(v, childOmitFields), (field) => traverse(field, maxDepth, true));
          }
          return traverse(v, maxDepth, false);
        });
      }
      return node;
    }
  };

  const out = {
    sys: content.sys,
    fields: {
      ...mapValues(omit(content.fields, rootOmitFields), (field) => traverse(field, include, true))
    }
  };

  if (killIt) {
    console.log('final', JSON.stringify(out, null, 2));
    process.exit();
  }

  return out;
};

export default compose;
