import _ from 'lodash';

export default (obj) => {
  const {
    fields: {
      title,
      description,
      file: {
        url,
        details: {
          size,
          image: { width, height }
        },
        fileName: filename,
        contentType
      }
    }
  } = obj;
  return _.pickBy(
    {
      title,
      description,
      url,
      size,
      width,
      height,
      filename,
      contentType
    },
    _.identity
  );
};
