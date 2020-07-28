import _ from 'lodash';
import parseEntry from './entryParser';
import mockEntry from './entryParser.mock';

const urlMap = {
  pageGeneral: {
    url: '/test/[key]',
    key: 'slug'
  }
};

describe('entryParser.js', () => {
  test('parses all fields correctly when mapping exists', () => {
    const out = parseEntry(mockEntry, urlMap);
    expect(out).toEqual({
      _id: _.get(mockEntry, 'sys.id'),
      _contentTypeId: _.get(mockEntry, 'sys.contentType.sys.id'),
      _href: `/test/[slug]`,
      _as: `/test/${_.get(mockEntry, 'fields.slug')}`
    });
  });
  test('parses all fields correctly when mapping does not exist', () => {
    const out = parseEntry(mockEntry, {});
    expect(out).toEqual({
      _id: _.get(mockEntry, 'sys.id'),
      _contentTypeId: _.get(mockEntry, 'sys.contentType.sys.id')
    });
  });
  test('returns empty object when not a contentful item', () => {
    const obj = _.set(_.assign({}, mockEntry), 'sys', {});
    const out = parseEntry(obj, urlMap);
    expect(out).toEqual({});
  });
  test('returns no _href or as _as properties when slug not found', () => {
    const obj = _.set(_.assign({}, mockEntry), 'fields', { notaSlug: 'hello' });
    const out = parseEntry(obj, urlMap);
    expect(out).toEqual({
      _id: _.get(mockEntry, 'sys.id'),
      _contentTypeId: _.get(mockEntry, 'sys.contentType.sys.id')
    });
  });
});
