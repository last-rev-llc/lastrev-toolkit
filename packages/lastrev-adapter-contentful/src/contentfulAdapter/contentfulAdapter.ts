import _ from 'lodash';
import { Entry, Asset } from 'contentful';
import parseLink from '../linkParser';
import parseAsset from '../assetParser';
import parseEntry from '../entryParser';
import { isEntry, isAsset, isLink } from '../helpers';
import { AdapterConfig, Transform, LinkFields } from '../types';

const Adapter = ({
  urlMap = {},
  linkContentType = 'elementLink',
  sameWindowActionText = 'Open in the same window',
  newWindowActionText = 'Open in a new window',
  modalActionText = 'Open in a modal',
  downloadActionText = 'Download',
  manualEntryTypeText = 'Manual text entry',
  contentRefTypeText = 'Content reference',
  assetRefTypeText = 'Asset reference'
}: AdapterConfig): Transform => (data) => {
  const traverse = (obj: unknown) => {
    if (_.isArray(obj)) {
      return _.map(obj, traverse) as unknown[];
    }
    if (isLink(obj, linkContentType)) {
      return parseLink({
        sameWindowActionText,
        newWindowActionText,
        modalActionText,
        downloadActionText,
        manualEntryTypeText,
        contentRefTypeText,
        assetRefTypeText,
        fields: (obj as Entry<LinkFields>).fields,
        urlMap
      });
    }
    if (isEntry(obj)) {
      const parsed = parseEntry(obj as Entry<Record<string, unknown>>, urlMap);
      const parsedFields: Record<string, unknown> = _.mapValues(
        (obj as Entry<Record<string, unknown>>).fields,
        traverse
      );
      return {
        ...parsed,
        ...parsedFields
      };
    }
    if (isAsset(obj)) {
      return parseAsset(obj as Asset);
    }
    if (_.isObject(obj)) {
      return _.mapValues(obj, traverse);
    }
    // most likely a simple value field
    return obj;
  };

  return traverse(data) as Record<string, unknown>;
};

export default Adapter;
