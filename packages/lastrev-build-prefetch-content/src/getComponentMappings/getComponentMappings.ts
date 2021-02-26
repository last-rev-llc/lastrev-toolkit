import { ContentType } from 'contentful';
import { filter, each, includes, has } from 'lodash';
import pascalCase from '../helpers/pascalCase';

type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

const getComponentMappings = (
  componentNames: string[],
  contentTypes: ContentType[],
  config?: MappingConfig
): Record<string, string> => {
  const filteredComponentNames = filter(componentNames, (component: string) => {
    return !(config && config.exclude && includes(config.exclude, component));
  });

  const isOverriden = (contentTypeId: string) => {
    return config && has(config.overrides, contentTypeId);
  };

  const componentExists = (component) => {
    return includes(filteredComponentNames, component);
  };

  const out = {};

  each(contentTypes, (item) => {
    const {
      sys: { id: contentTypeId }
    } = item;

    const defaultComponentName = pascalCase(contentTypeId);

    if (isOverriden(contentTypeId)) {
      const component = config.overrides[contentTypeId];
      if (componentExists(component)) {
        out[contentTypeId] = component;
      }
      return;
    }

    if (componentExists(defaultComponentName)) {
      out[contentTypeId] = defaultComponentName;
    }
  });

  return out;
};

export default getComponentMappings;
