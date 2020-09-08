import { Asset } from 'contentful';
import faker from 'faker';

export default (isImage?: boolean): Asset => {
  const image = isImage
    ? {
        width: faker.random.number(),
        height: faker.random.number()
      }
    : undefined;

  return {
    fields: {
      title: faker.random.words(),
      description: faker.random.words(),
      file: {
        contentType: isImage ? 'image/png' : 'document/pdf',
        fileName: faker.image.image(),
        url: faker.image.imageUrl(),
        details: {
          image,
          size: faker.random.number()
        }
      }
    },
    sys: {
      id: faker.random.alphaNumeric(10),
      type: 'Asset',
      locale: faker.random.locale(),
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: faker.random.alphaNumeric(10)
        }
      },
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: faker.random.alphaNumeric(10)
        }
      },
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.past().toISOString(),
      revision: faker.random.number()
    },
    toPlainObject: () => {
      return {};
    }
  };
};
