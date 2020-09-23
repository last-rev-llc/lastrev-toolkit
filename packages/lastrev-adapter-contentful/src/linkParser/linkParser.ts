import { has } from 'lodash';
import { Entry } from 'contentful';
import parseEntry from '../entryParser';
import { UrlMap, LinkFields, ParsedEntry } from '../types';

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
  parsedEntries
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
        console.warn(
          `Bad content for ${contentTypeId}: DestinationType is ${manualEntryTypeText}, but no URL has been entered`
        );
        break;
      }
      href = manualUrl;
      break;
    case contentRefTypeText: {
      if (!contentReference) {
        console.warn(
          `Bad content for ${contentTypeId}: DestinationType is ${contentRefTypeText}, but no content reference is selected`
        );
        break;
      }
      const parsed = has(parsedEntries, contentReference.sys.id)
        ? parsedEntries[contentReference.sys.id]
        : parseEntry(contentReference as Entry<{ slug: string }>, urlMap);
      const { _href, _as, _contentTypeId } = parsed;

      if (!_href || !_as) {
        throw Error(`urlMap does not contain entry for ${_contentTypeId}`);
      }
      [href, as] = [_href, _as];
      break;
    }
    case assetRefTypeText:
      if (!assetReference) {
        console.warn(
          `Bad content for ${contentTypeId}: DestinationType is ${assetRefTypeText}, but no asset is selected`
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

  return {
    ...fields,
    _id: id,
    _contentTypeId: contentTypeId,
    href,
    as,
    target,
    isModal,
    download
  };
};
