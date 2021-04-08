import Adapter from '@last-rev/adapter-contentful';
import removeCircularRefs from './removeCircularRefs';
import adapterConfig from './buildArtifacts/adapterConfig';
import client from './contentful';

const transform = Adapter(adapterConfig);

const fetchEntries = async ({ contentType, ...options }) => {
  const entries = await client
    .getEntries({
      content_type: contentType,
      ...options
    })
    .then((result) => result?.items?.map(transform));

  return removeCircularRefs(entries);
};

export default fetchEntries;
