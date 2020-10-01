import _ from 'lodash';
import parseEntry from './entryParser';
import mockEntry from './entryParser.mock';

const urlMap = {
  pageGeneral: {
    url: '/test/[key]',
    key: 'slug'
  }
};

const mock = mockEntry();

describe('entryParser.js', () => {
  test('parses all fields correctly when mapping exists', () => {
    const out = parseEntry(mock, urlMap);
    expect(out).toEqual({
      _id: mock.sys.id,
      _contentTypeId: mock.sys.contentType.sys.id,
      _href: `/test/[slug]`,
      _as: `/test/${mock.fields.slug}`,
      _modifiedDate: mock.sys.updatedAt
    });
  });
  test('parses all fields correctly when mapping does not exist', () => {
    const out = parseEntry(mock, {});
    expect(out).toEqual({
      _id: mock.sys.id,
      _contentTypeId: mock.sys.contentType.sys.id,
      _modifiedDate: mock.sys.updatedAt
    });
  });
  test('returns empty object when not a contentful item', () => {
    const obj = _.set(_.assign({}, mock), 'sys', {});
    const out = parseEntry(obj, urlMap);
    expect(out).toEqual({});
  });
  test('returns no _href or as _as properties when slug not found', () => {
    const obj = _.set(_.assign({}, mock), 'fields', { notaSlug: 'hello' });
    const out = parseEntry(obj, urlMap);
    expect(out).toEqual({
      _id: mock.sys.id,
      _contentTypeId: mock.sys.contentType.sys.id,
      _modifiedDate: mock.sys.updatedAt
    });
  });
});
