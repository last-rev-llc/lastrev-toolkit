import _ from 'lodash';
import pascalCase from '../helpers/pascalCase';

type MappingConfig = {
  overrides?: Record<string, string>;
  exclude?: string[];
};

const getComponentMappings = (
  componentNames: string[],
  contentTypes: { sys: { id: string } }[],
  config?: MappingConfig
): Record<string, string> => {
  const filteredComponentNames = _.filter(componentNames, (component: string) => {
    return !(config && config.exclude && _.includes(config.exclude, component));
  });

  const isOverriden = (contentTypeId: string) => {
    return config && _.has(config.overrides, contentTypeId);
  };

  const componentExists = (component) => {
    return _.includes(filteredComponentNames, component);
  };

  const out = {};

  _.each(contentTypes, (item) => {
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
