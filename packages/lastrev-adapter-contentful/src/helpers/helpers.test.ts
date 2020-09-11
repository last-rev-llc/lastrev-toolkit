import {
  isEntry,
  isAsset,
  isContentfulObject,
  extractContentTypeId,
  extractSlug,
  extractId,
  isLink,
  isBadContentfulObject
} from './helpers';

describe('helpers.js', () => {
  describe('isEntry', () => {
    it('returns true when the object is an entry', () => {
      const obj = {
        sys: {
          type: 'Entry'
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isEntry(obj)).toBe(true);
    });
    it('returns false if no sys field', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isEntry(obj)).toBe(false);
    });
    it('returns false if type is not Entry', () => {
      const obj = {
        sys: {
          type: 'Asset'
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isEntry(obj)).toBe(false);
    });
    it('returns false when the object is an array', () => {
      const obj = [
        {
          sys: {
            type: 'Entry'
          },
          fields: {
            a: 1,
            b: 2
          }
        }
      ];
      expect(isEntry(obj)).toBe(false);
    });
  });

  describe('isAsset', () => {
    it('returns true when the object is an asset', () => {
      const obj = {
        sys: {
          type: 'Asset'
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isAsset(obj)).toBe(true);
    });
    it('returns false if no sys field', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isAsset(obj)).toBe(false);
    });
    it('returns false if type is not Asset', () => {
      const obj = {
        sys: {
          type: 'Entry'
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isAsset(obj)).toBe(false);
    });
    it('returns false when the object is an array', () => {
      const obj = [
        {
          sys: {
            type: 'Asset'
          },
          fields: {
            a: 1,
            b: 2
          }
        }
      ];
      expect(isAsset(obj)).toBe(false);
    });
  });

  describe('isContentfulObject', () => {
    it('returns true when the object is a contentful object', () => {
      const obj = {
        sys: {
          type: 'Asset'
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isContentfulObject(obj)).toBe(true);
    });
    it('returns false if no sys property', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isContentfulObject(obj)).toBe(false);
    });
    it('returns false if no fields property', () => {
      const obj = {
        sys: {
          type: 'Entry'
        }
      };
      expect(isContentfulObject(obj)).toBe(false);
    });
    it('returns false when the object is an array', () => {
      const obj = [
        {
          sys: {
            type: 'Asset'
          },
          fields: {
            a: 1,
            b: 2
          }
        }
      ];
      expect(isContentfulObject(obj)).toBe(false);
    });
  });

  describe('isBadContentfulObject', () => {
    it('returns false when the object is a contentful object', () => {
      const obj = {
        sys: {
          type: 'Asset'
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isBadContentfulObject(obj)).toBe(false);
    });
    it('returns false if no sys property', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isBadContentfulObject(obj)).toBe(false);
    });
    it('returns true if no fields property', () => {
      const obj = {
        sys: {
          type: 'Entry'
        }
      };
      expect(isBadContentfulObject(obj)).toBe(true);
    });
    it('returns false when the object is an array', () => {
      const obj = [
        {
          sys: {
            type: 'Asset'
          },
          fields: {
            a: 1,
            b: 2
          }
        }
      ];
      expect(isBadContentfulObject(obj)).toBe(false);
    });
  });

  describe('extractContentTypeId', () => {
    it('returns the contentType Id from a contentful object', () => {
      const expected = 'myContentType';
      const obj = {
        sys: {
          type: 'Entry',
          contentType: {
            sys: {
              id: expected
            }
          }
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractContentTypeId(obj)).toBe(expected);
    });
    it('returns null if not a contentful object', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractContentTypeId(obj)).toBe(null);
    });
    it('returns null if no contentTypeId exists', () => {
      const obj = {
        sys: {
          contentType: {
            some: 'other'
          }
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractContentTypeId(obj)).toBe(null);
    });
  });

  describe('extractSlug', () => {
    it('returns the slug from a contentful object', () => {
      const expected = 'mySlug';
      const obj = {
        sys: {
          type: 'Entry',
          contentType: {
            sys: {
              id: 'someType'
            }
          }
        },
        fields: {
          a: 1,
          b: 2,
          slug: expected
        }
      };
      expect(extractSlug(obj)).toBe(expected);
    });
    it('returns null if not a contentful object', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2,
          slug: 'someSlugButNotContentful'
        }
      };
      expect(extractContentTypeId(obj)).toBe(null);
    });
    it('returns null if no slug exists', () => {
      const obj = {
        sys: {
          contentType: {
            some: 'myContent'
          }
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractContentTypeId(obj)).toBe(null);
    });
  });

  describe('extractId', () => {
    it('returns the Id from a contentful object', () => {
      const expected = '1234';
      const obj = {
        sys: {
          type: 'Entry',
          id: expected,
          contentType: {
            sys: {
              id: 'some'
            }
          }
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractId(obj)).toBe(expected);
    });
    it('returns null if not a contentful object', () => {
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractId(obj)).toBe(null);
    });
    it('returns null if no id exists', () => {
      const obj = {
        sys: {
          contentType: {
            some: 'other'
          }
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(extractId(obj)).toBe(null);
    });
  });

  describe('isLink', () => {
    it('returns true if the object is a link', () => {
      const linkContentType = 'myLink';
      const obj = {
        sys: {
          type: 'Entry',
          id: '1234',
          contentType: {
            sys: {
              id: linkContentType
            }
          }
        },
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isLink(obj, linkContentType)).toBe(true);
    });
    it('returns false if not a contentful object', () => {
      const linkContentType = 'myLink';
      const obj = {
        fields: {
          a: 1,
          b: 2
        }
      };
      expect(isLink(obj, linkContentType)).toBe(false);
    });
  });
});
