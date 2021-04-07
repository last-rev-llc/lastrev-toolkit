import path from 'path';
const readContentJSON = (contentJsonDirectory) => async ({ contentTypeId, slug, id, locale }) => {
  const { promises: fsPromises } = await import('fs');

  const route = path.resolve(__dirname, `${contentJsonDirectory}/${locale}/${contentTypeId}/${slug || id}.json`);
  try {
    const entry = JSON.parse(await fsPromises.readFile(route, 'utf8'));
    return {
      ...entry,
      contentTypeId: entry._contentTypeId,
      id: entry._id,
      locale
    };
  } catch (e) {
    console.log(`unable to load page JSON for route: ${route}`);
    return null;
  }
};

export default readContentJSON;
