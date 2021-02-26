import { ContentType } from 'contentful';
import getComponentMappings from './getComponentMappings';
import { contentTypes } from './getComponentMappings.mock';

describe('getComponentMappings.js', () => {
  test('returns correct mappings with overrides and no exclude', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with exclude and no overrides', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      exclude: ['PageGeneral']
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with both overrides and excludes', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      exclude: ['PageGeneral'],
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with override containing non-existent component', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      overrides: {
        pageGeneral: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with override containing non-existent content type', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      overrides: {
        dummy: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with exclude containing non-existent component', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      overrides: {
        dummy: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with overrides but exclude contains overriden component', () => {
    const mappings = getComponentMappings(contentTypes as ContentType[], {
      exclude: ['Layout'],
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
});
