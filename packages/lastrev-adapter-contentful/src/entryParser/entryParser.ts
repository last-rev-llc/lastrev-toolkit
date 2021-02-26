import { get, pickBy, identity } from 'lodash';
import { extractContentTypeId, extractId, extractSlug, extractModifiedDate } from '../helpers';
import { Entry, UrlMap, ParsedEntry, UrlMapping, ContentUrlLookup } from '../types';

const getUrl = (mapping: UrlMapping, slug: string) => {
  return [mapping.url.replace('[key]', `[${mapping.key}]`), mapping.url.replace('[key]', `${slug}`)];
};

export default (
  obj: Entry<Record<string, unknown>>,
  urlMap: UrlMap,
  contentUrlLookup?: ContentUrlLookup
): ParsedEntry => {
  const _id = extractId(obj);
  const _contentTypeId = extractContentTypeId(obj);
  const _modifiedDate = extractModifiedDate(obj);
  const slug = extractSlug(obj);

  // use a lookup of pre-parsed URLs first.
  let { href: _href, as: _as } = get(contentUrlLookup, _id, { href: null, as: null });

  // if non-existant, fall back to the URL map.
  if (!_href || !_as) {
    const mapped = get(urlMap, _contentTypeId);
    [_href, _as] = mapped && slug ? getUrl(mapped, slug) : [];
  }

  return pickBy(
    {
      _id,
      _contentTypeId,
      _href,
      _as,
      _modifiedDate
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    identity
  ) as ParsedEntry;
};
