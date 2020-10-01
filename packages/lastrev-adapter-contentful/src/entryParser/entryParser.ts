import _ from 'lodash';
import { extractContentTypeId, extractId, extractSlug, extractModifiedDate } from '../helpers';
import { Entry, UrlMap, ParsedEntry, UrlMapping } from '../types';

const getUrl = (mapping: UrlMapping, slug: string) => {
  return [mapping.url.replace('[key]', `[${mapping.key}]`), mapping.url.replace('[key]', `${slug}`)];
};

export default (obj: Entry<Record<string, unknown>>, urlMap: UrlMap): ParsedEntry => {
  const _id = extractId(obj);
  const _contentTypeId = extractContentTypeId(obj);
  const _modifiedDate = extractModifiedDate(obj);
  const slug = extractSlug(obj);

  const mapped = _.get(urlMap, _contentTypeId);
  const [_href, _as] = mapped && slug ? getUrl(mapped, slug) : [];

  return _.pickBy(
    {
      _id,
      _contentTypeId,
      _href,
      _as,
      _modifiedDate
    },
    // eslint-disable-next-line @typescript-eslint/unbound-method
    _.identity
  ) as ParsedEntry;
};
