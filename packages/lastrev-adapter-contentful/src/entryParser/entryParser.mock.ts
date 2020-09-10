/* eslint-disable @typescript-eslint/no-empty-function */
import { Entry } from 'contentful';

export type MockEntryType = Entry<{
  internalTitle: string;
  slug: string;
  hero: Entry<{ title: string }>;
  content: Entry<unknown>[];
  seo: Record<string, unknown>;
}>;

export default (): MockEntryType => {
  const hero: Entry<{ title: string }> = {
    sys: {
      type: 'Link',
      id: 'desNxsju6qGu7vKfg1Ekt',
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'ModuleHero'
        }
      },
      createdAt: '2020-07-07T01:08:00.790Z',
      updatedAt: '2020-07-16T17:46:42.828Z',
      locale: 'en-US'
    },
    fields: {
      title: 'Hi there'
    },
    toPlainObject: () => ({}),
    update: () => {
      return new Promise((resolve) => {
        resolve(hero);
      });
    }
  };

  const entry: MockEntryType = {
    sys: {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'hhv516v5f7sj'
        }
      },
      type: 'Entry',
      id: '4YxB4YG8qhMvJgZEB4Oi5k',
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'pageGeneral'
        }
      },
      revision: 2,
      createdAt: '2020-07-07T01:08:00.790Z',
      updatedAt: '2020-07-16T17:46:42.828Z',
      locale: 'en-US'
    },
    fields: {
      internalTitle: 'Test Page General',
      slug: 'testing',
      content: [],
      seo: {},
      hero
    },
    toPlainObject: () => ({}),
    update: () => {
      return new Promise((resolve) => {
        resolve(entry);
      });
    }
  };

  return entry;
};
