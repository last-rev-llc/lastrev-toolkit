import { has, omitBy } from 'lodash';
import { Entry } from 'contentful';
import parseEntry from '../entryParser';
import { UrlMap, LinkFields, ParsedEntry, ContentUrlLookup } from '../types';
import { warn } from '../helpers';

export declare type LinkParserConfig = {
  newWindowActionText: string;
  sameWindowActionText: string;
  modalActionText: string;
  downloadActionText: string;
  manualEntryTypeText: string;
  contentRefTypeText: string;
  assetRefTypeText: string;
  fields: LinkFields;
  id: string;
  contentTypeId: string;
  urlMap?: UrlMap;
  parsedEntries: Record<string, ParsedEntry>;
  contentUrlLookup?: ContentUrlLookup;
};

export default ({
  newWindowActionText,
  modalActionText,
  downloadActionText,
  manualEntryTypeText,
  contentRefTypeText,
  assetRefTypeText,
  fields,
  id,
  contentTypeId,
  urlMap,
  parsedEntries,
  contentUrlLookup
}: LinkParserConfig): Record<string, unknown> => {
  const { action, destinationType, manualUrl, contentReference, assetReference } = fields;

  const isModal = action === modalActionText;
  const download = action === downloadActionText;
  const target = action === newWindowActionText ? '_blank' : null;

  let href: string = null;
  let as: string = null;

  switch (destinationType) {
    case manualEntryTypeText:
      if (!manualUrl) {
        warn(
          `Bad content for ${contentTypeId} ${id}: DestinationType is ${manualEntryTypeText}, but no URL has been entered`
        );
        break;
      }
      href = manualUrl;
      break;
    case contentRefTypeText: {
      if (!contentReference) {
        warn(
          `Bad content for ${contentTypeId} ${id}: DestinationType is ${contentRefTypeText}, but no content reference is selected`
        );
        break;
      }
      const parsed = has(parsedEntries, contentReference.sys.id)
        ? parsedEntries[contentReference.sys.id]
        : parseEntry(contentReference as Entry<{ slug: string }>, urlMap, contentUrlLookup);
      const { _href, _as, _contentTypeId, _id } = parsed;

      if (!_href || !_as) {
        warn(
          `Bad content for ${contentTypeId} ${id}: Unable to parse href for ${_id}: Possible causes: ${_contentTypeId} does not have an entry in urlMap (in .lastrevrc file), slug field is not populated, or content has been archived or deleted.`
        );
        break;
      }
      [href, as] = [_href, _as];
      break;
    }
    case assetRefTypeText:
      if (!assetReference) {
        console.warn(
          `Bad content for ${contentTypeId} ${id}: DestinationType is ${assetRefTypeText}, but no asset is selected`
        );
        break;
      }
      ({
        fields: {
          file: { url: href }
        }
      } = assetReference);
      break;
    default:
      break;
  }

  const extraFields = omitBy(fields, (val) => {
    return [action, destinationType, manualUrl, contentReference, assetReference].indexOf(val) > -1;
  });

  return {
    ...extraFields,
    _id: id,
    _contentTypeId: contentTypeId,
    href,
    as,
    target,
    isModal,
    download
  };
};
