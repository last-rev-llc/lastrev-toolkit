import faker, { fake } from 'faker';
import parse from './linkParser';
import mockContent from './linkParser.mock';
import { ParsedEntry } from '../types';

const baseData = {
  sameWindowActionText: 'Open in the same window',
  newWindowActionText: 'Open in a new window',
  modalActionText: 'Open in a modal',
  downloadActionText: 'Download',
  manualEntryTypeText: 'Manual text entry',
  contentRefTypeText: 'Content reference',
  assetRefTypeText: 'Asset reference',
  id: faker.random.alphaNumeric(10),
  contentTypeId: 'elementLink',
  parsedEntries: {},
  urlMap: {
    pageGeneral: {
      url: '/test/[key]',
      key: 'slug'
    }
  }
};

const mock = mockContent();

const spyError = jest.spyOn(console, 'error');
const spyWarn = jest.spyOn(console, 'warn');

beforeEach(() => {
  spyError.mockReset();
  spyWarn.mockReset();
});

afterEach(() => {
  expect(spyError).not.toHaveBeenCalled();
});

describe('linkParser', () => {
  describe('destination type: manualUrl', () => {
    test('action: open in the same window', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Manual text entry',
          action: 'Open in the same window'
        }
      });

      expect(parsed.href).toBe(mock.fields.manualUrl);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: open in a new window', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Manual text entry',
          action: 'Open in a new window'
        }
      });

      expect(parsed.href).toBe(mock.fields.manualUrl);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe('_blank');
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: open in a modal', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Manual text entry',
          action: 'Open in a modal'
        }
      });

      expect(parsed.href).toBe(mock.fields.manualUrl);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(true);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: Download', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Manual text entry',
          action: 'Download'
        }
      });

      expect(parsed.href).toBe(mock.fields.manualUrl);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(true);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('no manual URL entered returns null href and as', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Manual text entry',
          manualUrl: undefined
        }
      });

      expect(parsed.href).toBe(null);
      expect(parsed.as).toBe(null);
      expect(spyWarn).toHaveBeenCalledWith(
        'Bad content for elementLink: DestinationType is Manual text entry, but no URL has been entered'
      );
    });
  });

  describe('destination type: Content reference', () => {
    test('action: open in the same window', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          action: 'Open in the same window'
        }
      });

      expect(parsed.href).toBe('/test/[slug]');
      expect(parsed.as).toBe(`/test/${mock.fields.contentReference.fields.slug}`);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: open in a new window', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          action: 'Open in a new window'
        }
      });

      expect(parsed.href).toBe('/test/[slug]');
      expect(parsed.as).toBe(`/test/${mock.fields.contentReference.fields.slug}`);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe('_blank');
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: open in a modal', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          action: 'Open in a modal'
        }
      });

      expect(parsed.href).toBe('/test/[slug]');
      expect(parsed.as).toBe(`/test/${mock.fields.contentReference.fields.slug}`);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(true);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: Download', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          action: 'Download'
        }
      });

      expect(parsed.href).toBe('/test/[slug]');
      expect(parsed.as).toBe(`/test/${mock.fields.contentReference.fields.slug}`);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(true);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('circular reference, action: open in the same window', () => {
      const circularEntry: ParsedEntry = {
        _id: baseData.id,
        _contentTypeId: baseData.contentTypeId,
        _href: faker.internet.url(),
        _as: faker.internet.url()
      };

      const parsedEntries = {};
      parsedEntries[baseData.id] = circularEntry;

      const parsed = parse({
        ...baseData,
        parsedEntries,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          action: 'Open in the same window',
          contentReference: {
            sys: {
              type: 'Link',
              linkType: 'Entry',
              id: circularEntry._id,
              circular: true
            }
          }
        }
      });

      expect(parsed.href).toBe(circularEntry._href);
      expect(parsed.as).toBe(circularEntry._as);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('no content reference entered returns null href and as', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          contentReference: null
        }
      });

      expect(parsed.href).toBe(null);
      expect(parsed.as).toBe(null);
      expect(spyWarn).toHaveBeenCalledWith(
        'Bad content for elementLink: DestinationType is Content reference, but no content reference is selected'
      );
    });

    test('bad content reference due to missing urlMap', () => {
      const parsed = parse({
        ...baseData,
        urlMap: {},
        fields: {
          ...mock.fields,
          destinationType: 'Content reference'
        }
      });

      expect(parsed.href).toBe(null);
      expect(parsed.as).toBe(null);
      expect(spyWarn).toHaveBeenCalledWith(
        `Bad content for elementLink: Unable to parse href for ${mock.fields.contentReference.sys.id}: Possible causes: ${mock.fields.contentReference.sys.contentType.sys.id} does not have an entry in urlMap (in .lastrevrc file), slug field is not populated, or content has been archived or deleted.`
      );
    });

    test('bad content reference due to missing slug', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Content reference',
          contentReference: {
            ...mock.fields.contentReference,
            fields: {
              slug: undefined
            }
          }
        }
      });

      expect(parsed.href).toBe(null);
      expect(parsed.as).toBe(null);
      expect(spyWarn).toHaveBeenCalledWith(
        `Bad content for elementLink: Unable to parse href for ${mock.fields.contentReference.sys.id}: Possible causes: ${mock.fields.contentReference.sys.contentType.sys.id} does not have an entry in urlMap (in .lastrevrc file), slug field is not populated, or content has been archived or deleted.`
      );
    });
  });

  describe('destination type: Asset reference', () => {
    test('action: open in the same window', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Asset reference',
          action: 'Open in the same window'
        }
      });

      expect(parsed.href).toBe(mock.fields.assetReference.fields.file.url);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: open in a new window', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Asset reference',
          action: 'Open in a new window'
        }
      });

      expect(parsed.href).toBe(mock.fields.assetReference.fields.file.url);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe('_blank');
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: open in a modal', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Asset reference',
          action: 'Open in a modal'
        }
      });

      expect(parsed.href).toBe(mock.fields.assetReference.fields.file.url);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(true);
      expect(parsed.download).toBe(false);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('action: Download', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Asset reference',
          action: 'Download'
        }
      });

      expect(parsed.href).toBe(mock.fields.assetReference.fields.file.url);
      expect(parsed.as).toBe(null);
      expect(parsed.linkText).toBe(mock.fields.linkText);
      expect(parsed.target).toBe(null);
      expect(parsed.isModal).toBe(false);
      expect(parsed.download).toBe(true);
      expect(parsed._id).toBe(baseData.id);
      expect(parsed._contentTypeId).toBe(baseData.contentTypeId);
      expect(spyWarn).not.toHaveBeenCalled();
    });

    test('no asset reference entered returns null href and as', () => {
      const parsed = parse({
        ...baseData,
        fields: {
          ...mock.fields,
          destinationType: 'Asset reference',
          assetReference: undefined
        }
      });

      expect(parsed.href).toBe(null);
      expect(parsed.as).toBe(null);
      expect(spyWarn).toHaveBeenCalledWith(
        'Bad content for elementLink: DestinationType is Asset reference, but no asset is selected'
      );
    });
  });
});
