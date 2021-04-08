const compose = (composers = {}) => async ({
  entry,
  displayType,
  locale = 'en-US'
}: {
  entry: any;
  displayType?: string;
  locale?: string;
}) => {
  const contentTypeId = entry?._contentTypeId || displayType;
  try {
    if (!entry) throw Error(`Compose:${contentTypeId}: Need to provide entry`);

    if (!composers[contentTypeId]) throw Error(`No composer for ${contentTypeId} content type`);
    const composed = await composers[contentTypeId]({
      entry,
      locale
    });
    return composed;
  } catch (e) {
    console.log(`Error: ${e.message}`);
    return entry;
  }
};

export default compose;
