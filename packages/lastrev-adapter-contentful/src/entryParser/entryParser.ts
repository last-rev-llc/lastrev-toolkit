import _ from 'lodash';
import { extractContentTypeId, extractId, extractSlug } from '../helpers';
import { Entry, UrlMap, ParsedEntry } from '../types';

const getUrl = (mapping, slug) => {
  return [mapping.url.replace('[key]', `[${mapping.key}]`), mapping.url.replace('[key]', `${slug}`)];
};

export default (obj: Entry<Record<string, unknown>>, urlMap: UrlMap): ParsedEntry => {
  const _id = extractId(obj);
  const _contentTypeId = extractContentTypeId(obj);
  const slug = extractSlug(obj);

  const mapped = _.get(urlMap, _contentTypeId);
  const [_href, _as] = mapped && slug ? getUrl(mapped, slug) : [];

  return _.pickBy(
    {
      _id,
      _contentTypeId,
      _href,
      _as
    },
    _.identity
  ) as ParsedEntry;
};
