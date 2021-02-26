import { ContentType } from 'contentful';
import { filter, each, includes, has, get } from 'lodash';
import pascalCase from '../helpers/pascalCase';

type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

const getComponentMappings = (contentTypes: ContentType[], config: MappingConfig): Record<string, string> => {
  const out = {};

  const overrides = get(config, 'overrides', {});
  const exclude = get(config, 'exclude', []);

  each(contentTypes, (item) => {
    const {
      sys: { id: contentTypeId }
    } = item;

    const componentName = get(overrides, contentTypeId, pascalCase(contentTypeId));

    if (!includes(exclude, componentName)) {
      out[contentTypeId] = componentName;
    }
  });

  return out;
};

export default getComponentMappings;
