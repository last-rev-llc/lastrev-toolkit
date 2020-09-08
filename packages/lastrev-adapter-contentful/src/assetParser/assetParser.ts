import { get, pickBy, identity } from 'lodash';
import { Asset } from 'contentful';
import { ParsedAsset } from '../types';

export default (obj: Asset): ParsedAsset => {
  const title = get(obj, 'fields.title') as string;
  const description = get(obj, 'fields.description') as string;
  const url = get(obj, 'fields.file.url') as string;
  const size = get(obj, 'fields.file.details.size') as number;
  const width = get(obj, 'fields.file.details.image.width') as number;
  const height = get(obj, 'fields.file.details.image.height') as number;
  const filename = get(obj, 'fields.file.fileName') as string;
  const contentType = get(obj, 'fields.file.contentType') as string;

  return pickBy(
    {
      title,
      description,
      url,
      size,
      width,
      height,
      filename,
      contentType
    },
    identity
  ) as ParsedAsset;
};
