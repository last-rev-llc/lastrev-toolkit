import parseEntry from '../entryParser';
import { UrlMap, LinkFields } from '../types';

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
  urlMap
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
        throw Error(`DestinationType is ${manualEntryTypeText}, but no URL has been entered`);
      }
      href = manualUrl;
      break;
    case contentRefTypeText: {
      if (!contentReference) {
        throw Error(`DestinationType is ${contentRefTypeText}, but no content reference is selected`);
      }
      const { _href, _as, _contentTypeId } = parseEntry(contentReference, urlMap);
      if (!_href || !_as) {
        throw Error(`urlMap does not contain entry for ${_contentTypeId}`);
      }
      [href, as] = [_href, _as];
      break;
    }
    case assetRefTypeText:
      if (!assetReference) {
        throw Error(`DestinationType is ${assetRefTypeText}, but no asset is selected`);
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
