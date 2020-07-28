import getComponentMappings from './getComponentMappings';
import { contentTypes, componentNames } from './getComponentMappings.mock';

describe('getComponentMappings.js', () => {
  test('returns correct mappings with no overrides or exclude', () => {
    const mappings = getComponentMappings(componentNames, contentTypes);
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with overrides and no exclude', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with exclude and no overrides', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      exclude: ['PageGeneral']
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with both overrides and excludes', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      exclude: ['PageGeneral'],
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with override containing non-existent component', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      overrides: {
        pageGeneral: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with override containing non-existent content type', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      overrides: {
        dummy: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with exclude containing non-existent component', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      overrides: {
        dummy: 'Dummy'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
  test('returns correct mappings with overrides but exclude contains overriden component', () => {
    const mappings = getComponentMappings(componentNames, contentTypes, {
      exclude: ['Layout'],
      overrides: {
        settingsGlobal: 'Layout'
      }
    });
    expect(mappings).toMatchSnapshot();
  });
});
