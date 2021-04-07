const readContentJSON = (contentJsonDirectory) => async ({ contentType, slug, locale }) => {
  const { promises: fsPromises } = await import('fs');

  try {
    const entry = JSON.parse(
      await fsPromises.readFile(`${contentJsonDirectory}/${locale}/${contentType}/${slug}.json`, 'utf8')
    );
    return {
      ...entry,
      locale
    };
  } catch (e) {
    console.log(`unable to load page JSON for slug: ${slug}, contentType: ${contentType}, locale: ${locale}`);
    return null;
  }
};

export default readContentJSON;
