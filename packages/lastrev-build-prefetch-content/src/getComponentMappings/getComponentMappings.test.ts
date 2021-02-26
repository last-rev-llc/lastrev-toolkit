import { ContentType } from 'contentful';
import getComponentMappings from './getComponentMappings';
import { contentTypes, componentNames } from './getComponentMappings.mock';

describe('getComponentMappings.js', () => {
  test('returns correct mappings with no overrides or exclude', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[]);
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with overrides and no exclude', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with exclude and no overrides', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      exclude: ['PageGeneral']
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with both overrides and excludes', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      exclude: ['PageGeneral'],
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with override containing non-existent component', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      overrides: {
        pageGeneral: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with override containing non-existent content type', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      overrides: {
        dummy: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with exclude containing non-existent component', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      overrides: {
        dummy: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with overrides but exclude contains overriden component', () => {
    const mappings = getComponentMappings(componentNames, contentTypes as ContentType[], {
      exclude: ['Layout'],
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
});
